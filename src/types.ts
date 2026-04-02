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
  RequestsReadWrite = 'requests:read-write',
  LibraryRead = 'library:read',
  PlaybackRead = 'playback:read',
}

export type TrustLevel = 'official' | 'verified' | 'community';

export const PERMISSION_RISK: Record<Permission, 'low' | 'medium' | 'high'> = {
  [Permission.NetworkOutbound]: 'high',
  [Permission.NetworkListen]: 'high',
  [Permission.StorageRead]: 'medium',
  [Permission.StorageWrite]: 'high',
  [Permission.StorageDownloads]: 'high',
  [Permission.DatabaseRead]: 'medium',
  [Permission.DatabaseReadWrite]: 'medium',
  [Permission.SettingsRead]: 'low',
  [Permission.SettingsReadWrite]: 'medium',
  [Permission.UiSettingsTab]: 'low',
  [Permission.UiPage]: 'low',
  [Permission.UiDashboardWidget]: 'low',
  [Permission.SchedulerRegister]: 'low',
  [Permission.NotificationsSend]: 'medium',
  [Permission.RequestsReadWrite]: 'medium',
  [Permission.LibraryRead]: 'low',
  [Permission.PlaybackRead]: 'low',
};

export const COMMUNITY_PLUGIN_DISCLAIMER =
  'This plugin is provided by a third-party developer and is not affiliated with, endorsed by, or supported by OmniLux. ' +
  'By installing this plugin, you acknowledge that OmniLux bears no responsibility for its functionality, security, ' +
  'or any consequences of its use. The plugin author is solely responsible for the plugin and its compliance with applicable laws.';

export interface PluginAuthor {
  name: string;
  email?: string;
  url?: string;
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
  omnilux: string;
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

export interface PluginPageManifest {
  id: string;
  path: string;
  entry: string;
  navItem?: {
    label: string;
    icon: string;
    position?: 'primary' | 'secondary';
  };
}

export interface PluginSettingsTabManifest {
  id: string;
  label: string;
  icon: string;
  description: string;
  entry: string;
  section?: 'core' | 'plugins';
}

export interface PluginManifest {
  name: string;
  version: string;
  displayName: string;
  description: string;
  category: PluginCategory;
  icon?: string;
  author?: string | PluginAuthor;
  license?: string;
  trust?: TrustLevel;
  disclaimer?: string;
  signature?: string;
  defaultEnabled?: boolean;
  compatibility: PluginCompatibility;
  dependencies?: PluginDependency[];
  permissions: Permission[];
  entry: string;
  adapters?: PluginAdapterManifest[];
  routes?: PluginRouteManifest[];
  settingsUI?: PluginSettingsUiManifest;
  pages?: PluginPageManifest[];
  settingsTabs?: PluginSettingsTabManifest[];
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
  trust: TrustLevel;
  manifest: PluginManifest;
  permissions: Permission[];
  installedAt: string;
  updatedAt: string;
}
