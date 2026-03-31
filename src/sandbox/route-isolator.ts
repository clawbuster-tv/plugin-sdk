export type PluginRouteMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'OPTIONS' | 'HEAD' | string;
export type PluginRouteAuthMode = 'required' | 'optional' | 'none' | 'admin';

export interface PluginRouteDefinition<THandler = unknown, TMiddleware = unknown> {
  path: string;
  mountPath?: string;
  allowCustomMountPath?: boolean;
  method?: PluginRouteMethod;
  handler: THandler;
  middlewares?: TMiddleware[];
  auth?: PluginRouteAuthMode;
  metadata?: Record<string, unknown>;
}

export interface IsolatedPluginRoute<THandler = unknown, TMiddleware = unknown>
  extends PluginRouteDefinition<THandler, TMiddleware> {
  pluginId: string;
  mountPath: string;
}

export interface RouteIsolationOptions<TMiddleware = unknown> {
  authMiddleware?: TMiddleware | TMiddleware[];
  adminMiddleware?: TMiddleware | TMiddleware[];
  basePath?: string;
}

export function getPluginRouteBasePath(pluginId: string): string {
  if (typeof pluginId !== 'string' || pluginId.trim().length === 0) {
    throw new Error('pluginId cannot be empty');
  }

  return `/api/plugins/${encodeURIComponent(pluginId)}`;
}

export function isolatePluginRoutes<THandler = unknown, TMiddleware = unknown>(
  pluginId: string,
  routes: PluginRouteDefinition<THandler, TMiddleware>[],
  options: RouteIsolationOptions<TMiddleware> = {}
): IsolatedPluginRoute<THandler, TMiddleware>[] {
  const basePath = normalizeRoutePath(options.basePath ?? getPluginRouteBasePath(pluginId));
  const authMiddlewares = normalizeMiddleware(options.authMiddleware);
  const adminMiddlewares = normalizeMiddleware(options.adminMiddleware);

  return routes.map((route) => {
    const routePath = normalizeRoutePath(route.path);
    const routeMiddlewares = route.auth === 'none'
      ? [...(route.middlewares ?? [])]
      : route.auth === 'optional'
        ? [...(route.middlewares ?? [])]
        : route.auth === 'admin'
          ? [...authMiddlewares, ...adminMiddlewares, ...(route.middlewares ?? [])]
          : [...authMiddlewares, ...(route.middlewares ?? [])];
    const resolvedMountPath = route.mountPath
      ? normalizeRoutePath(route.mountPath)
      : routePath === '/'
        ? basePath
        : `${basePath}${routePath}`;
    const mountPath = route.mountPath && !route.allowCustomMountPath
      ? ensureRouteWithinNamespace(pluginId, basePath, resolvedMountPath, route.mountPath)
      : resolvedMountPath;

    return {
      ...route,
      path: routePath,
      method: route.method ?? 'GET',
      middlewares: routeMiddlewares,
      pluginId,
      mountPath,
    };
  });
}

function ensureRouteWithinNamespace(pluginId: string, basePath: string, resolvedMountPath: string, rawMountPath: string): string {
  if (resolvedMountPath === basePath || resolvedMountPath.startsWith(`${basePath}/`)) {
    return resolvedMountPath;
  }

  throw new Error(
    `Invalid mountPath "${rawMountPath}" for plugin "${pluginId}": custom mount paths must stay within "${basePath}" unless allowCustomMountPath is true.`,
  );
}

function normalizeRoutePath(path: string): string {
  const trimmed = path.trim();
  if (trimmed.length === 0 || trimmed === '/') {
    return '/';
  }

  const normalized = trimmed.startsWith('/') ? trimmed : `/${trimmed}`;
  const decodedPath = decodeRoutePath(normalized);
  const decodedSegments = decodedPath.split('/').filter((segment) => segment.length > 0);

  if (decodedSegments.some((segment) => segment === '.' || segment === '..')) {
    throw new Error(`Invalid route path "${path}": path traversal is not allowed.`);
  }

  const normalizedSegments = normalized.split('/').filter((segment) => segment.length > 0);
  return normalizedSegments.length === 0 ? '/' : `/${normalizedSegments.join('/')}`;
}

function decodeRoutePath(path: string): string {
  try {
    return decodeURIComponent(path);
  } catch {
    throw new Error(`Invalid route path "${path}": malformed percent-encoding.`);
  }
}

function normalizeMiddleware<TMiddleware>(middleware?: TMiddleware | TMiddleware[]): TMiddleware[] {
  if (middleware === undefined) {
    return [];
  }
  return Array.isArray(middleware) ? [...middleware] : [middleware];
}
