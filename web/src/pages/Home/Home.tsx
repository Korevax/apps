import "./Home.css";
import korevaxLogo from "../../assets/Korevax.svg";

import { useLanguage } from "../../contexts/useLanguage";
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
            <span>{translation.home.homeSection3.content.Movie}</span>
            <span>{translation.home.homeSection3.content.Serie}</span>
            <span>{translation.home.homeSection3.content.Anime}</span>
            <span>{translation.home.homeSection3.content.Animation}</span>
            <span>{translation.home.homeSection3.content.Book}</span>
            <span>{translation.home.homeSection3.content.Manga}</span>
            <span>{translation.home.homeSection3.content.Manhwa}</span>
            <span>{translation.home.homeSection3.content.Music}</span>
            <span>{translation.home.homeSection3.content.Podcast}</span>
            <span>{translation.home.homeSection3.content.Games}</span>
            <span>{translation.home.homeSection3.content.Documentaries}</span>
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
