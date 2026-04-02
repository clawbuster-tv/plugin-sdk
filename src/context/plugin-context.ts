import type { PluginDatabase } from './plugin-database.js';
import type { PluginLogger } from './plugin-logger.js';
import type { PluginSettings } from './plugin-settings.js';
import type { PluginRouteDefinition } from '../sandbox/route-isolator.js';
import type { DownloadClientConfig } from '../interfaces/download-client-adapter.js';

export interface RequestRecord {
  id: number;
  mediaType: string;
  title: string;
  year?: number;
  tmdbId?: string;
  status: string;
  priority: string;
  userId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface PluginRequestsApi {
  /** List media requests with optional filters */
  list(opts?: { status?: string; mediaType?: string; userId?: number; limit?: number }): Promise<RequestRecord[]>;
  /** Get a single request by ID */
  get(id: number): Promise<RequestRecord | null>;
  /** Create a new media request */
  create(input: { mediaType: string; title: string; year?: number; tmdbId?: string; userId?: number }): Promise<RequestRecord>;
  /** Transition a request to a new status */
  transition(id: number, toStatus: string): Promise<RequestRecord>;
  /** Get pending request count */
  getPendingCount(): Promise<number>;
}

export interface LibraryFileRecord {
  id: number;
  path: string;
  mediaType: string;
  title?: string;
  tmdbId?: string;
  imdbId?: string;
  year?: number;
  section?: string;
  sizeBytes?: number;
  addedAt: string;
}

export interface PluginLibraryApi {
  /** List library files with optional filters */
  listFiles(opts?: { mediaType?: string; section?: string; limit?: number; offset?: number }): Promise<LibraryFileRecord[]>;
  /** Get a single library file by ID */
  getFile(id: number): Promise<LibraryFileRecord | null>;
  /** Get library file by path */
  getFileByPath(path: string): Promise<LibraryFileRecord | null>;
  /** Get library stats (counts by media type) */
  getStats(): Promise<{ total: number; byMediaType: Record<string, number> }>;
  /** List root folders */
  listRootFolders(): Promise<Array<{ id: number; path: string; mediaType: string; label?: string }>>;
}

export interface PlaybackActivityRecord {
  id: number;
  userId?: number;
  mediaPath: string;
  mediaType: string;
  title?: string;
  eventType: string;
  positionSeconds: number;
  durationSeconds?: number;
  player?: string;
  ipAddress?: string;
  createdAt: string;
}

export interface PlaybackDateFilter {
  startDate?: string;
  endDate?: string;
}

export interface PlaybackTopMediaItem {
  mediaId: string;
  mediaType: string;
  title: string;
  plays: number;
  totalWatchTime: number;
}

export interface PlaybackGenreItem {
  genre: string;
  plays: number;
  watchTime: number;
}

export interface PlaybackDeviceItem {
  deviceType: string;
  deviceName: string;
  plays: number;
  watchTime: number;
}

export interface PlaybackHeatmapCell {
  dayOfWeek: number;
  hour: number;
  count: number;
}

export interface PlaybackDailyItem {
  date: string;
  plays: number;
  watchSeconds: number;
}

export interface PlaybackUserStats {
  totalPlays: number;
  totalWatchTimeSeconds: number;
  completedCount: number;
  averageSessionSeconds: number | null;
  completionRate: number;
  lastWatchedAt: string | null;
}

export interface PluginPlaybackApi {
  /** List raw playback activity with optional filters */
  list(opts?: {
    userId?: number;
    mediaType?: string;
    eventType?: string;
    since?: string;
    until?: string;
    limit?: number;
    offset?: number;
  }): Promise<PlaybackActivityRecord[]>;

  /** Get top media by plays or watch time */
  getTopMedia(opts?: {
    userId?: number;
    sortBy?: 'plays' | 'watchTime';
    mediaType?: string;
    limit?: number;
  } & PlaybackDateFilter): Promise<PlaybackTopMediaItem[]>;

  /** Get genre/media-type breakdown */
  getGenreBreakdown(opts?: {
    userId?: number;
    limit?: number;
  } & PlaybackDateFilter): Promise<PlaybackGenreItem[]>;

  /** Get device/player breakdown */
  getDeviceBreakdown(opts?: {
    userId?: number;
  } & PlaybackDateFilter): Promise<PlaybackDeviceItem[]>;

  /** Get hour × day-of-week heatmap */
  getHeatmap(opts?: {
    userId?: number;
  } & PlaybackDateFilter): Promise<PlaybackHeatmapCell[]>;

  /** Get per-date play counts and watch seconds */
  getDailyActivity(opts?: {
    userId?: number;
  } & PlaybackDateFilter): Promise<PlaybackDailyItem[]>;

  /** Get aggregated user stats (plays, watch time, completion rate, avg session) */
  getUserStats(userId: number, opts?: PlaybackDateFilter): Promise<PlaybackUserStats>;

  /** Count currently active streams (played within last 5 minutes without stop/complete) */
  getActiveStreamCount(): Promise<number>;

  /** Get the earliest recorded playback date (ISO string), or null if no data */
  getEarliestDate(): Promise<string | null>;

  /** Get distinct dates with playback activity for a user (for streak calculations) */
  getActivityDates(userId: number, opts?: PlaybackDateFilter): Promise<string[]>;
}

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
  requests?: PluginRequestsApi;
}

export interface PluginNotificationOptions {
  eventType?: string;
  url?: string;
  imageUrl?: string;
}

export interface PluginNotifications {
  /** Send a notification to all configured agents. */
  send(title: string, body: string, opts?: PluginNotificationOptions): Promise<void>;
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
  requests: PluginRequestsApi;
  library: PluginLibraryApi;
  playback: PluginPlaybackApi;
  db: PluginDatabase;
  settings: PluginSettings;
  notifications: PluginNotifications;
  on<TPayload = unknown>(
    event: string,
    listener: (payload: TPayload) => void | Promise<void>
  ): () => void;
  emit<TPayload = unknown>(event: string, payload: TPayload): void | Promise<void>;
  log: PluginLogger;
  core: PluginCoreApi;
}
