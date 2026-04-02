export * from './types.js';
export * from './get-adapter.js';

export type {
  AddDownloadParams,
  ArrConfig,
  ArrHistoryItem,
  ArrMediaItem,
  ArrQualityProfile,
  ArrQueueItem,
  ArrRequestInput,
  ArrRootFolder,
  ArrServiceAdapter,
  AutoGrabParams,
  AutoGrabResult,
  BulkImportResult,
  ConnectionTestResult,
  Download,
  DownloadClientAdapter,
  DownloadClientConfig,
  DownloadClientStats,
  DownloadFilter,
  GameAvailability,
  GameSourceAdapter,
  GameSourceConfig,
  GameSourceRecord,
  IndexerAdapter,
  IndexerCapabilities,
  IndexerConfig,
  IptvCatalogItem,
  IptvCatalogQuery,
  IptvImportResult,
  IptvSourceAdapter,
  IptvSourceConfig,
  KillSwitchRules,
  MetadataImage,
  MetadataProviderAdapter,
  MetadataProviderConfig,
  MetadataRecord,
  MetadataSearchQuery,
  NotificationAgentAdapter,
  NotificationAgentCapabilities,
  NotificationAgentConfig,
  NotificationPayload,
  ReleaseScoreInput,
  ReleaseScoreResult,
  RequestPipelineAdapter,
  RssSyncResult,
  ScanResult,
  ScannerAdapter,
  ScannerConfig,
  ScannerStatus,
  SearchAdapter,
  SearchQuery,
  SearchResult,
  VpnAdapter,
  VpnConfig,
  VpnStatus,
  WantedSearchParams,
  WantedSearchResult,
} from './interfaces/index.js';

export type {
  PluginContext,
  PluginCoreApi,
  PluginDownloadCoreApi,
  PluginDownloadHistoryQuery,
  PluginDownloadReconciliationError,
  PluginDownloadReconciliationReport,
  PluginDownloadReconciliationStateChange,
  PluginJobRegistration,
  PluginLibraryApi,
  PluginNotificationOptions,
  PluginNotifications,
  PluginPlaybackApi,
  PluginRequestsApi,
  PluginSettingsPanelRegistration,
  LibraryFileRecord,
  PlaybackActivityRecord,
  PlaybackDateFilter,
  PlaybackDailyItem,
  PlaybackDeviceItem,
  PlaybackGenreItem,
  PlaybackHeatmapCell,
  PlaybackTopMediaItem,
  PlaybackUserStats,
  RequestRecord,
} from './context/plugin-context.js';
export type {
  PluginDatabase,
  PluginDatabaseStatement,
} from './context/plugin-database.js';
export type { PluginSettings } from './context/plugin-settings.js';
export type { PluginLogger } from './context/plugin-logger.js';

export {
  PLUGIN_MANIFEST_FILENAME,
  assertValidPluginManifest,
  isPermission,
  validatePluginManifest,
} from './loader/manifest-validator.js';
export type {
  ManifestValidationError,
  ManifestValidationErrorCode,
  ManifestValidationResult,
} from './loader/manifest-validator.js';

export { PLATFORM_EVENTS } from './platform-events.js';
export type { PlatformEventName } from './platform-events.js';

export {
  PermissionChecker,
  PermissionDeniedError,
  createPermissionChecker,
} from './sandbox/permission-checker.js';
export {
  getPluginRouteBasePath,
  isolatePluginRoutes,
} from './sandbox/route-isolator.js';
export type {
  IsolatedPluginRoute,
  PluginRouteAuthMode,
  PluginRouteDefinition,
  PluginRouteMethod,
  RouteIsolationOptions,
} from './sandbox/route-isolator.js';
