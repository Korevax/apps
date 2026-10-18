import { useEffect, useMemo, useState, type FormEvent } from "react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { IonIcon } from "@ionic/react";
import { arrowForward, copyOutline, downloadOutline, playCircleOutline, searchOutline } from "ionicons/icons";
import { useLanguage } from "../../contexts/useLanguage";
import { getAllContent } from "../../services/catalog/catalog.services";
import { getAllTorrentSources, getTorrentReleaseGroup, getTorrentSourceProfile, isSafeBrowserStream, isSafeMagnetLink, isSafeTorrentDownloadUrl, searchTorrentSources } from "../../services/torrents/torrent.services";
import type { TorrentSource } from "../../domain/downloads/torrent.types";
import type { Content } from "../../domain/catalog/content.types";
import "./TorrentCatalog.css";

type SortMode = "seeders" | "size" | "name";

function formatBytes(bytes: number): string {
  if (!Number.isSafeInteger(bytes) || bytes <= 0) return "—";
  const units = ["B", "KiB", "MiB", "GiB", "TiB"];
  let value = bytes;
  let unit = 0;
  while (value >= 1024 && unit < units.length - 1) {
    value /= 1024;
    unit += 1;
  }
  return value.toLocaleString(undefined, { maximumFractionDigits: 1 }) + " " + units[unit];
}

function TorrentRow({ source, content, labels }: { source: TorrentSource; content?: Content; labels: ReturnType<typeof useLanguage>["translation"]["torrentCatalog"] }) {
  const [feedback, setFeedback] = useState("");
  const [isPlayerOpen, setIsPlayerOpen] = useState(false);
  const group = getTorrentReleaseGroup(source.name) ?? source.sourceName;
  const canCopy = !source.isDemo && isSafeMagnetLink(source.magnetUri);
  const canDownload = !source.isDemo && isSafeTorrentDownloadUrl(source.torrentUrl);
  const canPlay = !source.isDemo && isSafeBrowserStream(source.streamUrl, source.streamMimeType);
  const validationLabel = source.mediaValidationStatus === "verified" ? labels.mediaVerified : source.mediaValidationStatus === "failed" ? labels.mediaFailed : labels.mediaUnknown;
  const formatTracks = (tracks: TorrentSource["audioTracks"]) => tracks?.length
    ? tracks.map(track => [track.language, track.codec, track.channels, track.isDefault ? "default" : ""].filter(Boolean).join(" · ")).join(", ")
    : "";

  async function copyMagnet() {
    if (!canCopy || !source.magnetUri || !navigator.clipboard?.writeText) return;
    try {
      await navigator.clipboard.writeText(source.magnetUri);
      setFeedback("copied");
    } catch {
      setFeedback("failed");
    }
  }

  return (
    <article className="torrent-row">
      <div className="torrent-row__identity">
        <span className="torrent-row__quality">{source.quality}</span>
        <h2>{source.name}</h2>
        <Link className="torrent-row__group" to={`/torrents?q=${encodeURIComponent("[" + group + "]")}`}>
          [{group}]
        </Link>
        {content ? <Link className="torrent-row__content" to={`/content/${encodeURIComponent(content.slug)}`}>{content.title}<IonIcon icon={arrowForward} aria-hidden="true" /></Link> : null}
      </div>
      <dl className="torrent-row__stats">
        <div><dt>{labels.size}</dt><dd>{formatBytes(source.sizeBytes)}</dd></div>
        <div><dt>{labels.seeders}</dt><dd>{source.seeders.toLocaleString()}</dd></div>
        <div><dt>{labels.leechers}</dt><dd>{source.leechers.toLocaleString()}</dd></div>
        <div><dt>{labels.quality}</dt><dd>{source.quality}</dd></div>
      </dl>
      <dl className="torrent-row__media">
        <div><dt>{labels.audio}</dt><dd>{formatTracks(source.audioTracks) || (source.audioLanguages?.length ? source.audioLanguages.join(", ") : labels.mediaUnknown)}</dd></div>
        <div><dt>{labels.subtitles}</dt><dd>{formatTracks(source.subtitleTracks) || (source.subtitleLanguages?.length ? source.subtitleLanguages.join(", ") : labels.mediaUnknown)}</dd></div>
        <div><dt>{labels.mediaValidation}</dt><dd>{validationLabel}</dd></div>
      </dl>
      <div className="torrent-row__actions">
        <button type="button" onClick={() => void copyMagnet()} disabled={!canCopy} title={canCopy ? undefined : labels.unavailable}>
          <IonIcon icon={copyOutline} aria-hidden="true" />{labels.copyMagnet}
        </button>
        {canDownload ? (
          <a href={source.torrentUrl!} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
            <IonIcon icon={downloadOutline} aria-hidden="true" />{labels.downloadTorrent}
          </a>
        ) : (
          <button type="button" disabled title={labels.unavailable}>
            <IonIcon icon={downloadOutline} aria-hidden="true" />{labels.downloadTorrent}
          </button>
        )}
        <button type="button" onClick={() => setIsPlayerOpen(value => !value)} disabled={!canPlay} title={canPlay ? labels.player : labels.playerUnavailable}>
          <IonIcon icon={playCircleOutline} aria-hidden="true" />{labels.player}
        </button>
        {feedback ? <span role="status">{feedback === "copied" ? "✓" : "!"}</span> : null}
      </div>
      {isPlayerOpen && canPlay ? (
        <div className="torrent-row__player">
          <p>{labels.playerHelp}</p>
          <video controls preload="none" playsInline controlsList="nodownload">
            <source src={source.streamUrl!} type={source.streamMimeType} />
          </video>
        </div>
      ) : null}
    </article>
  );
}

export default function TorrentCatalog() {
  const { translation } = useLanguage();
  const labels = translation.torrentCatalog;
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const mode = location.pathname === "/popular" ? "popular" : "all";
  const initialQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(initialQuery);
  const [sort, setSort] = useState<SortMode>(mode === "popular" ? "seeders" : "name");
  const [quality, setQuality] = useState("all");

  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
  }, [searchParams]);

  useEffect(() => {
    setSort(mode === "popular" ? "seeders" : "name");
  }, [mode]);

  const contentById = useMemo(() => new Map(getAllContent().map(item => [item.id, item])), []);
  const allSources = getAllTorrentSources();
  const qualities = [...new Set(allSources.map(source => source.quality))].sort((a, b) => a.localeCompare(b));
  const results = useMemo(() => {
    const found = searchTorrentSources(query).filter(source => quality === "all" || source.quality === quality);
    return found.slice().sort((a, b) => {
      if (sort === "seeders") return b.seeders - a.seeders || b.leechers - a.leechers;
      if (sort === "size") return b.sizeBytes - a.sizeBytes;
      return a.name.localeCompare(b.name);
    });
  }, [query, quality, sort]);
  const profileQuery = /^\s*\[([^\]]{1,48})\]\s*$/u.exec(query);
  const profile = profileQuery ? getTorrentSourceProfile(profileQuery[1]) : null;

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const normalized = query.trim().slice(0, 200);
    setQuery(normalized);
    const next = new URLSearchParams(searchParams);
    if (normalized) next.set("q", normalized);
    else next.delete("q");
    setSearchParams(next);
  }

  function clearSearch() {
    setQuery("");
    setQuality("all");
    const next = new URLSearchParams(searchParams);
    next.delete("q");
    setSearchParams(next);
  }

  return (
    <main className="torrent-catalog">
      <section className="torrent-catalog__hero">
        <div className="torrent-catalog__hero-inner">
          <p className="torrent-catalog__eyebrow">Korevax / {mode === "popular" ? labels.popularTitle : labels.allTitle}</p>
          <h1>{mode === "popular" ? labels.popularTitle : labels.allTitle}</h1>
          <p>{mode === "popular" ? labels.popularDescription : labels.allDescription}</p>
          <form className="torrent-catalog__search" role="search" onSubmit={submitSearch}>
            <IonIcon icon={searchOutline} aria-hidden="true" />
            <input value={query} onChange={event => setQuery(event.currentTarget.value)} maxLength={200} placeholder={labels.searchPlaceholder} aria-label={labels.searchLabel} type="search" />
            {query ? <button type="button" onClick={clearSearch}>{labels.clear}</button> : null}
            <button type="submit" disabled={!query.trim()}>{translation.header.searchbox.search}</button>
          </form>
          <p className="torrent-catalog__hint">{labels.providerHint}</p>
        </div>
      </section>
      <div className="torrent-catalog__content">
        <div className="torrent-catalog__toolbar">
          <label>{labels.filterQuality}
            <select value={quality} onChange={event => setQuality(event.currentTarget.value)}>
              <option value="all">{labels.allQualities}</option>
              {qualities.map(item => <option value={item} key={item}>{item}</option>)}
            </select>
          </label>
          <label>{labels.sort}
            <select value={sort} onChange={event => setSort(event.currentTarget.value as SortMode)}>
              <option value="seeders">{labels.seedersSort}</option>
              <option value="size">{labels.sizeSort}</option>
              <option value="name">{labels.nameSort}</option>
            </select>
          </label>
          <span className="torrent-catalog__count">{results.length} {labels.results.toLocaleLowerCase()}</span>
        </div>
        {profile ? (
          <section className="torrent-profile" aria-label={labels.sourceProfile}>
            <span className="torrent-profile__avatar">{profile.name.slice(0, 1).toUpperCase()}</span>
            <div><p>{labels.sourceProfile}</p><h2>[{profile.name}]</h2><span>{profile.count} {labels.sourceCount}</span></div>
          </section>
        ) : null}
        <p className="torrent-catalog__notice" role="note">{labels.demoNotice}</p>
        {results.length ? (
          <div className="torrent-catalog__list">{results.map(source => <TorrentRow key={source.id} source={source} content={contentById.get(source.contentId)} labels={labels} />)}</div>
        ) : (
          <div className="torrent-catalog__empty" role="status"><h2>{labels.noResults}</h2><p>{labels.providerHint}</p></div>
        )}
      </div>
    </main>
  );
}
