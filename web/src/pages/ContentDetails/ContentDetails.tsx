import { useState } from "react";
import { TorrentSources } from "../../components/TorrentSources/TorrentSources";
import { IonIcon } from "@ionic/react";
import { bookmarkOutline,shareSocialOutline } from "ionicons/icons";
import { Link,useParams } from "react-router-dom";
import { getContentBySlug } from "../../services/catalog/catalog.services";
import { getContentRatingSummary } from "../../services/ratings/ratings.services";
import type { Content } from "../../domain/catalog/content.types";
import { ContentRating } from "../../components/Content/ContentRating/ContentRating";
import { GenreList } from "../../components/Content/GenreList/GenreList";
import { useLanguage } from "../../contexts/useLanguage";
import "./ContentDetails.css";

function specificFacts(content:Content,labels:Record<keyof typeof import("../../locales/pt-BR.json")["catalog"]["facts"],string>):Array<{label:string;value:string}>{
 switch(content.type){
  case "movie": case "documentary": return content.metadata?[
   ...(content.metadata.runtimeMinutes?[{label:labels.duration,value:content.metadata.runtimeMinutes+" min"}]:[]),
   ...(content.metadata.productionCountries?.length?[{label:labels.productionCountries,value:content.metadata.productionCountries.join(", ")}]:[])
  ]:[];
  case "series": return content.metadata?[
   ...(content.metadata.totalSeasons!==undefined?[{label:labels.seasons,value:String(content.metadata.totalSeasons)}]:[]),
   ...(content.metadata.totalEpisodes!==undefined?[{label:labels.episodes,value:String(content.metadata.totalEpisodes)}]:[])
  ]:[];
  case "book": return content.metadata?[
   ...(content.metadata.pageCount?[{label:labels.pages,value:String(content.metadata.pageCount)}]:[]),
   ...(content.metadata.publisher?[{label:labels.publisher,value:content.metadata.publisher}]:[]),
   ...(content.metadata.isbn13?[{label:labels.isbn13,value:content.metadata.isbn13}]:[])
  ]:[];
  case "manga": case "manhwa": return content.metadata?[
   ...(content.metadata.volumeCount!==undefined?[{label:labels.volumes,value:String(content.metadata.volumeCount)}]:[]),
   ...(content.metadata.chapterCount!==undefined?[{label:labels.chapters,value:String(content.metadata.chapterCount)}]:[])
  ]:[];
  case "music": return content.metadata?.durationSeconds!==undefined?[{label:labels.duration,value:Math.floor(content.metadata.durationSeconds/60)+" min "+content.metadata.durationSeconds%60+" s"}]:[];
  case "podcast": return content.metadata?.episodeCount!==undefined?[{label:labels.episodes,value:String(content.metadata.episodeCount)}]:[];
  case "game": return content.metadata?[
   ...(content.metadata.platforms?.length?[{label:labels.platforms,value:content.metadata.platforms.join(", ")}]:[]),
   ...(content.metadata.gameModes?.length?[{label:labels.gameModes,value:content.metadata.gameModes.join(", ")}]:[])
  ]:[];
  case "animation": case "anime": return content.metadata?.animationMedium?[{label:labels.animationMedium,value:content.metadata.animationMedium}]:[];
 }
}

export function ContentDetails(){
 const {slug}=useParams<{slug:string}>();
 const {translation}=useLanguage();
 const [shareMessage,setShareMessage]=useState("");
 const content=slug?getContentBySlug(slug):undefined;
 if(!content)return <main className="content-details"><div className="content-details__container">
  <h1>{translation.NotFoundPage.title}</h1><p>{translation.NotFoundPage.desc}</p><Link to="/discover">{translation.main.navigation.discover}</Link>
 </div></main>;

 const contentTitle=content.title;
 const rating=getContentRatingSummary(content.id);
 const typeLabel=translation.catalog.types[content.type];
 const year=content.releaseDate?.slice(0,4);
 const facts=specificFacts(content,translation.catalog.facts);
 async function share(){
  const url=window.location.href;
  try{
   if(typeof navigator.share==="function"){await navigator.share({title:contentTitle,url});setShareMessage(translation.catalog.shareSuccess);}
   else if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(url);setShareMessage(translation.catalog.shareSuccess);}
   else setShareMessage(translation.catalog.shareUnavailable);
  }catch(error){if(error instanceof Error&&error.name==="AbortError")return;setShareMessage(translation.catalog.shareUnavailable);}
 }
 return <main className="content-details">
  {content.backdropUrl?<img className="content-details__backdrop-image" src={content.backdropUrl} alt="" aria-hidden="true" onError={e=>{e.currentTarget.hidden=true;}}/>:null}
  <div className="content-details__container">
   <nav className="content-details__breadcrumb" aria-label={translation.catalog.breadcrumb}>
    <Link to="/">{translation.catalog.home}</Link><span aria-hidden="true">/</span><Link to="/discover">{translation.main.navigation.discover}</Link><span aria-hidden="true">/</span><span aria-current="page">{content.title}</span>
   </nav>
   <p className="content-details__demo-notice" role="note">{translation.catalog.demoNotice}</p>
   <section className="content-hero">
    <div className="content-hero__poster">
     {content.posterUrl?<img className="content-hero__poster-image" src={content.posterUrl} alt={translation.catalog.posterAlt+" "+content.title} onError={e=>{e.currentTarget.hidden=true;}}/>:null}
     <span className="content-hero__poster-title">{content.title}</span><span className="content-hero__poster-caption">KOREVAX</span>
    </div>
    <div className="content-hero__information">
     <p className="content-hero__eyebrow">{typeLabel}</p><h1 className="content-hero__title">{content.title}</h1>
     {content.originalTitle&&content.originalTitle!==content.title?<p className="content-hero__original-title">{content.originalTitle}</p>:null}
     {content.alternativeTitles.length?<p className="content-hero__original-title">{translation.catalog.alsoKnownAs}: {content.alternativeTitles.join(", ")}</p>:null}
     <ul className="content-hero__metadata" aria-label={translation.catalog.basicInformation}>
      {year?<li>{year}</li>:null}<li>{typeLabel}</li>{content.originalLanguage?<li>{content.originalLanguage}</li>:null}
     </ul>
     <GenreList genres={content.genres}/><div className="content-hero__rating"><ContentRating rating={rating}/></div>
     <div className="content-hero__actions">
      <button type="button" className="content-hero__button content-hero__button--primary" disabled aria-label={translation.catalog.ratingComingSoon}>
       <IonIcon icon={bookmarkOutline} aria-hidden="true"/>{translation.catalog.ratingComingSoon}
      </button>
      <button type="button" className="content-hero__button" onClick={share}><IonIcon icon={shareSocialOutline} aria-hidden="true"/>{translation.catalog.share}</button>
     </div>
     {shareMessage?<p className="content-details__muted" role="status">{shareMessage}</p>:null}
    </div>
   </section>
   {content.synopsis?<section className="content-details__section"><h2>{translation.catalog.synopsis}</h2><p className="content-details__synopsis">{content.synopsis}</p></section>:null}
   <section className="content-details__section"><h2>{translation.catalog.information}</h2>
    <dl className="content-details__facts">
     <div><dt>{translation.catalog.type}</dt><dd>{typeLabel}</dd></div>
     <div><dt>{translation.catalog.releaseDate}</dt><dd>{content.releaseDate??translation.catalog.notAvailable}</dd></div>
     {content.originalLanguage?<div><dt>{translation.catalog.originalLanguage}</dt><dd>{content.originalLanguage}</dd></div>:null}
     {facts.map(f=><div key={f.label}><dt>{f.label}</dt><dd>{f.value}</dd></div>)}
    </dl>
   </section>
   <TorrentSources contentId={content.id}/>
   <section className="content-details__section"><h2>{translation.catalog.tags}</h2>
    {content.tags.length?<ul className="content-details__tags">{content.tags.map(tag=><li key={tag}>{tag}</li>)}</ul>:<p className="content-details__muted">{translation.catalog.notAvailable}</p>}
   </section>
  </div>
 </main>;
}
