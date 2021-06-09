import type { ConfigJson } from './configJson';
import type { Optional } from './utils';

enum JobStatusEnum {
  DONE = 'DONE',
  SKIPPED = 'SKIPPED',
  FAILED = 'FAILED',
  PENDING = 'PENDING',
}

export interface UserConfigReindexSummaryGroup {
  reason: string;
  status: keyof typeof JobStatusEnum;
  category?: string;
  readable?: string;
  nbUrls: number;
  previousNbUrls?: number;
}

export interface GetCrawlersResponseBody {
  items: Array<{ id: string; name: string }>;
  itemsPerPage: number;
  page: number;
  total: number;
}

export interface CreatedCrawlerResponseBody {
  id: string;
}

export interface UpdateConfigResponseBody {
  rateLimit: number;
  startUrls: string[];
}

export interface CrawlerStatusResponseBody {
  name: string;
  createdAt: string;
  updatedAt: string;
  running: boolean;
  reindexing: boolean;
  blocked: boolean;
  blockingError?: string;
  blockingTaskId?: string;
  lastReindexStartedAt: string | null;
  lastReindexEndedAt: string | null;
  config?: ConfigJson;
}

export interface GetUrlStatsResponseBody {
  count: number;
  data: UserConfigReindexSummaryGroup[];
}

export interface TaskResponseBody {
  taskId: string;
}

export interface AlgoliaRecord {
  objectID: string;
  [key: string]: any;
}

export interface RecordsPerExtractor {
  index: number;
  type: 'custom' | 'algoliaCache';
  records: Array<Optional<AlgoliaRecord, 'objectID'>>;
}

export interface ExtractedRecord {
  actionName: string;
  indexName: string;
  partialUpdate: boolean;
  records: AlgoliaRecord[];
  recordsPerExtractor: RecordsPerExtractor[];
}

export type UrlTesterRecord = Pick<
  ExtractedRecord,
  'indexName' | 'records' | 'recordsPerExtractor'
>;

export interface ExternalDataOneUrl {
  url: string;
  dataSources: { [key: string]: any };
}

export interface LoginResponse {
  statusCode: number;
  cookie: string | null;
  httpHeaders: Headers;
  error?: string;
}

export interface UrlTestResponseBody {
  startDate: string;
  endDate: string;
  logs: string[][];
  records: UrlTesterRecord[];
  links: string[];
  externalData?: ExternalDataOneUrl['dataSources'];
  error?: { code?: string; message: string; details?: any };
  loginResponse?: LoginResponse;
}
