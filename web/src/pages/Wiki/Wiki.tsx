import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import {
  bookOutline,
  compassOutline,
  gitBranchOutline,
  shieldCheckmarkOutline,
  warningOutline,
} from "ionicons/icons";
import korevaxLogo from "../../assets/Korevax.svg";
import { useLanguage } from "../../contexts/useLanguage";
import "./Wiki.css";

export default function Wiki() {
  const { translation } = useLanguage();
  const labels = translation.wiki;
  const knowledgeSections = [
    { id: "catalog", icon: compassOutline, title: labels.catalogTitle, description: labels.catalogText, href: "/discover" },
    { id: "sources", icon: bookOutline, title: labels.torrentsTitle, description: labels.torrentsText, href: "/torrents" },
    { id: "safety", icon: shieldCheckmarkOutline, title: labels.safetyTitle, description: labels.safetyText, href: "/torrents" },
    { id: "community", icon: gitBranchOutline, title: labels.communityTitle, description: labels.communityText, href: "https://github.com/Korevax/apps" },
  ];

  return (
    <div className="wiki-shell">
      <header className="wiki-header">
        <div className="wiki-header__inner">
          <Link className="wiki-header__brand" to="/wiki" aria-label="Korevax Wiki">
            <img src={korevaxLogo} alt="" />
            <span>Korevax <strong>Wiki</strong></span>
          </Link>
          <nav className="wiki-header__nav" aria-label={labels.eyebrow}>
            <Link to="/">{labels.navHome}</Link>
            <Link to="/discover">{labels.navCatalog}</Link>
            <Link to="/collections">{labels.navCollections}</Link>
            <a href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">{labels.navContribute}</a>
          </nav>
        </div>
      </header>

      <main className="korevax-wiki">
        <section className="korevax-wiki__hero">
          <div className="korevax-wiki__hero-inner">
            <p className="korevax-wiki__eyebrow">{labels.eyebrow}</p>
            <h1>{labels.welcome}</h1>
            <p>{labels.description}</p>
            <Link className="korevax-wiki__primary" to="/discover">{labels.navCatalog} <span aria-hidden="true">→</span></Link>
          </div>
        </section>

        <div className="korevax-wiki__content">
          <aside className="korevax-wiki__notice" role="note">
            <IonIcon icon={warningOutline} aria-hidden="true" />
            <div><h2>{labels.noticeTitle}</h2><p>{labels.notice}</p></div>
          </aside>

          <section aria-labelledby="wiki-start-title">
            <p className="korevax-wiki__eyebrow">01 / {labels.eyebrow}</p>
            <h2 id="wiki-start-title">{labels.quickStartTitle}</h2>
            <ol className="korevax-wiki__steps">
              {labels.quickStart.map((step: { title: string; description: string }, index: number) => (
                <li key={step.title}>
                  <span className="korevax-wiki__step-number">{String(index + 1).padStart(2, "0")}</span>
                  <div><h3>{step.title}</h3><p>{step.description}</p></div>
                </li>
              ))}
            </ol>
          </section>

          <section className="korevax-wiki__kore" id="kore" aria-labelledby="wiki-kore-title">
            <p className="korevax-wiki__eyebrow">Kore / API</p>
            <h2 id="wiki-kore-title">{labels.koreTitle}</h2>
            <p>{labels.koreDescription}</p>
          </section>

          <section aria-labelledby="wiki-directory-title">
            <p className="korevax-wiki__eyebrow">02 / Korevax</p>
            <h2 id="wiki-directory-title">{labels.directoryTitle}</h2>
            <div className="korevax-wiki__directory">
              {labels.directory.map((item: { title: string; description: string; path: string }) => (
                <article className="korevax-wiki__directory-item" key={item.path}>
                  <h3>{item.title}</h3><p>{item.description}</p>
                  <Link to={item.path}>{labels.navCatalog} <span aria-hidden="true">→</span></Link>
                </article>
              ))}
            </div>
          </section>

          <section aria-labelledby="wiki-knowledge-title">
            <p className="korevax-wiki__eyebrow">03 / Guides</p>
            <h2 id="wiki-knowledge-title">{labels.exploreTitle}</h2>
            <div className="korevax-wiki__grid">
              {knowledgeSections.map(section => (
                <article className="korevax-wiki__card" key={section.id}>
                  <span className="korevax-wiki__card-icon"><IonIcon icon={section.icon} aria-hidden="true" /></span>
                  <h3>{section.title}</h3><p>{section.description}</p>
                  {section.href.startsWith("http")
                    ? <a href={section.href} target="_blank" rel="noopener noreferrer">{labels.contribute} <span aria-hidden="true">↗</span></a>
                    : <Link to={section.href}>{labels.exploreTitle} <span aria-hidden="true">→</span></Link>}
                </article>
              ))}
            </div>
          </section>

          <section className="korevax-wiki__principles" aria-labelledby="wiki-principles-title">
            <h2 id="wiki-principles-title">{labels.principlesTitle}</h2>
            <ul>{labels.principles.map((principle: string) => <li key={principle}>{principle}</li>)}</ul>
          </section>
        </div>
      </main>

      <footer className="wiki-footer">
        <div className="wiki-footer__inner">
          <Link className="wiki-footer__brand" to="/wiki">Korevax <strong>Wiki</strong></Link>
          <p>{labels.footerNote}</p>
          <div className="wiki-footer__links">
            <Link to="/discover">{labels.navCatalog}</Link>
            <Link to="/collections">{labels.navCollections}</Link>
            <a href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">GitHub ↗</a>
            <a href="https://korevax.netlify.app/" target="_blank" rel="noopener noreferrer">korevax.netlify.app ↗</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
