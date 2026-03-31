import type { ConnectionTestResult } from './download-client-adapter.js';

export interface NotificationPayload {
  eventType?: string;
  title?: string;
  message?: string;
  mediaType?: string;
  mediaTitle?: string;
  imageUrl?: string;
  metadata?: Record<string, unknown>;
}

export interface NotificationAgentConfig {
  id?: string | number;
  name?: string;
  type: string;
  enabled?: boolean;
  settings?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

export interface NotificationAgentCapabilities {
  supportedEvents?: string[];
  supportsRichText?: boolean;
  supportsAttachments?: boolean;
  supportsImages?: boolean;
  metadata?: Record<string, unknown>;
}

export interface NotificationAgentAdapter {
  send(config: NotificationAgentConfig, payload: NotificationPayload): Promise<void>;
  testConnection(config: NotificationAgentConfig): Promise<ConnectionTestResult>;
  getCapabilities(config?: NotificationAgentConfig): Promise<NotificationAgentCapabilities>;
}
