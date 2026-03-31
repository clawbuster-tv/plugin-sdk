export type AdapterLookup<TAdapter> =
  | Map<string, TAdapter>
  | Record<string, TAdapter>
  | { get(id: string): TAdapter | undefined };

export function getAdapter<TAdapter>(
  registry: AdapterLookup<TAdapter>,
  id: string
): TAdapter | undefined {
  if (registry instanceof Map) {
    return registry.get(id);
  }

  if (typeof (registry as { get?: unknown }).get === 'function') {
    return (registry as { get(key: string): TAdapter | undefined }).get(id);
  }

  return (registry as Record<string, TAdapter>)[id];
}
