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
                  O Korevax é um ecossistema open-source criado
                  para facilitar a descoberta, organização e
                  exploração de conteúdos digitais.
               </p>
            </div>
         </section>

         <section className="home__section" id="about">
            <div className="home__container">
               <h2>Um catálogo aberto e organizado</h2>

               <p>
                  O Korevax busca reunir informações de diferentes
                  tipos de conteúdo em uma estrutura organizada,
                  permitindo encontrar, explorar e relacionar
                  diferentes obras e entidades.
               </p>
            </div>
         </section>

         <section className="home__section">
            <div className="home__container">
               <h2>Construído em comunidade</h2>

               <p>
                  O projeto é open-source e pensado para receber
                  contribuições da comunidade, permitindo que
                  pessoas possam colaborar, avaliar informações
                  e ajudar a manter o catálogo cada vez mais
                  completo e confiável.
               </p>
            </div>
         </section>

         <section className="home__section">
            <div className="home__container">
               <h2>Um ecossistema para conteúdos digitais</h2>

               <p>
                  Mais do que um catálogo, o Korevax busca
                  construir uma base aberta onde conteúdos,
                  informações e relações possam ser conectados
                  e utilizados por diferentes aplicações e
                  projetos.
               </p>
            </div>
         </section>
      </main>
   );
}

export default Home;
