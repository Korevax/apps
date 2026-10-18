import type { TorrentSource } from "../../domain/downloads/torrent.types";

/**
 * Illustrative UI fixtures only. No real magnet or torrent URLs are included.
 * Replace this data source with reviewed, permission-aware records before production.
 */
const demoSources: readonly TorrentSource[] = [
  { id:"demo-film-x-1080p",contentId:"movie-filme-x",name:"Filme X — dados demonstrativos",quality:"1080p",sizeBytes:2400000000,seeders:128,leechers:14,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
  { id:"demo-film-x-720p",contentId:"movie-filme-x",name:"Filme X — dados demonstrativos",quality:"720p",sizeBytes:1100000000,seeders:86,leechers:9,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
  { id:"demo-film-x-2160p",contentId:"movie-filme-x",name:"Filme X — dados demonstrativos",quality:"2160p",sizeBytes:7800000000,seeders:42,leechers:21,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
];

function isSafeMagnetUri(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 4096 || /[\u0000-\u0020\u007F]/.test(value)) return false;
  try {
    const uri = new URL(value);
    const hash = uri.searchParams.get("xt") ?? "";
    return uri.protocol === "magnet:" &&
      /^urn:btih:(?:[a-f0-9]{40}|[a-z2-7]{32})$/i.test(hash);
  } catch { return false; }
}

function isSafeTorrentUrl(value: unknown): value is string {
  if (typeof value !== "string" || value.length > 2048 || /[\u0000-\u001F\u007F]/.test(value)) return false;
  try {
    const url = new URL(value);
    return (url.protocol === "https:" || url.protocol === "http:") &&
      Boolean(url.hostname) && !url.username && !url.password;
  } catch { return false; }
}

function isValidSource(source: TorrentSource): boolean {
  const metadataValid = Boolean(
    source.id.trim() && source.contentId.trim() && source.name.trim() &&
    source.quality.trim() && source.sourceName.trim()
  ) &&
    Number.isSafeInteger(source.sizeBytes) && source.sizeBytes > 0 &&
    Number.isSafeInteger(source.seeders) && source.seeders >= 0 &&
    Number.isSafeInteger(source.leechers) && source.leechers >= 0 &&
    Number.isFinite(Date.parse(source.updatedAt));

  if (!metadataValid || source.status !== "active") return false;
  if (source.isDemo) return source.magnetUri === null && source.torrentUrl === null;
  return isSafeMagnetUri(source.magnetUri) || isSafeTorrentUrl(source.torrentUrl);
}

export function getTorrentSourcesForContent(contentId: string): TorrentSource[] {
  if (typeof contentId !== "string" || !contentId.trim()) return [];
  return demoSources
    .filter(source => source.contentId === contentId && isValidSource(source))
    .map(source => ({ ...source }));
}

export function isSafeMagnetLink(value: unknown): value is string {
  return isSafeMagnetUri(value);
}

export function isSafeTorrentDownloadUrl(value: unknown): value is string {
  return isSafeTorrentUrl(value);
}
