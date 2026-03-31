export interface ConnectionTestResult {
  ok: boolean;
  message: string;
  latencyMs?: number;
  details?: Record<string, unknown>;
}

export interface DownloadClientConfig {
  id?: string | number;
  name?: string;
  type: string;
  baseUrl?: string;
  apiKey?: string;
  username?: string;
  password?: string;
  enabled?: boolean;
  defaultCategory?: string;
  defaultSavePath?: string;
  defaultLabels?: string[];
  metadata?: Record<string, unknown>;
}

export interface AddDownloadParams {
  source: string;
  sourceType?: 'magnet' | 'torrent' | 'nzb' | 'url' | 'file';
  title?: string;
  category?: string;
  savePath?: string;
  paused?: boolean;
  priority?: number;
  labels?: string[];
  metadata?: Record<string, unknown>;
}

export interface Download {
  id: string;
  name: string;
  state: string;
  progress: number;
  etaSeconds?: number;
  sizeBytes?: number;
  downloadedBytes?: number;
  uploadedBytes?: number;
  downloadRateBytesPerSecond?: number;
  uploadRateBytesPerSecond?: number;
  ratio?: number;
  savePath?: string;
  category?: string;
  label?: string;
  labels?: string[];
  addedAt?: string;
  completedAt?: string;
  metadata?: Record<string, unknown>;
}

export interface DownloadFilter {
  ids?: string[];
  states?: string[];
  category?: string;
  label?: string;
  query?: string;
  includeCompleted?: boolean;
  limit?: number;
}

export interface DownloadClientStats {
  totalCount: number;
  activeCount: number;
  pausedCount: number;
  completedCount: number;
  downloadRateBytesPerSecond: number;
  uploadRateBytesPerSecond: number;
  freeSpaceBytes?: number;
  queueSizeBytes?: number;
  metadata?: Record<string, unknown>;
}

export interface DownloadClientAdapter {
  testConnection(config: DownloadClientConfig): Promise<ConnectionTestResult>;
  addDownload(config: DownloadClientConfig, params: AddDownloadParams): Promise<Download>;
  getDownloads(config: DownloadClientConfig, filter?: DownloadFilter): Promise<Download[]>;
  getDownload(config: DownloadClientConfig, downloadId: string): Promise<Download | null>;
  pauseDownload(config: DownloadClientConfig, downloadId: string): Promise<void>;
  resumeDownload(config: DownloadClientConfig, downloadId: string): Promise<void>;
  removeDownload(
    config: DownloadClientConfig,
    downloadId: string,
    options?: { deleteData?: boolean }
  ): Promise<void>;
  getStats(config: DownloadClientConfig): Promise<DownloadClientStats>;
  setSpeedLimits(
    config: DownloadClientConfig,
    downloadId: string,
    limits: { downloadBytesPerSecond?: number | null; uploadBytesPerSecond?: number | null }
  ): Promise<void>;
  getLabels(config: DownloadClientConfig): Promise<string[]>;
  setLabel(config: DownloadClientConfig, downloadId: string, label: string | null): Promise<void>;
}
