export interface ScanResult {
  path: string;
  verdict: 'clean' | 'infected' | 'error' | 'skipped';
  threat?: string;
  error?: string;
  durationMs: number;
  metadata?: Record<string, unknown>;
}

export interface ScannerConfig {
  enabled?: boolean;
  engine?: string;
  quarantineDir?: string;
  metadata?: Record<string, unknown>;
}

export interface ScannerStatus {
  ready: boolean;
  enabled: boolean;
  engine?: string;
  lastUpdatedAt?: string;
  message?: string;
  metadata?: Record<string, unknown>;
}

export interface ScannerAdapter {
  scanFile(config: ScannerConfig, filePath: string): Promise<ScanResult>;
  scanDirectory(
    config: ScannerConfig,
    directoryPath: string,
    options?: { recursive?: boolean; include?: string[]; exclude?: string[] }
  ): Promise<ScanResult[]>;
  updateDefinitions(config?: ScannerConfig): Promise<void>;
  getStatus(config?: ScannerConfig): Promise<ScannerStatus>;
}
