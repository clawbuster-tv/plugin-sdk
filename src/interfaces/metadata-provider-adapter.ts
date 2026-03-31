export interface MetadataSearchQuery {
  text: string;
  mediaType?: string;
  year?: number;
  limit?: number;
  metadata?: Record<string, unknown>;
}

export interface MetadataRecord {
  id: string;
  provider: string;
  mediaType?: string;
  title: string;
  originalTitle?: string;
  overview?: string;
  year?: number;
  releaseDate?: string;
  posterUrl?: string;
  backdropUrl?: string;
  genres?: string[];
  metadata?: Record<string, unknown>;
}

export interface MetadataImage {
  url: string;
  type: 'poster' | 'backdrop' | 'banner' | 'logo' | 'thumb' | string;
  language?: string;
  width?: number;
  height?: number;
  metadata?: Record<string, unknown>;
}

export interface MetadataProviderConfig {
  id?: string | number;
  name?: string;
  type: string;
  apiKey?: string;
  baseUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface MetadataProviderAdapter {
  search(config: MetadataProviderConfig, query: MetadataSearchQuery): Promise<MetadataRecord[]>;
  getMetadata(config: MetadataProviderConfig, metadataId: string): Promise<MetadataRecord | null>;
  getImages(config: MetadataProviderConfig, metadataId: string): Promise<MetadataImage[]>;
}
