import type { ConnectionTestResult } from './download-client-adapter.js';

export interface SearchQuery {
  text: string;
  mediaType?: string;
  categories?: string[];
  seasonNumber?: number;
  episodeNumber?: number;
  year?: number;
  imdbId?: string;
  tmdbId?: number;
  tvdbId?: number;
  limit?: number;
  offset?: number;
  metadata?: Record<string, unknown>;
}

export interface SearchResult {
  id: string;
  title: string;
  guid?: string;
  protocol?: 'torrent' | 'nzb' | 'http' | string;
  downloadUrl?: string;
  sizeBytes?: number;
  seeders?: number;
  peers?: number;
  ageHours?: number;
  quality?: string;
  mediaType?: string;
  categories?: string[];
  publishedAt?: string;
  indexerId?: string;
  indexerName?: string;
  score?: number;
  metadata?: Record<string, unknown>;
}

export interface IndexerCapabilities {
  supportsSearch: boolean;
  supportsRss: boolean;
  protocols?: Array<'torrent' | 'nzb' | 'http' | string>;
  searchableMediaTypes?: string[];
  categories?: string[];
  requiresAuthentication?: boolean;
  metadata?: Record<string, unknown>;
}

export interface IndexerConfig {
  id?: string | number;
  name: string;
  type: string;
  baseUrl: string;
  apiKey?: string;
  username?: string;
  password?: string;
  enabled?: boolean;
  protocol?: 'torrent' | 'nzb' | 'http' | string;
  categories?: string[];
  capabilities?: IndexerCapabilities;
  metadata?: Record<string, unknown>;
}

export interface IndexerAdapter {
  testConnection(config: IndexerConfig): Promise<ConnectionTestResult>;
  search(config: IndexerConfig, query: SearchQuery): Promise<SearchResult[]>;
  getRssItems(
    config: IndexerConfig,
    options?: { categories?: string[]; limit?: number }
  ): Promise<SearchResult[]>;
}
