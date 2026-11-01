import { useState } from "react";
import { Link } from "react-router-dom";
import type { Content } from "../../../domain/catalog/content.types";
import type { LocaleCode } from "../../../domain/catalog/taxonomy.types";
import { getGenreById, getGenreLabel } from "../../../services/catalog/taxonomy.services";
import { LoadingIndicator } from "../../LoadingIndicator/LoadingIndicator";
import { getContentRatingSummary } from "../../../services/ratings/ratings.services";
import { useLanguage } from "../../../contexts/useLanguage";
import "./ContentCard.css";
interface ContentCardProps { content: Content }
export function ContentCard({content}:ContentCardProps) {
 const {translation,locale}=useLanguage();
 const [posterLoading,setPosterLoading]=useState(Boolean(content.posterUrl));
 const rating=getContentRatingSummary(content.id);
 const year=content.releaseDate?.slice(0,4);
 const typeLabel=translation.catalog.types[content.type];
 const genreLabels=content.genreIds.map(id=>getGenreById(id)).filter((genre):genre is NonNullable<typeof genre>=>Boolean(genre)).map(genre=>getGenreLabel(genre,locale as LocaleCode));
 return <article className="content-card">
  <Link className="content-card__link" to={"/content/"+encodeURIComponent(content.slug)} aria-label={content.title+" — "+typeLabel}>
   <div className="content-card__poster">
    {content.posterUrl?<> {posterLoading?<LoadingIndicator className="content-card__poster-loader" label={translation.catalog.loading}/>:null}<img className="content-card__image" src={content.posterUrl} alt="" loading="lazy" decoding="async" onLoad={()=>setPosterLoading(false)} onError={e=>{setPosterLoading(false);e.currentTarget.hidden=true;}}/></>:null}
    <span className="content-card__placeholder" aria-hidden="true">{content.title}</span>
    <span className="content-card__type">{typeLabel}</span>
   </div>
   <div className="content-card__body">
    <h3 className="content-card__title">{content.title}</h3>
    <div className="content-card__meta">{year?<span>{year}</span>:null}
     {rating.average!==null&&rating.count>0?<span className="content-card__rating" aria-label={rating.average.toFixed(1)+" / 10, "+rating.count+" avaliações"}><span aria-hidden="true">★</span> {rating.average.toFixed(1)}</span>:<span>{translation.catalog.noRating}</span>}
    </div>
    {genreLabels.length?<p className="content-card__genres">{genreLabels.slice(0,2).join(" · ")}</p>:null}
   </div>
  </Link>
 </article>;
}
