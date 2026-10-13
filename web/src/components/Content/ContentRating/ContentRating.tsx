
import { IonIcon } from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import type { ContentRating as Rating } from "../../../domain/catalog/content.types";
import "./ContentRating.css";

interface ContentRatingProps {
  rating: Rating;
}

export function ContentRating({
  rating,
}: ContentRatingProps) {
  const hasRating =
    rating.average !== null &&
    rating.count > 0;

  const average = hasRating
    ? Math.min(10, Math.max(0, rating.average!))
    : 0;

  const formattedCount = new Intl.NumberFormat("pt-BR")
    .format(rating.count);

  return (
    <section
      className="content-rating"
      aria-label="Avaliação da comunidade"
    >
      <div className="content-rating__score">
        <span className="content-rating__value">
          {hasRating ? average.toFixed(1) : "—"}
        </span>
        <span className="content-rating__scale">
          {hasRating ? "/10" : "Sem avaliações"}
        </span>
      </div>

      <div className="content-rating__details">
        <div
          className="content-rating__stars"
          aria-hidden="true"
        >
          {Array.from({ length: 5 }, (_, index) => {
            const filled = hasRating && average >= (index + 1) * 2;

            return (
              <IonIcon
                key={index}
                icon={filled ? star : starOutline}
              />
            );
          })}
        </div>

        <p className="content-rating__count">
          {hasRating
            ? `${formattedCount} avaliações`
            : "Seja o primeiro a avaliar"}
        </p>
      </div>
    </section>
  );
}