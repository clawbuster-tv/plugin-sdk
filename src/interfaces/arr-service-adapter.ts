import type { ConnectionTestResult } from './download-client-adapter.js';

export interface ArrConfig {
  id?: string | number;
  name?: string;
  service: 'sonarr' | 'radarr' | 'lidarr' | 'readarr' | string;
  baseUrl: string;
  apiKey?: string;
  enabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ArrMediaItem {
  id: string | number;
  title: string;
  mediaType?: string;
  year?: number;
  status?: string;
  monitored?: boolean;
  qualityProfileId?: number;
  rootFolderId?: number;
  rootFolder?: string;
  metadata?: Record<string, unknown>;
}

export interface ArrQueueItem {
  id: string | number;
  title: string;
  status?: string;
  sizeBytes?: number;
  progress?: number;
  etaSeconds?: number;
  protocol?: string;
  metadata?: Record<string, unknown>;
}

export interface ArrHistoryItem {
  id: string | number;
  eventType?: string;
  title?: string;
  occurredAt?: string;
  metadata?: Record<string, unknown>;
}

export interface ArrQualityProfile {
  id: number;
  name: string;
  upgradeAllowed?: boolean;
  cutoffId?: number;
  metadata?: Record<string, unknown>;
}

export interface ArrRootFolder {
  id?: number;
  path: string;
  accessible?: boolean;
  freeSpaceBytes?: number;
  metadata?: Record<string, unknown>;
}

export interface ArrRequestInput {
  remoteId?: string | number;
  title?: string;
  qualityProfileId?: number;
  rootFolderId?: number;
  monitored?: boolean;
  metadata?: Record<string, unknown>;
}

export interface ArrServiceAdapter {
  testConnection(config: ArrConfig): Promise<ConnectionTestResult>;
  getLibrary(config: ArrConfig, options?: { limit?: number; page?: number }): Promise<ArrMediaItem[]>;
  addRequest(config: ArrConfig, request: ArrRequestInput): Promise<ArrMediaItem | Record<string, unknown>>;
  getQueue(config: ArrConfig, options?: { limit?: number; page?: number }): Promise<ArrQueueItem[]>;
  getHistory(config: ArrConfig, options?: { limit?: number; page?: number }): Promise<ArrHistoryItem[]>;
  getQualityProfiles(config: ArrConfig): Promise<ArrQualityProfile[]>;
  getRootFolders(config: ArrConfig): Promise<ArrRootFolder[]>;
}
