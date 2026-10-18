import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  albumsOutline,
  bookOutline,
  compassOutline,
  flameOutline,
  logoGithub,
  musicalNotesOutline,
  pulseOutline,
  serverOutline,
  gameControllerOutline,
  newspaperOutline,
} from "ionicons/icons";
import korevaxLogo from "../../assets/Korevax.svg";
import { useLanguage } from "../../contexts/useLanguage";
import "./Footer.css";

export default function Footer() {
  const { translation } = useLanguage();
  const labels = translation.footer;

  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section className="site-footer__brand" aria-label="Korevax">
          <Link to="/" className="site-footer__logo" aria-label="Korevax — início">
            <img src={korevaxLogo} alt="" />
            <span>Korevax</span>
          </Link>
          <p>{labels.tagline}</p>
          <a className="site-footer__external" href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">
            <IonIcon icon={logoGithub} aria-hidden="true" /> GitHub
          </a>
          <a className="site-footer__external" href="https://korevax.netlify.app/" target="_blank" rel="noopener noreferrer">
            <IonIcon icon={compassOutline} aria-hidden="true" /> {labels.site}
          </a>
        </section>

        <nav className="site-footer__column" aria-label={labels.ecosystem}>
          <h2>{labels.ecosystem}</h2>
          <Link to="/wiki#kore" title={labels.koreDescription}>{labels.kore}</Link>
          <Link to="/news"><IonIcon icon={newspaperOutline} aria-hidden="true" />{labels.news}</Link>
          <Link to="/popular"><IonIcon icon={flameOutline} aria-hidden="true" />{labels.popular}</Link>
          <Link to="/torrents"><IonIcon icon={pulseOutline} aria-hidden="true" />{labels.torrents}</Link>
          <p className="site-footer__small-note">{labels.koreDescription}</p>
        </nav>

        <nav className="site-footer__column" aria-label={labels.discoverHeading}>
          <h2>{labels.discoverHeading}</h2>
          <Link to="/discover"><IonIcon icon={compassOutline} aria-hidden="true" />{labels.discoverCatalog}</Link>
          <Link to="/music"><IonIcon icon={musicalNotesOutline} aria-hidden="true" />{labels.music}</Link>
          <Link to="/games"><IonIcon icon={gameControllerOutline} aria-hidden="true" />{labels.games}</Link>
          <Link to="/manga"><IonIcon icon={albumsOutline} aria-hidden="true" />{labels.manga}</Link>
          <Link to="/collections"><IonIcon icon={albumsOutline} aria-hidden="true" />{translation.header.navigation.collections}</Link>
        </nav>

        <section className="site-footer__column">
          <h2><IonIcon icon={serverOutline} aria-hidden="true" />{labels.status}</h2>
          <p className="site-footer__status"><span aria-hidden="true" />{labels.statusUnknown}</p>
        </section>

        <nav className="site-footer__column" aria-label={labels.wiki}>
          <h2><IonIcon icon={bookOutline} aria-hidden="true" />{labels.wiki}</h2>
          <Link to="/wiki">{labels.wikiHome}</Link>
          <a href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">{labels.contribute}</a>
        </nav>
      </div>
      <div className="site-footer__bottom">
        <span>{labels.copyright}</span>
        <Link to="/wiki">{labels.wikiHome}</Link>
      </div>
    </footer>
  );
}
