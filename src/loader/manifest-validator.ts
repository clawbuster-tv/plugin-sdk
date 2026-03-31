import { Permission, type PluginManifest } from '../types.js';

export const PLUGIN_MANIFEST_FILENAME = 'clawbuster-plugin.json';

export type ManifestValidationErrorCode =
  | 'invalid-type'
  | 'missing-field'
  | 'invalid-value'
  | 'unknown-permission';

export interface ManifestValidationError {
  code: ManifestValidationErrorCode;
  path: string;
  message: string;
  value?: unknown;
}

export type ManifestValidationResult =
  | { success: true; manifest: PluginManifest }
  | { success: false; errors: ManifestValidationError[] };

const SEMVER_RE = /^\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?$/;
const PACKAGE_NAME_RE = /^(?:@[a-z0-9][a-z0-9._-]*\/)?[a-z0-9][a-z0-9._-]*$/;

export function validatePluginManifest(input: unknown): ManifestValidationResult {
  const errors: ManifestValidationError[] = [];

  if (!isRecord(input)) {
    return {
      success: false,
      errors: [{
        code: 'invalid-type',
        path: '',
        message: 'Plugin manifest must be a JSON object.',
        value: input,
      }],
    };
  }

  const manifest = input as Partial<PluginManifest>;

  validateRequiredString(manifest, 'name', errors);
  validateRequiredString(manifest, 'version', errors);
  validateRequiredString(manifest, 'displayName', errors);
  validateRequiredString(manifest, 'description', errors);
  validateRequiredString(manifest, 'category', errors);
  validateRequiredString(manifest, 'entry', errors);

  if (typeof manifest.name === 'string' && !PACKAGE_NAME_RE.test(manifest.name)) {
    errors.push({
      code: 'invalid-value',
      path: 'name',
      message: 'Plugin name must be lowercase and use a valid npm package name, including an optional scope.',
      value: manifest.name,
    });
  }

  if (typeof manifest.version === 'string' && !SEMVER_RE.test(manifest.version)) {
    errors.push({
      code: 'invalid-value',
      path: 'version',
      message: 'Plugin version must be valid semver.',
      value: manifest.version,
    });
  }

  if (!isRecord(manifest.compatibility)) {
    errors.push({
      code: 'missing-field',
      path: 'compatibility',
      message: 'Plugin manifest must declare a compatibility block.',
      value: manifest.compatibility,
    });
  } else if (typeof manifest.compatibility.clawbuster !== 'string' || manifest.compatibility.clawbuster.trim().length === 0) {
    errors.push({
      code: 'missing-field',
      path: 'compatibility.clawbuster',
      message: 'Plugin compatibility must declare a Clawbuster version range.',
      value: manifest.compatibility.clawbuster,
    });
  }

  if (!Array.isArray(manifest.permissions)) {
    errors.push({
      code: 'missing-field',
      path: 'permissions',
      message: 'Plugin manifest must declare a permissions array.',
      value: manifest.permissions,
    });
  } else {
    const seen = new Set<string>();
    for (const permission of manifest.permissions) {
      if (!isPermission(permission)) {
        errors.push({
          code: 'unknown-permission',
          path: 'permissions',
          message: `Unknown permission "${String(permission)}".`,
          value: permission,
        });
        continue;
      }

      if (seen.has(permission)) {
        errors.push({
          code: 'invalid-value',
          path: 'permissions',
          message: `Permission "${permission}" is declared more than once.`,
          value: permission,
        });
        continue;
      }

      seen.add(permission);
    }
  }

  validateOptionalString(manifest, 'icon', errors);
  validateOptionalString(manifest, 'author', errors);
  validateOptionalString(manifest, 'license', errors);
  validateOptionalManifestArrays(manifest, errors);

  if (errors.length > 0) {
    return { success: false, errors };
  }

  return { success: true, manifest: manifest as PluginManifest };
}

export function assertValidPluginManifest(input: unknown): PluginManifest {
  const result = validatePluginManifest(input);
  if (!result.success) {
    const summary = result.errors.map((error) => `${error.path || '<root>'}: ${error.message}`).join('; ');
    throw new Error(`Invalid ${PLUGIN_MANIFEST_FILENAME}: ${summary}`);
  }
  return result.manifest;
}

export function isPermission(value: unknown): value is Permission {
  return typeof value === 'string' && (Object.values(Permission) as string[]).includes(value);
}

function validateRequiredString(
  value: Partial<PluginManifest>,
  key: keyof Pick<PluginManifest, 'name' | 'version' | 'displayName' | 'description' | 'category' | 'entry'>,
  errors: ManifestValidationError[]
): void {
  const field = value[key];
  if (typeof field !== 'string' || field.trim().length === 0) {
    errors.push({
      code: 'missing-field',
      path: key,
      message: `${key} is required and must be a non-empty string.`,
      value: field,
    });
  }
}

function validateOptionalString(
  value: Partial<PluginManifest>,
  key: keyof Pick<PluginManifest, 'icon' | 'author' | 'license'>,
  errors: ManifestValidationError[]
): void {
  const field = value[key];
  if (field !== undefined && typeof field !== 'string') {
    errors.push({
      code: 'invalid-type',
      path: key,
      message: `${key} must be a string when provided.`,
      value: field,
    });
  }
}

function validateOptionalManifestArrays(
  manifest: Partial<PluginManifest>,
  errors: ManifestValidationError[]
): void {
  if (manifest.dependencies !== undefined && !Array.isArray(manifest.dependencies)) {
    errors.push({
      code: 'invalid-type',
      path: 'dependencies',
      message: 'dependencies must be an array when provided.',
      value: manifest.dependencies,
    });
  }

  if (manifest.adapters !== undefined) {
    if (!Array.isArray(manifest.adapters)) {
      errors.push({
        code: 'invalid-type',
        path: 'adapters',
        message: 'adapters must be an array when provided.',
        value: manifest.adapters,
      });
    } else {
      manifest.adapters.forEach((adapter, index) => {
        if (!isRecord(adapter)) {
          errors.push({
            code: 'invalid-type',
            path: `adapters[${index}]`,
            message: 'Each adapter entry must be an object.',
            value: adapter,
          });
          return;
        }

        if (typeof adapter.type !== 'string' || adapter.type.trim().length === 0) {
          errors.push({
            code: 'missing-field',
            path: `adapters[${index}].type`,
            message: 'Adapter type is required.',
            value: adapter.type,
          });
        }

        if (typeof adapter.id !== 'string' || adapter.id.trim().length === 0) {
          errors.push({
            code: 'missing-field',
            path: `adapters[${index}].id`,
            message: 'Adapter id is required.',
            value: adapter.id,
          });
        }
      });
    }
  }

  if (manifest.routes !== undefined) {
    if (!Array.isArray(manifest.routes)) {
      errors.push({
        code: 'invalid-type',
        path: 'routes',
        message: 'routes must be an array when provided.',
        value: manifest.routes,
      });
    } else {
      manifest.routes.forEach((route, index) => {
        if (!isRecord(route) || typeof route.path !== 'string' || route.path.trim().length === 0) {
          errors.push({
            code: 'missing-field',
            path: `routes[${index}].path`,
            message: 'Route path is required.',
            value: route,
          });
        }
      });
    }
  }

  if (manifest.settingsUI !== undefined) {
    if (!isRecord(manifest.settingsUI) || typeof manifest.settingsUI.entry !== 'string' || manifest.settingsUI.entry.trim().length === 0) {
      errors.push({
        code: 'missing-field',
        path: 'settingsUI.entry',
        message: 'settingsUI.entry is required when settingsUI is declared.',
        value: manifest.settingsUI,
      });
    }
  }

  if (manifest.migrations !== undefined && !Array.isArray(manifest.migrations)) {
    errors.push({
      code: 'invalid-type',
      path: 'migrations',
      message: 'migrations must be an array when provided.',
      value: manifest.migrations,
    });
  }

  if (manifest.backgroundJobs !== undefined && !Array.isArray(manifest.backgroundJobs)) {
    errors.push({
      code: 'invalid-type',
      path: 'backgroundJobs',
      message: 'backgroundJobs must be an array when provided.',
      value: manifest.backgroundJobs,
    });
  }
}

function isRecord(value: unknown): value is Record<string, any> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}
