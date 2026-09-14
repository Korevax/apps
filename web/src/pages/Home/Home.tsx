import "./Home.css";
import korevaxLogo from "../../assets/Korevax.svg";

function Home() {
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

            <h1 className="home__title">Korevax</h1>
          </div>

          <p className="home__subtitle">
            Descubra, organize e conecte conteúdos.
          </p>

          <p className="home__description">
            Seu novo buscador de conteúdos digitais, reunindo informações sobre
            filmes, séries, livros, músicas e muito mais.
          </p>
        </div>
      </section>

      <section className="home__section home__about" id="about">
        <div className="home__container">
          <span className="home__eyebrow">Sobre o projeto</span>

          <h2>O que é o Korevax?</h2>

          <p>
            O Korevax é um ecossistema open-source criado para facilitar a
            descoberta, organização e exploração de conteúdos digitais. Visando
            a preservação e o acesso a informações, o projeto busca reunir
            diferentes tipos de conteúdo em uma base aberta e estruturada,
            permitindo que pessoas possam encontrar, explorar e relacionar
            obras, entidades e informações de forma simples e organizada.
          </p>

          <p>
            Essa estrutura permite conectar obras, entidades e informações,
            criando uma base que pode ser explorada por pessoas, colaboradores e
            diferentes aplicações.
          </p>
        </div>
      </section>

      <section className="home__section home__content-types" id="content-types">
        <div className="home__container">
          <span className="home__eyebrow">Conteúdos</span>

          <h2>Um espaço para diferentes tipos de conteúdo</h2>

          <p className="home__section-intro">
            O Korevax foi pensado para organizar diferentes formas de conteúdo
            digital em uma estrutura única e conectada.
          </p>

          <div className="home__content-list">
            <span>Filmes</span>
            <span>Séries</span>
            <span>Animes</span>
            <span>Animações</span>
            <span>Livros</span>
            <span>Mangás</span>
            <span>Manhwas</span>
            <span>Músicas</span>
            <span>Podcasts</span>
            <span>Jogos</span>
            <span>Documentários</span>
          </div>
        </div>
      </section>

      <section className="home__section home__ecosystem" id="ecosystem">
        <div className="home__container">
          <span className="home__eyebrow">Ecossistema</span>

          <h2>Construído para crescer de forma aberta</h2>

          <p className="home__section-intro">
            O Korevax é um projeto open-source pensado para conectar pessoas,
            dados e aplicações em torno de conteúdos digitais.
          </p>

          <div className="home__ecosystem-grid">
            <article className="home__ecosystem-item">
              <h3>Open-source</h3>

              <p>
                Um projeto aberto, desenvolvido de forma colaborativa e
                acessível para a comunidade.
              </p>
            </article>

            <article className="home__ecosystem-item">
              <h3>Dados estruturados</h3>

              <p>
                Informações organizadas para facilitar a descoberta, consulta e
                conexão entre conteúdos.
              </p>
            </article>

            <article className="home__ecosystem-item">
              <h3>Comunidade</h3>

              <p>
                Pessoas podem contribuir, avaliar informações e ajudar na
                evolução do ecossistema.
              </p>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Home;
