export interface VpnConfig {
  provider?: string;
  connectionMode?: 'wireguard' | 'openvpn' | 'socks5' | 'custom' | string;
  endpoint?: string;
  username?: string;
  password?: string;
  enabled?: boolean;
  killSwitchEnabled?: boolean;
  metadata?: Record<string, unknown>;
}

export interface KillSwitchRules {
  pauseDownloads?: boolean;
  blockOutbound?: boolean;
  blockInbound?: boolean;
  allowedCidrs?: string[];
  allowedPorts?: number[];
  metadata?: Record<string, unknown>;
}

export interface VpnStatus {
  state: 'disconnected' | 'connecting' | 'connected' | 'error';
  publicIp?: string;
  connectedAt?: string;
  provider?: string;
  connectionMode?: string;
  killSwitchEnabled?: boolean;
  killSwitchRules?: KillSwitchRules;
  warning?: string;
  error?: string;
  metadata?: Record<string, unknown>;
}

export interface VpnAdapter {
  connect(config: VpnConfig): Promise<VpnStatus>;
  disconnect(config?: VpnConfig): Promise<VpnStatus>;
  getStatus(config?: VpnConfig): Promise<VpnStatus>;
  enableKillSwitch(config: VpnConfig, rules?: KillSwitchRules): Promise<void>;
  disableKillSwitch(config?: VpnConfig): Promise<void>;
  getPublicIp(config?: VpnConfig): Promise<string | null>;
}
