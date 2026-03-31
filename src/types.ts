export enum Permission {
  NetworkOutbound = 'network:outbound',
  NetworkListen = 'network:listen',
  StorageRead = 'storage:read',
  StorageWrite = 'storage:write',
  StorageDownloads = 'storage:downloads',
  DatabaseRead = 'database:read',
  DatabaseReadWrite = 'database:read-write',
  SettingsRead = 'settings:read',
  SettingsReadWrite = 'settings:read-write',
  UiSettingsTab = 'ui:settings-tab',
  UiPage = 'ui:page',
  UiDashboardWidget = 'ui:dashboard-widget',
  SchedulerRegister = 'scheduler:register',
  NotificationsSend = 'notifications:send',
}

export type AdapterKind =
  | 'DownloadClientAdapter'
  | 'IndexerAdapter'
  | 'VpnAdapter'
  | 'ScannerAdapter'
  | 'SearchAdapter'
  | 'IptvSourceAdapter'
  | 'GameSourceAdapter'
  | 'NotificationAgentAdapter'
  | 'MetadataProviderAdapter'
  | 'ArrServiceAdapter'
  | string;

export type PluginCategory =
  | 'download-client'
  | 'indexer'
  | 'vpn'
  | 'scanner'
  | 'search'
  | 'iptv-source'
  | 'game-source'
  | 'notification-agent'
  | 'metadata-provider'
  | 'arr-service'
  | 'integration'
  | 'ui'
  | 'utility'
  | string;

export interface PluginCompatibility {
  clawbuster: string;
  api?: string;
  metadata?: Record<string, unknown>;
}

export interface PluginDependency {
  name: string;
  version: string;
  optional?: boolean;
}

export interface PluginAdapterManifest {
  type: AdapterKind;
  id: string;
  displayName?: string;
  description?: string;
}

export interface PluginRouteManifest {
  path: string;
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | string;
  description?: string;
}

export interface PluginSettingsUiManifest {
  entry: string;
  tabId?: string;
  displayName?: string;
}

export interface PluginMigrationManifest {
  id: string;
  path: string;
  description?: string;
}

export interface PluginBackgroundJobManifest {
  id: string;
  schedule: string;
  description?: string;
}

export interface PluginManifest {
  name: string;
  version: string;
  displayName: string;
  description: string;
  category: PluginCategory;
  icon?: string;
  author?: string;
  license?: string;
  compatibility: PluginCompatibility;
  dependencies?: PluginDependency[];
  permissions: Permission[];
  entry: string;
  adapters?: PluginAdapterManifest[];
  routes?: PluginRouteManifest[];
  settingsUI?: PluginSettingsUiManifest;
  migrations?: PluginMigrationManifest[];
  backgroundJobs?: PluginBackgroundJobManifest[];
}

export type PluginSource = 'local' | 'npm' | 'github' | 'builtin' | 'unknown' | (string & {});

export interface PluginMeta {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  source: PluginSource;
  manifest: PluginManifest;
  permissions: Permission[];
  installedAt: string;
  updatedAt: string;
}
