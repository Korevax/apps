import { IonIcon } from "@ionic/react";
import { bookmarkOutline, download, shareSocialOutline } from "ionicons/icons";

import { Link, useParams } from "react-router-dom";
import { getContentBySlug } from "../../services/catalog/catalog.services";

import { ContentRating } from "../../components/Content/ContentRating/ContentRating";
import { GenreList } from "../../components/Content/GenreList/GenreList";

import "./ContentDetails.css";

const contentTypeLabels: Record<string, string> = {
  movie: "Filme",
  series: "Série",
  animation: "Animação",
  anime: "Anime",
  book: "Livro",
  manga: "Mangá",
  manhwa: "Manhwa",
  music: "Música",
  podcast: "Podcast",
  game: "Jogo",
  documentary: "Documentário",
};

export function ContentDetails() {
  const { slug } = useParams<{ slug: string }>();

  const content = slug ? getContentBySlug(slug) : undefined;

  if (!content) {
    return (
      <main className="content-details">
        <div className="content-details__container">
          <h1>Conteúdo não encontrado</h1>
          <p>Este conteúdo não existe no catálogo ou não está disponível.</p>
          <Link to="/discover">Voltar a descobrir</Link>
        </div>
      </main>
    );
  }

  const contentTitle = content.title;

  const releaseYear = content.releaseDate
    ? content.releaseDate.slice(0, 4)
    : null;

  const duration =
    content.durationMinutes != null
      ? `${Math.floor(content.durationMinutes / 60)}h ${
          content.durationMinutes % 60
        }min`
      : null;

  const metadata = [
    releaseYear,
    duration,
    contentTypeLabels[content.type] ?? "Conteúdo",
  ].filter(Boolean);

  async function handleShare() {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: contentTitle,
          url,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
      }
    } catch (error) {
      // Cancelar o compartilhamento é uma ação normal.
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }

      console.error("Não foi possível compartilhar o conteúdo.");
    }
  }

  return (
    <main className="content-details">
      <div className="content-details__backdrop" aria-hidden="true" />

      <div className="content-details__container">
        <nav
          className="content-details__breadcrumb"
          aria-label="Navegação estrutural"
        >
          <Link to="/">Início</Link>
          <span aria-hidden="true">/</span>
          <Link to="/discover">Descobrir</Link>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{content.title}</span>
        </nav>

        <section className="content-hero">
          <div
            className="content-hero__poster"
            role="img"
            aria-label={`Capa ilustrativa de ${content.title}`}
          >
            <span className="content-hero__poster-title">{content.title}</span>
            <span className="content-hero__poster-caption">KOREVAX</span>
          </div>

          <div className="content-hero__information">
            <p className="content-hero__eyebrow">
              {contentTypeLabels[content.type] ?? "Conteúdo"}
            </p>

            <h1 className="content-hero__title">{content.title}</h1>

            {content.originalTitle &&
              content.originalTitle !== content.title && (
                <p className="content-hero__original-title">
                  {content.originalTitle}
                </p>
              )}

            <ul
              className="content-hero__metadata"
              aria-label="Informações básicas"
            >
              {metadata.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>

            <GenreList genres={content.genres} />

            <div className="content-hero__rating">
              <ContentRating rating={content.rating} />
            </div>

            <div className="content-hero__actions">
              <button
                type="button"
                className="content-hero__button content-hero__button--primary"
                onClick={() => {
                  // A avaliação será implementada posteriormente.
                }}
                aria-label={`Avaliar ${content.title}`}
              >
                <IonIcon icon={bookmarkOutline} aria-hidden="true" />
                Avaliar conteúdo
              </button>

              <button
                type="button"
                className="content-hero__button"
                onClick={handleShare}
              >
                <IonIcon icon={shareSocialOutline} aria-hidden="true" />
                Compartilhar
              </button>

              <button
                type="button"
                className="content-hero__button content-magnet"
              >
                <IonIcon icon={download} aria-hidden="true" />
                Magnet
              </button>
            </div>
          </div>
        </section>

        <section className="content-details__section">
          <h2>Sinopse</h2>
          <p className="content-details__synopsis">{content.synopsis}</p>
        </section>

        <section className="content-details__section">
          <h2>Informações</h2>

          <dl className="content-details__facts">
            <div>
              <dt>Tipo</dt>
              <dd>{contentTypeLabels[content.type] ?? "Conteúdo"}</dd>
            </div>

            <div>
              <dt>Lançamento</dt>
              <dd>{content.releaseDate ?? "Não informado"}</dd>
            </div>

            <div>
              <dt>Duração</dt>
              <dd>
                {duration ?? (
                  <span className="content-details__muted">
                    Não aplicável ou não informada
                  </span>
                )}
              </dd>
            </div>
          </dl>
        </section>

        <section className="content-details__section">
          <h2>Conteúdos relacionados</h2>
          <p className="content-details__muted">
            Os conteúdos relacionados serão exibidos aqui quando o catálogo e as
            relações estiverem disponíveis.
          </p>
        </section>
      </div>
    </main>
  );
}
