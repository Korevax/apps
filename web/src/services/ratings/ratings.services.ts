import type { ContentRatingSummary } from "../../domain/ratings/rating.types";
/** Dados sintéticos de desenvolvimento; em produção vêm de serviço persistente. */
const summaries:Readonly<Record<string,ContentRatingSummary>>={
 "movie-filme-x":{average:8.7,count:1248},
 "book-cidade-de-vidro":{average:8.2,count:326},
 "anime-orbita-zero":{average:9.1,count:874},
 "game-vale-eco":{average:7.9,count:219}
};
export function getContentRatingSummary(id:string):ContentRatingSummary {
 const value=summaries[id];
 return value?{average:value.average,count:value.count}:{average:null,count:0};
}
