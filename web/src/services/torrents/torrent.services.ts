import type { TorrentSource } from "../../domain/downloads/torrent.types";

/**
 * Illustrative UI fixtures only. No real magnet or torrent URLs are included.
 * Replace this data source with reviewed, permission-aware records before production.
 */
const demoSources: readonly TorrentSource[] = [
  { id:"demo-film-x-1080p",contentId:"movie-filme-x",name:"[Judas] Filme X 1080p WEB-DL",quality:"1080p",sizeBytes:2400000000,seeders:128,leechers:14,magnetUri:null,torrentUrl:null,sourceName:"Judas",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
  { id:"demo-film-x-720p",contentId:"movie-filme-x",name:"[Judas] Filme X 720p WEB-DL",quality:"720p",sizeBytes:1100000000,seeders:86,leechers:9,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
  { id:"demo-film-x-2160p",contentId:"movie-filme-x",name:"[Judas] Filme X 2160p UHD",quality:"2160p",sizeBytes:7800000000,seeders:42,leechers:21,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
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
    return url.protocol === "https:" &&
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

/** Extracts a conventional release-group tag, e.g. "[Judas]". */
export function getTorrentReleaseGroup(name: string): string | null {
  if (typeof name !== "string") return null;
  const match = /^\s*\[([^\]\r\n]{1,48})\]\s*/u.exec(name);
  const group = match?.[1]?.trim();
  return group && /^[\p{L}\p{N}._ -]+$/u.test(group) ? group : null;
}

export function getAllTorrentSources(): TorrentSource[] {
  return demoSources.filter(isValidSource).map(source => ({ ...source }));
}

export function searchTorrentSources(query: string): TorrentSource[] {
  const normalized = query.trim().slice(0, 200).toLocaleLowerCase();
  if (!normalized) return getAllTorrentSources();

  const groupQuery = /^\[([^\]]{1,48})\](?:\s*(.*))?$/u.exec(normalized);
  const requestedGroup = groupQuery?.[1]?.trim();
  const remainingQuery = groupQuery?.[2]?.trim() ?? normalized;

  return getAllTorrentSources().filter(source => {
    const group = (getTorrentReleaseGroup(source.name) ?? source.sourceName).toLocaleLowerCase();
    if (requestedGroup && group !== requestedGroup) return false;
    if (!remainingQuery) return true;
    const searchable = [source.name, source.quality, source.sourceName].join(" ").toLocaleLowerCase();
    return searchable.includes(remainingQuery);
  });
}

export function getTorrentSourceProfile(name: string): { name: string; count: number } | null {
  const normalized = name.trim().replace(/^\[|\]$/g, "").slice(0, 48);
  if (!normalized) return null;
  const matches = getAllTorrentSources().filter(source =>
    (getTorrentReleaseGroup(source.name) ?? source.sourceName).toLocaleLowerCase() === normalized.toLocaleLowerCase()
  );
  return matches.length ? { name: normalized, count: matches.length } : null;
}
