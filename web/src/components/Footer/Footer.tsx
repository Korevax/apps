import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { bookOutline, compassOutline, flameOutline, logoGithub, pulseOutline, serverOutline } from "ionicons/icons";
import korevaxLogo from "../../assets/Korevax.svg";
import { useLanguage } from "../../contexts/useLanguage";
import "./Footer.css";

export default function Footer() {
  const { translation } = useLanguage();
  const labels = translation.footer;
  return (
    <footer className="site-footer">
      <div className="site-footer__inner">
        <section className="site-footer__brand">
          <Link to="/" className="site-footer__logo" aria-label="Korevax — início">
            <img src={korevaxLogo} alt="" />
            <span>Korevax</span>
          </Link>
          <p>{labels.tagline}</p>
          <a className="site-footer__external" href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">
            <IonIcon icon={logoGithub} aria-hidden="true" /> GitHub
          </a>
        </section>
        <nav className="site-footer__column" aria-label={labels.ecosystem}>
          <h2>{labels.ecosystem}</h2>
          <Link to="/discover"><IonIcon icon={compassOutline} aria-hidden="true" />{labels.discover}</Link>
          <Link to="/popular"><IonIcon icon={flameOutline} aria-hidden="true" />{labels.popular}</Link>
          <Link to="/torrents"><IonIcon icon={pulseOutline} aria-hidden="true" />{labels.torrents}</Link>
        </nav>
        <section className="site-footer__column">
          <h2><IonIcon icon={serverOutline} aria-hidden="true" />{labels.status}</h2>
          <p className="site-footer__status"><span aria-hidden="true" />{labels.statusUnknown}</p>
        </section>
        <section className="site-footer__column">
          <h2>{labels.domains}</h2>
          <p>{labels.domainsSoon}</p>
        </section>
        <nav className="site-footer__column" aria-label={labels.wiki}>
          <h2><IonIcon icon={bookOutline} aria-hidden="true" />{labels.wiki}</h2>
          <Link to="/wiki">{labels.wikiHome}</Link>
          <a href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">{labels.contribute}</a>
        </nav>
      </div>
      <div className="site-footer__bottom"><span>{labels.copyright}</span><Link to="/wiki">{labels.wikiHome}</Link></div>
    </footer>
  );
}
