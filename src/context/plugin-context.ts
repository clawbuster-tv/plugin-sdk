import type { PluginDatabase } from './plugin-database.js';
import type { PluginLogger } from './plugin-logger.js';
import type { PluginSettings } from './plugin-settings.js';
import type { PluginRouteDefinition } from '../sandbox/route-isolator.js';
import type { DownloadClientConfig } from '../interfaces/download-client-adapter.js';

export interface PluginJobRegistration {
  id: string;
  schedule: string;
  handler: () => Promise<void> | void;
  metadata?: Record<string, unknown>;
}

export interface PluginSettingsPanelRegistration {
  id: string;
  title: string;
  component: unknown;
  metadata?: Record<string, unknown>;
}

export interface PluginDownloadHistoryQuery {
  status?: string;
  clientType?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PluginDownloadReconciliationStateChange {
  jobId: number;
  previousStatus: string;
  newStatus: string;
  stateChanged: boolean;
  progress: number;
  externalState?: string;
  savePath?: string;
  errorMessage?: string;
}

export interface PluginDownloadReconciliationError {
  clientId: number;
  clientName: string;
  error: string;
}

export interface PluginDownloadReconciliationReport {
  timestamp: string;
  clientsPolled: number;
  clientsFailed: number;
  jobsReconciled: number;
  stateChanges: PluginDownloadReconciliationStateChange[];
  errors: PluginDownloadReconciliationError[];
}

export interface PluginDownloadCoreApi {
  listEnabledClients(): Promise<DownloadClientConfig[]>;
  listLabels(): Promise<Array<Record<string, unknown>>>;
  createLabel(name: string, color: string): Promise<Record<string, unknown>>;
  updateLabel(id: number, patch: { name?: string; color?: string }): Promise<Record<string, unknown> | null>;
  deleteLabel(id: number): Promise<boolean>;
  assignLabelsToJob(clientId: number, externalId: string, labelIds: number[]): Promise<void>;
  bulkAssignLabels(jobIds: number[], labelIds: number[]): Promise<void>;
  listHistory(filters?: PluginDownloadHistoryQuery): Promise<{ entries: Array<Record<string, unknown>>; total: number }>;
  getAnalytics(): Promise<Record<string, unknown>>;
  getQueueItemDetail(clientId: number, externalId: string): Promise<Record<string, unknown> | null>;
  setQueueItemSpeedLimit(
    clientId: number,
    externalId: string,
    maxDownloadSpeed?: number,
    maxUploadSpeed?: number,
  ): Promise<void>;
  setQueueItemPriority(clientId: number, externalId: string, priority: number): Promise<void>;
  setQueueItemSequential(clientId: number, externalId: string, sequential: boolean): Promise<void>;
  setQueueItemFilesPriority(
    clientId: number,
    externalId: string,
    files: Array<{ index: number; priority: string }>,
  ): Promise<void>;
  syncQueue(): Promise<PluginDownloadReconciliationReport>;
  publishLabelsRealtime(): Promise<void>;
}

export interface PluginCoreApi {
  getVersion?(): string;
  hasFeature?(feature: string): boolean;
  metadata?: Record<string, unknown>;
  downloads?: PluginDownloadCoreApi;
}

export interface PluginContext {
  pluginId: string;
  pluginVersion: string;
  registerAdapter<TAdapter>(type: string, id: string, adapter: TAdapter): void;
  getAdapter<TAdapter>(type: string, id: string): TAdapter | undefined;
  getAdaptersOfType<TAdapter>(type: string): TAdapter[];
  registerRoutes(routes: PluginRouteDefinition[]): void;
  registerJob(job: PluginJobRegistration): void;
  registerSettingsPanel(panel: PluginSettingsPanelRegistration): void;
  db: PluginDatabase;
  settings: PluginSettings;
  on<TPayload = unknown>(
    event: string,
    listener: (payload: TPayload) => void | Promise<void>
  ): () => void;
  emit<TPayload = unknown>(event: string, payload: TPayload): void | Promise<void>;
  log: PluginLogger;
  core: PluginCoreApi;
}
