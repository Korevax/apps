export type TorrentSourceStatus = "active" | "reported" | "removed";

export interface MediaTrack {
  language: string;
  codec?: string;
  channels?: string;
  title?: string;
  isDefault?: boolean;
}

export interface TorrentSource {
  id: string;
  contentId: string;
  name: string;
  quality: string;
  sizeBytes: number;
  seeders: number;
  leechers: number;
  magnetUri: string | null;
  torrentUrl: string | null;
  sourceName: string;
  status: TorrentSourceStatus;
  /** Fixture data must never expose active copy/download actions. */
  isDemo: boolean;
  updatedAt: string;
  /** Populated only by a trusted media-inspection service. */
  audioLanguages?: string[];
  subtitleLanguages?: string[];
  audioTracks?: MediaTrack[];
  subtitleTracks?: MediaTrack[];
  mediaValidationStatus?: "verified" | "unverified" | "failed";
  /** Browser-compatible HTTPS stream, never a raw magnet URI. */
  streamUrl?: string | null;
  streamMimeType?: "video/mp4" | "video/webm" | "application/vnd.apple.mpegurl";
}
