export interface PluginDatabaseStatement<TResult = unknown, TParams = unknown> {
  get(params?: TParams): Promise<TResult | undefined>;
  all(params?: TParams): Promise<TResult[]>;
  run(params?: TParams): Promise<unknown>;
}

export interface PluginDatabase {
  /**
   * Implementations must scope statements to the current plugin and auto-prefix
   * plugin-owned tables with `plugin_{pluginId}_`.
   */
  prepare<TResult = unknown, TParams = unknown>(sql: string): PluginDatabaseStatement<TResult, TParams>;
  exec(sql: string): Promise<void>;
  transaction<TResult>(fn: () => TResult | Promise<TResult>): Promise<Awaited<TResult>>;
}
