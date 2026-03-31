export interface PluginSettings {
  get<TValue = unknown>(key: string): Promise<TValue | undefined> | TValue | undefined;
  set<TValue = unknown>(key: string, value: TValue): Promise<void> | void;
  getAll(): Promise<Record<string, unknown>> | Record<string, unknown>;
  delete(key: string): Promise<void> | void;
}
