import type { Content } from "./content.types";
import { getContentValidationErrors, isContent } from "./content.validation";
const normalize=(s:string)=>s.trim().normalize("NFKC").toLowerCase();
const duplicates=(items:string[])=>new Set(items.map(normalize)).size!==items.length;
export function getContentBusinessRuleErrors(content:Content):string[] {
 const errors:string[]=[];
 if(duplicates(content.genres))errors.push("genres não pode conter gêneros duplicados.");
 if(duplicates(content.tags))errors.push("tags não pode conter etiquetas duplicadas.");
 if(duplicates(content.alternativeTitles))errors.push("alternativeTitles não pode conter títulos duplicados.");
 if(Date.parse(content.updatedAt)<Date.parse(content.createdAt))errors.push("updatedAt não pode ser anterior a createdAt.");
 if(content.originalTitle&&normalize(content.originalTitle)===normalize(content.title))errors.push("originalTitle não deve repetir title.");
 return errors;
}
export function getContentIntegrityErrors(value:unknown):string[] {
 const structural=getContentValidationErrors(value);
 if(structural.length||!isContent(value))return structural;
 return getContentBusinessRuleErrors(value);
}
export function isContentBusinessValid(value:unknown):value is Content{return getContentIntegrityErrors(value).length===0;}
export function validateContentIntegrity(value:unknown):{success:true;data:Content}|{success:false;errors:string[]} {
 const errors=getContentIntegrityErrors(value);
 if(errors.length||!isContent(value))return {success:false,errors:errors.length?errors:["O conteúdo não passou pela validação."]};
 return {success:true,data:value};
}
export function getCatalogIntegrityErrors(values:unknown):string[] {
 if(!Array.isArray(values))return ["O catálogo precisa ser uma lista de registros."];
 const errors:string[]=[], valid:Content[]=[];
 values.forEach((value,index)=>{const e=getContentIntegrityErrors(value);if(e.length||!isContent(value))errors.push("Registro "+index+": "+(e.length?e.join(" "):"estrutura inválida."));else valid.push(value);});
 const ids=new Set<string>(),slugs=new Set<string>();
 for(const c of valid){if(ids.has(c.id))errors.push("id duplicado: "+c.id);if(slugs.has(c.slug))errors.push("slug duplicado: "+c.slug);ids.add(c.id);slugs.add(c.slug);}
 return errors;
}
