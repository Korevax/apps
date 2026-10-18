import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import type { ContentRatingSummary } from "../../../domain/ratings/rating.types";
import "./ContentRating.css";
interface ContentRatingProps { rating: ContentRatingSummary }
export function ContentRating({rating}:ContentRatingProps) {
 const hasRating=rating.average!==null&&rating.count>0;
 const average=hasRating?Math.min(10,Math.max(0,rating.average)):0;
 const count=new Intl.NumberFormat().format(rating.count);
 return <section className="content-rating" aria-label="Avaliação da comunidade">
  <div className="content-rating__score"><span className="content-rating__value">{hasRating?average.toFixed(1):"—"}</span><span className="content-rating__scale">{hasRating?"/10":"Sem avaliações"}</span></div>
  <div className="content-rating__details">
   <div className="content-rating__stars" aria-hidden="true">{Array.from({length:5},(_,i)=><IonIcon key={i} icon={hasRating&&average>=(i+1)*2?star:starOutline}/>)}</div>
   <p className="content-rating__count">{hasRating?count+" avaliações":"Seja o primeiro a avaliar"}</p>
  </div>
 </section>;
}
