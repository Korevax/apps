import { mockContents } from "../../data/mockContent";
import type { Content, ContentType } from "../../domain/catalog/content.types";
import { getContentIntegrityErrors, isContentBusinessValid } from "../../domain/catalog/content.rules";
import { getContentRatingSummary } from "../ratings/ratings.services";
const source:readonly unknown[]=mockContents;
function validCatalog():Content[] {
 const valid=source.filter(isContentBusinessValid), ids=new Map<string,number>(), slugs=new Map<string,number>();
 for(const c of valid){ids.set(c.id,(ids.get(c.id)??0)+1);slugs.set(c.slug,(slugs.get(c.slug)??0)+1);}
 return valid.filter(c=>ids.get(c.id)===1&&slugs.get(c.slug)===1);
}
export function getAllContent():Content[]{return validCatalog().filter(c=>c.status==="published");}
export function getContentById(id:string):Content|undefined {if(typeof id!=="string"||!id.trim())return undefined;return getAllContent().find(c=>c.id===id);}
export function getContentBySlug(slug:string):Content|undefined {if(typeof slug!=="string"||!slug.trim())return undefined;return getAllContent().find(c=>c.slug===slug);}
export function getContentByType(type:ContentType):Content[]{return getAllContent().filter(c=>c.type===type);}
export interface ContentSearchOptions {query?:string;type?:ContentType;genre?:string;tag?:string}
const norm=(s:string)=>s.trim().normalize("NFKC").toLocaleLowerCase();
export function searchContent(options:ContentSearchOptions={}):Content[] {
 const q=typeof options.query==="string"?norm(options.query):"",g=typeof options.genre==="string"?norm(options.genre):"",t=typeof options.tag==="string"?norm(options.tag):"";
 return getAllContent().filter(c=>{
  if(options.type&&c.type!==options.type)return false;
  if(g&&!c.genres.some(x=>norm(x)===g))return false;
  if(t&&!c.tags.some(x=>norm(x)===t))return false;
  if(!q)return true;
  return [c.title,c.originalTitle??"",...c.alternativeTitles,c.synopsis??"",...c.genres,...c.tags].some(x=>norm(x).includes(q));
 });
}
function limitValue(n:number):number{return Number.isSafeInteger(n)?Math.max(0,Math.min(n,100)):8;}
export function getRecentContent(limit=8):Content[]{return getAllContent().slice().sort((a,b)=>Date.parse(b.updatedAt)-Date.parse(a.updatedAt)).slice(0,limitValue(limit));}
export function getPopularContent(limit=8):Content[]{return getAllContent().slice().sort((a,b)=>getContentRatingSummary(b.id).count-getContentRatingSummary(a.id).count||a.title.localeCompare(b.title)).slice(0,limitValue(limit));}
export function validateCatalogRecord(value:unknown):string[]{return getContentIntegrityErrors(value);}
