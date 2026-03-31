import type { SearchResult } from './indexer-adapter.js';

export interface ReleaseScoreInput {
  release: SearchResult;
  requestId?: string | number;
  qualityProfileId?: string | number;
  metadata?: Record<string, unknown>;
}

export interface ReleaseScoreResult {
  score: number;
  accepted: boolean;
  reasons?: string[];
  metadata?: Record<string, unknown>;
}

export interface AutoGrabParams {
  requestId?: string | number;
  releases: SearchResult[];
  dryRun?: boolean;
  metadata?: Record<string, unknown>;
}

export interface AutoGrabResult {
  grabbed: boolean;
  release?: SearchResult;
  reason?: string;
  metadata?: Record<string, unknown>;
}

export interface RssSyncResult {
  processed: number;
  matched: number;
  grabbed: number;
  errors?: Array<{ itemId?: string; message: string }>;
  metadata?: Record<string, unknown>;
}

export interface WantedSearchParams {
  requestIds?: Array<string | number>;
  limit?: number;
  dryRun?: boolean;
  metadata?: Record<string, unknown>;
}

export interface WantedSearchResult {
  processed: number;
  matched: number;
  grabbed: number;
  metadata?: Record<string, unknown>;
}

export interface SearchAdapter {
  scoreRelease(input: ReleaseScoreInput): Promise<ReleaseScoreResult>;
  autoGrab(input: AutoGrabParams): Promise<AutoGrabResult>;
  runRssSync(input?: { dryRun?: boolean; limit?: number; metadata?: Record<string, unknown> }): Promise<RssSyncResult>;
  runWantedSearch(input?: WantedSearchParams): Promise<WantedSearchResult>;
}

export interface RequestPipelineAdapter extends SearchAdapter {}
