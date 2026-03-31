import { Permission } from '../types.js';

export class PermissionDeniedError extends Error {
  readonly pluginId: string;
  readonly permission: Permission;

  constructor(pluginId: string, permission: Permission, operation?: string) {
    super(operation
      ? `Plugin "${pluginId}" is not allowed to perform "${operation}" without "${permission}".`
      : `Plugin "${pluginId}" is missing required permission "${permission}".`);
    this.name = 'PermissionDeniedError';
    this.pluginId = pluginId;
    this.permission = permission;
  }
}

export class PermissionChecker {
  readonly pluginId: string;
  private readonly declaredPermissions: Set<Permission>;

  constructor(pluginId: string, permissions: Iterable<Permission>) {
    this.pluginId = pluginId;
    this.declaredPermissions = new Set(permissions);
  }

  has(permission: Permission): boolean {
    return this.declaredPermissions.has(permission);
  }

  assert(permission: Permission, operation?: string): void {
    if (!this.has(permission)) {
      throw new PermissionDeniedError(this.pluginId, permission, operation);
    }
  }

  assertAny(permissions: Permission[], operation?: string): void {
    if (permissions.length === 0) {
      throw new Error('assertAny requires at least one permission');
    }

    if (permissions.some((permission) => this.has(permission))) {
      return;
    }

    throw new PermissionDeniedError(this.pluginId, permissions[0], operation);
  }

  assertNetworkOutbound(operation = 'outbound network access'): void {
    this.assert(Permission.NetworkOutbound, operation);
  }

  assertNetworkListen(operation = 'listen on a network port'): void {
    this.assert(Permission.NetworkListen, operation);
  }

  assertStorageRead(operation = 'read from storage'): void {
    this.assert(Permission.StorageRead, operation);
  }

  assertStorageWrite(operation = 'write to storage'): void {
    this.assert(Permission.StorageWrite, operation);
  }

  assertDownloadsStorage(operation = 'access the downloads directory'): void {
    this.assert(Permission.StorageDownloads, operation);
  }

  assertDatabaseRead(operation = 'read from the database'): void {
    this.assertAny([Permission.DatabaseRead, Permission.DatabaseReadWrite], operation);
  }

  assertDatabaseWrite(operation = 'write to the database'): void {
    this.assert(Permission.DatabaseReadWrite, operation);
  }

  assertSettingsRead(operation = 'read settings'): void {
    this.assertAny([Permission.SettingsRead, Permission.SettingsReadWrite], operation);
  }

  assertSettingsWrite(operation = 'write settings'): void {
    this.assert(Permission.SettingsReadWrite, operation);
  }

  assertSchedulerRegister(operation = 'register background jobs'): void {
    this.assert(Permission.SchedulerRegister, operation);
  }

  assertNotificationsSend(operation = 'send notifications'): void {
    this.assert(Permission.NotificationsSend, operation);
  }

  guard<T>(permission: Permission, operation: string, fn: () => T): T {
    this.assert(permission, operation);
    return fn();
  }
}

export function createPermissionChecker(pluginId: string, permissions: Iterable<Permission>): PermissionChecker {
  return new PermissionChecker(pluginId, permissions);
}
