import "./Home.css";
import korevaxLogo from "../../assets/Korevax.svg";

import { useLanguage } from "../../contexts/useLanguage";
import { CONTENT_TYPES } from "../../domain/catalog/content.types";
import { getContentByType } from "../../services/catalog/catalog.services";
import { ContentCard } from "../../components/Content/ContentCard/ContentCard";
import { Link } from "react-router-dom";
/*import { transition } from "@ionic/core/dist/types/utils/transition/index.js";*/

function Home() {
  const { translation } = useLanguage();

  return (
    <main className="home">
      <section className="home__hero">
        <div className="home__container">
          <div className="home__brand">
            <img
              className="home__logo"
              src={korevaxLogo}
              alt=""
              aria-hidden="true"
            />

            <h1 className="home__title">
              {translation.home.homeSection1.title}
            </h1>
          </div>

          <p className="home__subtitle">
            {translation.home.homeSection1.subtitle}
          </p>

          <p className="home__description">
            {translation.home.homeSection1.subtitle2}
          </p>
        </div>
      </section>

      <section className="home__section home__about" id="about">
        <div className="home__container">
          <span className="home__eyebrow">
            {translation.home.homeSection2.span}
          </span>

          <h2>{translation.home.homeSection2.title}</h2>

          <p>{translation.home.homeSection2.description1}</p>

          <p>{translation.home.homeSection2.description2}</p>
        </div>
      </section>

      <section className="home__section home__content-types" id="content-types">
        <div className="home__container">
          <span className="home__eyebrow">
            {translation.home.homeSection3.span}
          </span>

          <h2>{translation.home.homeSection3.title}</h2>

          <p className="home__section-intro">
            {translation.home.homeSection3.description}
          </p>

          <div className="home__content-list">
            {CONTENT_TYPES.map((type) => (
              <span key={type}>{translation.home.homeSection3.content[type]}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__catalogs" id="catalogs">
        <div className="home__container">
          <div className="home__catalog-heading">
            <div>
              <span className="home__eyebrow">{translation.catalog.types.movie} &amp; {translation.catalog.types.series}</span>
              <h2>{translation.catalog.title}</h2>
              <p className="home__section-intro">{translation.catalog.description}</p>
            </div>
            <Link className="home__catalog-link" to="/discover">{translation.catalog.allContent} <span aria-hidden="true">→</span></Link>
          </div>
          <p className="home__data-notice" role="note">{translation.catalog.demoNotice}</p>
          {([
            { type: "movie" as const, title: translation.catalog.types.movie, href: "/movies" },
            { type: "series" as const, title: translation.catalog.types.series, href: "/series" },
          ]).map((catalog) => {
            const items = getContentByType(catalog.type).slice(0, 4);
            return (
              <section className="home__catalog-group" key={catalog.type} aria-labelledby={`home-catalog-${catalog.type}`}>
                <div className="home__catalog-subheading">
                  <h3 id={`home-catalog-${catalog.type}`}>{catalog.title}</h3>
                  <Link to={catalog.href}>{translation.main.navigation.seeMore} <span aria-hidden="true">→</span></Link>
                </div>
                {items.length ? (
                  <div className="content-grid">
                    {items.map((item) => <ContentCard key={item.id} content={item} />)}
                  </div>
                ) : (
                  <p className="home__catalog-empty" role="status">{translation.catalog.noResults}</p>
                )}
              </section>
            );
          })}
        </div>
      </section>

      <section className="home__section home__different" id="different">
        <div className="home__container">
          <span className="home__eyebrow">{translation.home.homeSection5.span}</span>
          <h2>{translation.home.homeSection5.title}</h2>
          <p className="home__section-intro">{translation.home.homeSection5.description}</p>
          <div className="home__different-grid">
            {translation.home.homeSection5.items.map((item) => (
              <article className="home__different-item" key={item.title}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="home__section home__ecosystem" id="ecosystem">
        <div className="home__container">
          <span className="home__eyebrow">
            {translation.home.homeSection4.span}
          </span>

          <h2>{translation.home.homeSection4.title}</h2>

          <p className="home__section-intro">
            {translation.home.homeSection4.description.desc}
          </p>

          <div className="home__ecosystem-grid">
            <article className="home__ecosystem-item">
              <h3>{translation.home.homeSection4.description.title1}</h3>

              <p>{translation.home.homeSection4.description.desc1}</p>
            </article>

            <article className="home__ecosystem-item">
              <h3>{translation.home.homeSection4.description.title2}</h3>

              <p>{translation.home.homeSection4.description.desc2}</p>
            </article>

            <article className="home__ecosystem-item">
              <h3>{translation.home.homeSection4.description.title3}</h3>

              <p>{translation.home.homeSection4.description.desc3}</p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
