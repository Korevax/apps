import { useState } from "react";
import { IonIcon } from "@ionic/react";
import { copyOutline, downloadOutline, linkOutline } from "ionicons/icons";
import { getTorrentSourcesForContent, isSafeMagnetLink, isSafeTorrentDownloadUrl } from "../../services/torrents/torrent.services";
import { useLanguage } from "../../contexts/useLanguage";
import type { TorrentSource } from "../../domain/downloads/torrent.types";

function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "—";
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = bytes;
  let unit = 0;
  while (size >= 1000 && unit < units.length - 1) {
    size /= 1000;
    unit += 1;
  }
  return size.toLocaleString(undefined, { maximumFractionDigits: 1 }) + " " + units[unit];
}

interface TorrentSourcesProps {
  contentId: string;
}

export function TorrentSources({ contentId }: TorrentSourcesProps) {
  const { translation } = useLanguage();
  const [feedback, setFeedback] = useState("");
  const labels = translation.catalog;
  const sources = getTorrentSourcesForContent(contentId);

  async function copyMagnet(source: TorrentSource) {
    if (source.isDemo || !isSafeMagnetLink(source.magnetUri)) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(source.magnetUri);
      setFeedback(labels.torrentCopied);
    } catch {
      setFeedback(labels.torrentCopyFailed);
    }
  }

  return (
    <section className="content-details__section torrent-sources" aria-labelledby="torrent-sources-heading">
      <div className="torrent-sources__heading">
        <div>
          <h2 id="torrent-sources-heading">{labels.torrentsTitle}</h2>
          <p>{labels.torrentsDescription}</p>
        </div>
      </div>
      {sources.length === 0 ? (
        <p className="content-details__muted">{labels.torrentEmpty}</p>
      ) : (
        <>
          {sources.some(source => source.isDemo) ? (
            <p className="torrent-sources__notice" role="note">{labels.torrentDemo}</p>
          ) : null}
          <div className="torrent-sources__list">
            {sources.map(source => {
              const canCopy = !source.isDemo && isSafeMagnetLink(source.magnetUri);
              const canDownload = !source.isDemo && isSafeTorrentDownloadUrl(source.torrentUrl);
              return (
                <article className="torrent-source" key={source.id}>
                  <div className="torrent-source__main">
                    <h3>{source.name}</h3>
                    <span className="torrent-source__quality">{source.quality}</span>
                  </div>
                  <dl className="torrent-source__stats">
                    <div><dt>{labels.torrentSize}</dt><dd>{formatBytes(source.sizeBytes)}</dd></div>
                    <div><dt>{labels.torrentSeeders}</dt><dd>{source.seeders.toLocaleString()}</dd></div>
                    <div><dt>{labels.torrentLeechers}</dt><dd>{source.leechers.toLocaleString()}</dd></div>
                    <div><dt>{labels.torrentSource}</dt><dd>{source.sourceName}</dd></div>
                  </dl>
                  <div className="torrent-source__actions">
                    <button type="button" className="content-hero__button" onClick={() => void copyMagnet(source)} disabled={!canCopy}>
                      <IonIcon icon={copyOutline} aria-hidden="true" />{labels.copyMagnet}
                    </button>
                    {canDownload ? (
                      <a className="content-hero__button torrent-source__download" href={source.torrentUrl!} target="_blank" rel="noopener noreferrer" referrerPolicy="no-referrer">
                        <IonIcon icon={downloadOutline} aria-hidden="true" />{labels.downloadTorrent}
                      </a>
                    ) : (
                      <button type="button" className="content-hero__button" disabled title={labels.torrentUnavailable}>
                        <IonIcon icon={linkOutline} aria-hidden="true" />{labels.downloadTorrent}
                      </button>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
      {feedback ? <p className="content-details__muted" role="status">{feedback}</p> : null}
    </section>
  );
}
