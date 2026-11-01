import type { TorrentSource } from "../../domain/downloads/torrent.types";
import {
  hasControlCharacters,
  hasControlOrSpaceCharacters,
  isIsoTimestampWithTimezone,
} from "../../domain/shared/string.validation";

/**
 * Illustrative UI fixtures only. No real magnet or torrent URLs are included.
 * Replace this data source with reviewed, permission-aware records before production.
 */
const demoSources: readonly TorrentSource[] = [
  { id:"demo-film-x-1080p",contentId:"movie-filme-x",name:"[Judas] Filme X 1080p WEB-DL",quality:"1080p",sizeBytes:2400000000,seeders:128,leechers:14,magnetUri:null,torrentUrl:null,sourceName:"Judas",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
  { id:"demo-film-x-720p",contentId:"movie-filme-x",name:"[Judas] Filme X 720p WEB-DL",quality:"720p",sizeBytes:1100000000,seeders:86,leechers:9,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
  { id:"demo-film-x-2160p",contentId:"movie-filme-x",name:"[Judas] Filme X 2160p UHD",quality:"2160p",sizeBytes:7800000000,seeders:42,leechers:21,magnetUri:null,torrentUrl:null,sourceName:"Demonstração",status:"active",isDemo:true,updatedAt:"2026-10-16T12:00:00Z" },
];

const IDENTIFIER = /^[a-z0-9][a-z0-9._:-]*$/;
const LANGUAGE_TAG = /^[A-Za-z]{2,8}(?:-[A-Za-z0-9]{1,8})*$/;
const STREAM_MIME_TYPES = [
  "video/mp4",
  "video/webm",
  "application/vnd.apple.mpegurl",
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isBoundedText(value: unknown, maxLength: number): value is string {
  return typeof value === "string" &&
    value.length > 0 &&
    value.length <= maxLength &&
    value.trim() === value &&
    !hasControlCharacters(value);
}

function isSafeMagnetUri(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length > 4096 ||
    hasControlOrSpaceCharacters(value)
  ) return false;

  try {
    const uri = new URL(value);
    const hashes = uri.searchParams.getAll("xt");

    return uri.protocol === "magnet:" &&
      hashes.length === 1 &&
      /^urn:btih:(?:[a-f0-9]{40}|[a-z2-7]{32})$/i.test(hashes[0]);
  } catch {
    return false;
  }
}

function isSafeTorrentUrl(value: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length > 2048 ||
    hasControlOrSpaceCharacters(value)
  ) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password;
  } catch {
    return false;
  }
}

function isLanguageList(value: unknown): boolean {
  if (!Array.isArray(value) || value.length > 32) return false;

  const normalized = value.map(language =>
    typeof language === "string" ? language.toLowerCase() : "",
  );

  return value.every(language =>
    typeof language === "string" && LANGUAGE_TAG.test(language)
  ) && new Set(normalized).size === normalized.length;
}

function isMediaTrack(value: unknown): boolean {
  if (!isRecord(value) || !isBoundedText(value.language, 35) || !LANGUAGE_TAG.test(value.language)) {
    return false;
  }

  for (const key of ["codec", "channels", "title"] as const) {
    if (value[key] !== undefined && !isBoundedText(value[key], 100)) return false;
  }

  return value.isDefault === undefined || typeof value.isDefault === "boolean";
}

function isMediaTrackList(value: unknown): boolean {
  return Array.isArray(value) && value.length <= 32 && value.every(isMediaTrack);
}

/**
 * Runtime guard for data received from APIs or other untrusted boundaries.
 * A valid URL is not proof that the remote source or its media is trustworthy.
 */
export function isValidTorrentSource(value: unknown): value is TorrentSource {
  if (!isRecord(value)) return false;

  if (
    !isBoundedText(value.id, 128) ||
    !IDENTIFIER.test(value.id) ||
    !isBoundedText(value.contentId, 128) ||
    !IDENTIFIER.test(value.contentId) ||
    !isBoundedText(value.name, 500) ||
    !isBoundedText(value.quality, 32) ||
    !isBoundedText(value.sourceName, 100) ||
    !Number.isSafeInteger(value.sizeBytes) ||
    (value.sizeBytes as number) <= 0 ||
    !Number.isSafeInteger(value.seeders) ||
    (value.seeders as number) < 0 ||
    !Number.isSafeInteger(value.leechers) ||
    (value.leechers as number) < 0 ||
    typeof value.status !== "string" || !["active", "reported", "removed"].includes(value.status) ||
    typeof value.isDemo !== "boolean" ||
    !isIsoTimestampWithTimezone(value.updatedAt)
  ) return false;

  if (value.magnetUri !== null && !isSafeMagnetUri(value.magnetUri)) return false;
  if (value.torrentUrl !== null && !isSafeTorrentUrl(value.torrentUrl)) return false;

  if (value.streamUrl !== undefined && value.streamUrl !== null) {
    if (
      typeof value.streamMimeType !== "string" ||
      !STREAM_MIME_TYPES.includes(value.streamMimeType as typeof STREAM_MIME_TYPES[number]) ||
      !isSafeBrowserStream(value.streamUrl, value.streamMimeType)
    ) return false;
  } else if (value.streamMimeType !== undefined) {
    return false;
  }

  if (value.audioLanguages !== undefined && !isLanguageList(value.audioLanguages)) return false;
  if (value.subtitleLanguages !== undefined && !isLanguageList(value.subtitleLanguages)) return false;
  if (value.audioTracks !== undefined && !isMediaTrackList(value.audioTracks)) return false;
  if (value.subtitleTracks !== undefined && !isMediaTrackList(value.subtitleTracks)) return false;

  if (
    value.mediaValidationStatus !== undefined &&
    typeof value.mediaValidationStatus !== "string" || !["verified", "unverified", "failed"].includes(value.mediaValidationStatus)
  ) return false;

  if (value.isDemo) {
    return value.magnetUri === null &&
      value.torrentUrl === null &&
      value.streamUrl == null &&
      value.streamMimeType === undefined;
  }

  return isSafeMagnetUri(value.magnetUri) ||
    isSafeTorrentUrl(value.torrentUrl) ||
    (typeof value.streamUrl === "string" && isSafeBrowserStream(value.streamUrl, value.streamMimeType));
}

export function getTorrentSourcesForContent(contentId: string): TorrentSource[] {
  if (
    typeof contentId !== "string" ||
    !contentId.trim() ||
    hasControlCharacters(contentId)
  ) return [];

  const normalizedContentId = contentId.trim();
  return demoSources
    .filter(source =>
      source.contentId === normalizedContentId &&
      source.status === "active" &&
      isValidTorrentSource(source)
    )
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
  if (
    typeof name !== "string" ||
    name.length > 500 ||
    hasControlCharacters(name)
  ) return null;

  const match = /^\s*\[([^\]\r\n]{1,48})\]\s*/u.exec(name);
  const group = match?.[1]?.trim();
  return group && /^[\p{L}\p{N}._ -]+$/u.test(group) ? group : null;
}

export function getAllTorrentSources(): TorrentSource[] {
  return demoSources
    .filter(source => source.status === "active" && isValidTorrentSource(source))
    .map(source => ({ ...source }));
}

export function searchTorrentSources(query: string): TorrentSource[] {
  if (typeof query !== "string") return [];

  const normalized = query.slice(0, 200).trim().toLocaleLowerCase();
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
  if (typeof name !== "string" || hasControlCharacters(name)) return null;

  const normalized = name.trim().replace(/^\[|\]$/g, "").slice(0, 48);
  if (!normalized) return null;

  const matches = getAllTorrentSources().filter(source =>
    (getTorrentReleaseGroup(source.name) ?? source.sourceName).toLocaleLowerCase() === normalized.toLocaleLowerCase()
  );

  return matches.length ? { name: normalized, count: matches.length } : null;
}

/**
 * A browser player accepts only HTTPS media endpoints with an explicit supported MIME type.
 * This is URL hygiene, not proof that the remote server or media is trustworthy.
 */
export function isSafeBrowserStream(value: unknown, mimeType: unknown): value is string {
  if (
    typeof value !== "string" ||
    value.length > 2048 ||
    hasControlOrSpaceCharacters(value)
  ) return false;

  if (
    typeof mimeType !== "string" ||
    !STREAM_MIME_TYPES.includes(mimeType as typeof STREAM_MIME_TYPES[number])
  ) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" &&
      Boolean(url.hostname) &&
      !url.username &&
      !url.password;
  } catch {
    return false;
  }
}
