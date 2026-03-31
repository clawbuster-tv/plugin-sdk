export interface IptvSourceConfig {
  id?: string | number;
  name?: string;
  sourceUrl?: string;
  epgUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface IptvCatalogQuery {
  query?: string;
  group?: string;
  country?: string;
  language?: string;
  limit?: number;
}

export interface IptvCatalogItem {
  id: string;
  name: string;
  streamUrl?: string;
  group?: string;
  country?: string;
  language?: string;
  logoUrl?: string;
  epgChannelId?: string;
  metadata?: Record<string, unknown>;
}

export interface IptvImportResult {
  imported: number;
  skipped: number;
  errors?: Array<{ itemId?: string; message: string }>;
}

export interface IptvSourceAdapter {
  importM3u(config: IptvSourceConfig, source: string): Promise<IptvImportResult>;
  browseCatalog(config: IptvSourceConfig, query?: IptvCatalogQuery): Promise<IptvCatalogItem[]>;
  importChannel(config: IptvSourceConfig, channelId: string): Promise<IptvCatalogItem | null>;
  refreshEpg(config: IptvSourceConfig): Promise<void>;
}
