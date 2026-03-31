# @omnilux/plugin-sdk

TypeScript SDK for building OmniLux plugins. Provides the interfaces, types, and runtime context needed to extend the platform with custom adapters, routes, jobs, and settings panels.

## Installation

```bash
pnpm add @omnilux/plugin-sdk
```

## Plugin Lifecycle

Every plugin exports a `register` function that receives a `PluginContext`. Use the context to:

- **Register adapters** -- download clients, indexers, scanners, VPN providers, metadata sources, and more
- **Register routes** -- add custom HTTP endpoints to the server
- **Register jobs** -- schedule recurring background tasks
- **Register settings panels** -- add configuration UI to the admin dashboard

## Minimal Example

```typescript
import type { PluginContext } from '@omnilux/plugin-sdk';

export function register(context: PluginContext): void {
  context.registerRoutes({
    path: '/my-plugin/status',
    method: 'GET',
    handler: async (_req, res) => {
      res.json({ status: 'ok' });
    },
  });

  context.registerJob({
    id: 'my-plugin-sync',
    schedule: '1h',
    handler: async () => {
      context.log.info('running sync job');
    },
  });

  context.registerSettingsPanel({
    entry: './ui/settings.js',
    tabId: 'my-plugin',
    displayName: 'My Plugin',
  });
}

export default register;
```

## Adapter Types

The SDK ships type definitions for all adapter interfaces: `DownloadClientAdapter`, `IndexerAdapter`, `VpnAdapter`, `ScannerAdapter`, `IptvSourceAdapter`, `GameSourceAdapter`, `MetadataProviderAdapter`, `ArrServiceAdapter`, `NotificationAgentAdapter`, and more.

## Documentation

See the [OmniLux docs](https://github.com/omnilux-tv/docs) for the full plugin development guide.

## License

MIT
