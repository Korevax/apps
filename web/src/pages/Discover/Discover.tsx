import { useMemo,useState } from "react";
import { Link,useSearchParams } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowForward,searchOutline } from "ionicons/icons";
import { useLanguage } from "../../contexts/useLanguage";
import { CONTENT_TYPES,type ContentType } from "../../domain/catalog/content.types";
import { getAllContent,getPopularContent,getRecentContent,searchContent } from "../../services/catalog/catalog.services";
import { ContentCard } from "../../components/Content/ContentCard/ContentCard";
import "./Discover.css";

function Discover(){
 const {translation}=useLanguage();
 const [query,setQuery]=useState("");
 const [type,setType]=useState<ContentType|"all">("all");
 const [genre,setGenre]=useState("all");
 const [params]=useSearchParams();
 const sort=params.get("sort");
 const sorted=sort==="recent"||sort==="popular";
 const recent=getRecentContent(6),popular=getPopularContent(6),all=getAllContent();
 const genres=[...new Set(all.flatMap(item=>item.genres))].sort((a,b)=>a.localeCompare(b));
 const results=useMemo(()=>{
  const found=searchContent({query,type:type==="all"?undefined:type,genre:genre==="all"?undefined:genre});
  if(sort==="recent"||sort==="popular"){
   const orderItems=sort==="recent"?getRecentContent(100):getPopularContent(100);
   const order=new Map(orderItems.map((item,index)=>[item.id,index]));
   return found.slice().sort((a,b)=>(order.get(a.id)??1000)-(order.get(b.id)??1000));
  }
  return found;
 },[query,type,genre,sort]);
 const filtering=!!query.trim()||type!=="all"||genre!=="all"||sorted;
 return <main className="discover-page">
  <section className="discover-page__hero"><div className="discover-page__hero-inner">
   <p className="discover-page__eyebrow">{translation.main.navigation.discover}</p>
   <h1>{translation.catalog.title}</h1><p>{translation.catalog.description}</p>
   <form className="discover-search" role="search" onSubmit={e=>e.preventDefault()}>
    <IonIcon icon={searchOutline} aria-hidden="true"/>
    <input type="search" value={query} onChange={e=>setQuery(e.currentTarget.value)} placeholder={translation.catalog.searchPlaceholder} aria-label={translation.catalog.searchLabel}/>
    {query?<button type="button" onClick={()=>setQuery("")}>{translation.catalog.clear}</button>:null}
   </form>
   <label className="discover-filter"><span>{translation.catalog.filterType}</span>
    <select value={type} onChange={e=>setType(e.currentTarget.value as ContentType|"all")}>
     <option value="all">{translation.catalog.allTypes}</option>
     {CONTENT_TYPES.map(item=><option key={item} value={item}>{translation.catalog.types[item]}</option>)}
    </select>
   </label>
   <label className="discover-filter"><span>{translation.catalog.filterGenre}</span>
    <select value={genre} onChange={e=>setGenre(e.currentTarget.value)}>
     <option value="all">{translation.catalog.allGenres}</option>
     {genres.map(item=><option key={item} value={item}>{item}</option>)}
    </select>
   </label>
  </div></section>
  <div className="discover-page__content">
   {filtering?<section className="discover-section" aria-labelledby="discover-results-heading">
    <div className="discover-section__header"><div><p className="discover-page__eyebrow">{translation.catalog.results}</p>
     <h2 id="discover-results-heading">{sort==="recent"?translation.catalog.recentTitle:sort==="popular"?translation.catalog.popularTitle:translation.catalog.results}</h2></div>
     <span className="discover-section__count">{results.length}</span></div>
    {results.length?<div className="content-grid">{results.map(item=><ContentCard key={item.id} content={item}/>)}</div>:<p className="discover-empty" role="status">{translation.catalog.noResults}</p>}
   </section>:<>
    <section className="discover-section" id="recent-content" aria-labelledby="recent-heading">
     <div className="discover-section__header"><div><p className="discover-page__eyebrow">{translation.main.navigation.recent}</p><h2 id="recent-heading">{translation.catalog.recentTitle}</h2></div>
      <Link className="discover-more" to="/discover?sort=recent">{translation.main.navigation.seeMore}<IonIcon icon={arrowForward} aria-hidden="true"/></Link></div>
     <div className="content-grid">{recent.map(item=><ContentCard key={item.id} content={item}/>)}</div>
    </section>
    <section className="discover-section" id="popular-content" aria-labelledby="popular-heading">
     <div className="discover-section__header"><div><p className="discover-page__eyebrow">{translation.main.navigation.popular}</p><h2 id="popular-heading">{translation.catalog.popularTitle}</h2></div>
      <Link className="discover-more" to="/discover?sort=popular">{translation.main.navigation.seeMore}<IonIcon icon={arrowForward} aria-hidden="true"/></Link></div>
     <div className="content-grid">{popular.map(item=><ContentCard key={item.id} content={item}/>)}</div>
    </section>
    <section className="discover-section" id="all-content" aria-labelledby="all-heading">
     <div className="discover-section__header"><div><p className="discover-page__eyebrow">{translation.catalog.collection}</p><h2 id="all-heading">{translation.catalog.allContent}</h2></div><span className="discover-section__count">{all.length}</span></div>
     <div className="content-grid">{all.map(item=><ContentCard key={item.id} content={item}/>)}</div>
    </section>
   </>}
  </div>
 </main>;
}
export default Discover;
