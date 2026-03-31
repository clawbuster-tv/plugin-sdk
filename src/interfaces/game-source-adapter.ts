export interface GameSourceConfig {
  id?: string | number;
  name?: string;
  metadata?: Record<string, unknown>;
}

export interface GameSourceRecord {
  id: string;
  name: string;
  platform?: string;
  region?: string;
  downloadUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface GameAvailability {
  available: boolean;
  sourceId?: string;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface BulkImportResult {
  imported: number;
  skipped: number;
  errors?: Array<{ sourceId?: string; message: string }>;
}

export interface GameSourceAdapter {
  getSources(config?: GameSourceConfig): Promise<GameSourceRecord[]>;
  checkAvailability(config: GameSourceConfig, sourceId: string): Promise<GameAvailability>;
  bulkImport(config: GameSourceConfig, sourceIds: string[]): Promise<BulkImportResult>;
}
