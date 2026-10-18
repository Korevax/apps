import { Link } from "react-router-dom";
import "./Discover.css";

import { IonIcon } from "@ionic/react";
import { arrowForward } from "ionicons/icons";

import {
   useLanguage,
} from "../../contexts/useLanguage";

function Discover() {

     const {
      translation,
   } = useLanguage();

  return (
    <main className="Discover_container">
      <section className="DiscoverBanner"></section>

      <section className="DiscoverCOntent">
        <article className="DiscoverMOvie DiscoverArtcle">
          <header className="Art-Header">
            <div className="DiscoverBox">
              <span className="discover__linebrow"></span>
              <h2 className="discover__eyebrow">{translation.main.navigation.recent}</h2>
            </div>

            <Link className="discoverLink" to="/discover/recent">
            {translation.main.navigation.seeMore}
              <IonIcon icon={arrowForward} aria-hidden="true" />
            </Link>
          </header>
          /* catalog*/
        </article>

        <article className="DiscoverSerie DiscoverArtcle">
          <header className="Art-Header">
            <div className="DiscoverBox">
              <span className="discover__linebrow"></span>
              <h2 className="discover__eyebrow">{translation.main.navigation.popular}</h2>
            </div>

            <Link className="discoverLink" to="/discover/popular">
             {translation.main.navigation.seeMore}
              <IonIcon icon={arrowForward} aria-hidden="true" />
            </Link>
          </header>
          /* catalog*/
        </article>

        <article className="DiscoverAnimation DiscoverArtcle">
          <header className="Art-Header">
            <div className="DiscoverBox">
              <span className="discover__linebrow"></span>
              <h2 className="discover__eyebrow">{translation.main.navigation.tops}</h2>
            </div>

            <Link className="discoverLink" to="#">
              {translation.main.navigation.seeMore}
              <IonIcon icon={arrowForward} aria-hidden="true" />
            </Link>
          </header>
          /* catalog*/
        </article>

      </section>
    </main>
  );
}

export default Discover;
