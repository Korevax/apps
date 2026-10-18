import { useLanguage } from "../../contexts/useLanguage";
import "./News.css";

export default function News() {
  const { translation } = useLanguage();
  const labels = translation.newsPage;
  return (
    <main className="news-page">
      <header className="news-page__hero">
        <div className="news-page__container">
          <p className="news-page__eyebrow">Korevax / {translation.footer.news}</p>
          <h1>{labels.title}</h1>
          <p>{labels.description}</p>
        </div>
      </header>
      <section className="news-page__container news-page__content" role="status">
        <h2>{labels.emptyTitle}</h2>
        <p>{labels.emptyDescription}</p>
      </section>
    </main>
  );
}
