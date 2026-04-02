export const PLATFORM_EVENTS = {
  MUSIC_PLAYBACK: 'music:playback',
  MUSIC_FAVORITE: 'music:favorite',
  LIBRARY_SCAN_COMPLETE: 'library:scan-complete',
  PLAYBACK_START: 'playback:start',
  PLAYBACK_STOP: 'playback:stop',
} as const;

export type PlatformEventName = (typeof PLATFORM_EVENTS)[keyof typeof PLATFORM_EVENTS];
