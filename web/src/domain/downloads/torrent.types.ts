export type TorrentSourceStatus = "active" | "reported" | "removed";

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
}
