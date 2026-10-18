import { CONTENT_STATUSES, CONTENT_TYPES, type Content, type ContentStatus, type ContentType } from "./content.types";
const TYPES: ReadonlySet<string> = new Set(CONTENT_TYPES);
const STATUSES: ReadonlySet<string> = new Set(CONTENT_STATUSES);
const SLUG = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGUAGE = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
const TIMESTAMP = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.\d{1,3})?(Z|([+-])(\d{2}):(\d{2}))$/;
function record(v: unknown): v is Record<string, unknown> { return typeof v === "object" && v !== null && !Array.isArray(v); }
function nonEmpty(v: unknown): v is string { return typeof v === "string" && v.trim().length > 0; }
function nullableString(v: unknown): boolean { return v === undefined || v === null || typeof v === "string"; }
function isType(v: unknown): v is ContentType { return typeof v === "string" && TYPES.has(v); }
function isStatus(v: unknown): v is ContentStatus { return typeof v === "string" && STATUSES.has(v); }
function validDate(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(v);
  if (!m) return false;
  const y=Number(m[1]), mo=Number(m[2]), d=Number(m[3]);
  return y >= 1 && mo >= 1 && mo <= 12 && d >= 1 && d <= new Date(Date.UTC(y,mo,0)).getUTCDate();
}
function validTimestamp(v: unknown): v is string {
  if (typeof v !== "string") return false;
  const m=TIMESTAMP.exec(v);
  if (!m || !validDate(m[1]+"-"+m[2]+"-"+m[3])) return false;
  if (Number(m[4])>23 || Number(m[5])>59 || Number(m[6])>59) return false;
  if (m[7]!=="Z" && (Number(m[9])>14 || Number(m[10])>59 || (Number(m[9])===14 && Number(m[10])!==0))) return false;
  return Number.isFinite(Date.parse(v));
}
/** Accept safe local paths or HTTP(S) URLs without embedded credentials. */
export function isSafeImageUrl(v: unknown): v is string {
  if (typeof v!=="string" || v.length>2048 || v.trim()!==v || /[\u0000-\u001F\u007F]/.test(v)) return false;
  if (v.startsWith("/")) return !v.startsWith("//") && !v.includes("\\");
  try { const u=new URL(v); return (u.protocol==="https:"||u.protocol==="http:") && !!u.hostname && !u.username && !u.password; }
  catch { return false; }
}
function strings(v: unknown): v is string[] { return Array.isArray(v)&&v.length<=200&&v.every(x=>nonEmpty(x)&&x.length<=200); }
function positive(v: unknown): boolean { return typeof v==="number"&&Number.isSafeInteger(v)&&v>0; }
function nonNegative(v: unknown): boolean { return typeof v==="number"&&Number.isSafeInteger(v)&&v>=0; }
function oneOf(v: unknown, list: readonly string[]): boolean { return typeof v==="string"&&list.includes(v); }
function isbn13(v: unknown): boolean {
  if (typeof v!=="string"||!/^\d{13}$/.test(v)) return false;
  const sum=v.slice(0,12).split("").reduce((n,d,i)=>n+Number(d)*(i%2===0?1:3),0);
  return (10-sum%10)%10===Number(v[12]);
}
function metadataErrors(type: ContentType, v: unknown): string[] {
  if (v===undefined) return [];
  if (!record(v)) return ["metadata deve ser um objeto."];
  const allowed: Record<ContentType, readonly string[]> = {
    movie: ["runtimeMinutes", "productionCountries"],
    series: ["totalSeasons", "totalEpisodes", "seriesStatus"],
    animation: ["animationMedium"],
    anime: ["animationMedium"],
    book: ["pageCount", "isbn13", "publisher"],
    manga: ["chapterCount", "volumeCount", "publicationStatus"],
    manhwa: ["chapterCount", "volumeCount", "publicationStatus"],
    music: ["durationSeconds", "isrc"],
    podcast: ["episodeCount", "podcastStatus"],
    game: ["platforms", "gameModes"],
    documentary: ["runtimeMinutes", "productionCountries"],
  };
  const e:string[]=[];
  for (const key of Object.keys(v)) {
    if (!allowed[type].includes(key)) e.push("metadata." + key + " não é permitido para o tipo " + type + ".");
  }
  const pos=(k:string)=>{if(v[k]!==undefined&&!positive(v[k]))e.push("metadata."+k+" deve ser inteiro positivo.");};
  const nn=(k:string)=>{if(v[k]!==undefined&&!nonNegative(v[k]))e.push("metadata."+k+" deve ser inteiro não negativo.");};
  const arr=(k:string)=>{if(v[k]!==undefined&&!strings(v[k]))e.push("metadata."+k+" deve ser uma lista de strings.");};
  const en=(k:string,a:readonly string[])=>{if(v[k]!==undefined&&!oneOf(v[k],a))e.push("metadata."+k+" contém valor inválido.");};
  switch(type) {
    case "movie": case "documentary": pos("runtimeMinutes"); arr("productionCountries"); break;
    case "series": pos("totalSeasons"); pos("totalEpisodes"); en("seriesStatus",["ongoing","ended","cancelled","unknown"]); break;
    case "animation": case "anime": en("animationMedium",["2d","3d","stop-motion","mixed","unknown"]); break;
    case "book": pos("pageCount"); if(v.isbn13!==undefined&&!isbn13(v.isbn13))e.push("metadata.isbn13 inválido."); if(v.publisher!==undefined&&!nonEmpty(v.publisher))e.push("metadata.publisher deve ser string não vazia."); break;
    case "manga": case "manhwa": pos("chapterCount"); pos("volumeCount"); en("publicationStatus",["ongoing","completed","hiatus","unknown"]); break;
    case "music": pos("durationSeconds"); if(v.isrc!==undefined&&(typeof v.isrc!=="string"||!/^[A-Z]{2}[A-Z0-9]{3}\d{7}$/.test(v.isrc)))e.push("metadata.isrc inválido."); break;
    case "podcast": nn("episodeCount"); en("podcastStatus",["ongoing","ended","paused","unknown"]); break;
    case "game": arr("platforms"); if(v.gameModes!==undefined&&(!Array.isArray(v.gameModes)||!v.gameModes.every(x=>oneOf(x,["single-player","multiplayer","co-op"]))))e.push("metadata.gameModes inválido."); break;
  }
  return e;
}
export function getContentValidationErrors(v: unknown): string[] {
  if(!record(v))return ["O conteúdo precisa ser um objeto."];
  const e:string[]=[];
  if(!nonEmpty(v.id)||v.id.length>128)e.push("id deve ser string não vazia de até 128 caracteres.");
  if(!nonEmpty(v.slug)||v.slug.length>160||!SLUG.test(v.slug))e.push("slug deve conter letras minúsculas, números e hífens.");
  if(!nonEmpty(v.title)||v.title.length>300)e.push("title deve ser string não vazia de até 300 caracteres.");
  if(!nullableString(v.originalTitle)||(typeof v.originalTitle==="string"&&v.originalTitle.length>300))e.push("originalTitle inválido.");
  if(!isType(v.type))e.push("type não corresponde a categoria permitida.");
  if(!isStatus(v.status))e.push("status não corresponde a estado editorial permitido.");
  if(!Array.isArray(v.alternativeTitles)||v.alternativeTitles.length>100||!v.alternativeTitles.every(x=>nonEmpty(x)&&x.length<=300))e.push("alternativeTitles deve ser lista de títulos não vazios.");
  if(v.synopsis!==null&&(typeof v.synopsis!=="string"||v.synopsis.length>20000))e.push("synopsis deve ser string de até 20000 caracteres ou null.");
  if(!strings(v.genres))e.push("genres deve ser lista de strings não vazias.");
  if(!strings(v.tags))e.push("tags deve ser lista de strings não vazias.");
  if(v.releaseDate!==undefined&&v.releaseDate!==null&&!validDate(v.releaseDate))e.push("releaseDate deve ser data real YYYY-MM-DD.");
  if(!nullableString(v.originalLanguage)||(typeof v.originalLanguage==="string"&&!LANGUAGE.test(v.originalLanguage)))e.push("originalLanguage inválido.");
  for(const k of ["posterUrl","backdropUrl"] as const)if(v[k]!==undefined&&v[k]!==null&&!isSafeImageUrl(v[k]))e.push(k+" deve ser URL HTTP(S) segura ou caminho local.");
  if(!validTimestamp(v.createdAt))e.push("createdAt deve ser ISO 8601 com fuso explícito.");
  if(!validTimestamp(v.updatedAt))e.push("updatedAt deve ser ISO 8601 com fuso explícito.");
  if(isType(v.type))e.push(...metadataErrors(v.type,v.metadata));
  return e;
}
export function isContent(v: unknown): v is Content { return getContentValidationErrors(v).length===0; }
export function validateContent(v: unknown): {success:true;data:Content}|{success:false;errors:string[]} {
  const errors=getContentValidationErrors(v);
  return errors.length?{success:false,errors}:{success:true,data:v as Content};
}
