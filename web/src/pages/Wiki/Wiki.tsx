import { Link } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { bookOutline, compassOutline, gitBranchOutline, shieldCheckmarkOutline, warningOutline } from "ionicons/icons";
import { useLanguage } from "../../contexts/useLanguage";
import "./Wiki.css";

export default function Wiki() {
  const { translation } = useLanguage();
  const labels = translation.wiki;
  const sections = [
    { id:"catalog", icon:compassOutline, title:labels.catalogTitle, description:labels.catalogText, href:"/discover" },
    { id:"torrents", icon:bookOutline, title:labels.torrentsTitle, description:labels.torrentsText, href:"/torrents" },
    { id:"safety", icon:shieldCheckmarkOutline, title:labels.safetyTitle, description:labels.safetyText, href:"/torrents" },
    { id:"community", icon:gitBranchOutline, title:labels.communityTitle, description:labels.communityText, href:"https://github.com/Korevax/apps" },
  ];
  return (
    <main className="korevax-wiki">
      <section className="korevax-wiki__hero">
        <div className="korevax-wiki__hero-inner">
          <p className="korevax-wiki__eyebrow">{labels.eyebrow}</p>
          <h1>{labels.title}</h1>
          <p>{labels.description}</p>
          <a className="korevax-wiki__primary" href="https://github.com/Korevax/apps" target="_blank" rel="noopener noreferrer">{labels.contribute}</a>
        </div>
      </section>
      <div className="korevax-wiki__content">
        <aside className="korevax-wiki__notice" role="note">
          <IonIcon icon={warningOutline} aria-hidden="true" />
          <div><h2>{labels.noticeTitle}</h2><p>{labels.notice}</p></div>
        </aside>
        <section aria-labelledby="wiki-explore-title">
          <p className="korevax-wiki__eyebrow">KOREVAX / WIKI</p>
          <h2 id="wiki-explore-title">{labels.exploreTitle}</h2>
          <div className="korevax-wiki__grid">
            {sections.map(section => (
              <article className="korevax-wiki__card" key={section.id}>
                <span className="korevax-wiki__card-icon"><IonIcon icon={section.icon} aria-hidden="true" /></span>
                <h3>{section.title}</h3><p>{section.description}</p>
                {section.href.startsWith("http") ? <a href={section.href} target="_blank" rel="noopener noreferrer">{labels.contribute}</a> : <Link to={section.href}>{labels.exploreTitle} <span aria-hidden="true">→</span></Link>}
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
  );
}
