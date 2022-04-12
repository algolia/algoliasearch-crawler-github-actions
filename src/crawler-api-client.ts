import fetch from 'node-fetch';
import type { Response } from 'node-fetch';

// eslint-disable-next-line @typescript-eslint/prefer-ts-expect-error
// @ts-ignore
import { version } from '../package.json';

import type { ConfigJson } from './types/configJson';
import type {
  GetCrawlersResponseBody,
  CreatedCrawlerResponseBody,
  UpdateConfigResponseBody,
  CrawlerStatusResponseBody,
  GetUrlStatsResponseBody,
  TaskResponseBody,
  UrlTestResponseBody,
} from './types/publicApiJsonResponses';

type SearchParams = { [key: string]: boolean | number | string };

export interface ClientParams {
  crawlerUserId: string;
  crawlerApiBaseUrl: string;
  crawlerApiKey: string;
}

export interface CrawlerParams {
  id: string;
  name: string;
  jsonConfig: ConfigJson;
}

export interface ActionParams {
  crawlerId: string;
  actionName: string;
}

export interface TaskParams {
  crawlerId: string;
  taskId: string;
}

export interface TestUrlParams {
  crawlerId: string;
  url: string;
  config?: JSON;
}

const USER_AGENT = `algolia_crawler_github_actions/${version}`;

/**
 * Example of class that can be used to hit the Crawler API.
 *
 * @example
 * const client = new CrawlerApiClient({
 *   crawlerApiBaseUrl: 'https://crawler.algolia.com/api/1/',
 *   crawlerUserId: 'test_user@algolia.com',
 *   crawlerApiKey: 'crawler_api_key'
 * });
 * await client.reindex('crawler_id');
 */
export class CrawlerApiClient {
  crawlerUserId: string;
  crawlerApiKey: string;
  crawlerApiBaseUrl: string;

  constructor({
    crawlerUserId,
    crawlerApiBaseUrl,
    crawlerApiKey,
  }: ClientParams) {
    this.crawlerUserId = crawlerUserId;
    this.crawlerApiKey = crawlerApiKey;
    this.crawlerApiBaseUrl = crawlerApiBaseUrl;
  }

  /**
   * Get Basic Auth token, base64 encoded.
   *
   * @returns - Basic Auth Token.
   */
  get basicAuthToken(): string {
    return `Basic ${Buffer.from(
      `${this.crawlerUserId}:${this.crawlerApiKey}`
    ).toString('base64')}`;
  }

  static async __handleResponse<TBody>(res: Response): Promise<TBody> {
    if (res.ok) {
      try {
        return (await res.json()) as TBody;
      } catch (err) {
        console.log('Body', await res.text());
        throw new Error('Cant decode success body');
      }
    }

    const body = await res.text();
    throw new Error(`${res.status}: ${res.statusText}\n${body}`);
  }

  /**
   * Create a new Crawler.
   *
   * @param name - The crawler's name.
   * @param jsonConfig - The crawler configuration, in JSON format.
   * @returns A promise that will resolve with an object containing the crawler's id: `{ id: 'crawler_id' }`.
   */
  async createCrawler(
    name: string,
    jsonConfig: ConfigJson
  ): Promise<CreatedCrawlerResponseBody> {
    const body = {
      name,
      config: jsonConfig,
    };
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers`, {
      method: 'POST',
      headers: {
        Authorization: this.basicAuthToken,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify(body),
    });

    return CrawlerApiClient.__handleResponse<CreatedCrawlerResponseBody>(res);
  }

  /**
   * Update a Crawler.
   *
   * @param p - Params.
   * @param p.id - Identifier of the crawler to update.
   * @param p.name - (optional) The new name of the crawler.
   * @param p.jsonConfig - (optional) The new configuration of the crawler. It must be a complete config as it
   * will completely override the existing one.
   * @returns A promise that will resolve with an object containing a taskId: `{ taskId: 'task_id' }`.
   */
  async updateCrawler({
    id,
    name,
    jsonConfig,
  }: CrawlerParams): Promise<TaskResponseBody> {
    const body = {
      name,
      config: jsonConfig,
    };
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.basicAuthToken,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify(body),
    });
    return CrawlerApiClient.__handleResponse<TaskResponseBody>(res);
  }

  /**
   * List all Crawlers.
   *
   * @param p - Params.
   * @param p.itemsPerPage - The number of crawlers to return per page.
   * @param p.page - The page to fetch.
   * @param p.name - Name of the crawler to get.
   * @param p.appId - Application of the crawlers to get.
   * @returns A promise that will resolve with an object looking like:
   * {
   * items: [{ id: 'crawler_1_id', name: 'crawler_1_name' },  { id: 'crawler_2_id, ... }],
   * itemsPerPage: 20,
   * page: 1,
   * total: 5
   * }
   * .
   */
  async getCrawlers({
    itemsPerPage,
    page,
    name,
    appId,
  }: {
    itemsPerPage?: number;
    page?: number;
    name?: string;
    appId?: string;
  }): Promise<GetCrawlersResponseBody> {
    const searchParams: SearchParams = {};
    if (itemsPerPage) searchParams.itemsPerPage = itemsPerPage;
    if (page) searchParams.page = page;
    if (name) searchParams.name = name;
    if (appId) searchParams.appId = appId;
    const qs = Object.keys(searchParams)
      .map(
        (k) => `${encodeURIComponent(k)}=${encodeURIComponent(searchParams[k])}`
      )
      .join('&');
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers${qs ? `?${qs}` : ''}`,
      {
        headers: {
          Authorization: this.basicAuthToken,
          'User-Agent': USER_AGENT,
        },
      }
    );
    return CrawlerApiClient.__handleResponse<GetCrawlersResponseBody>(res);
  }

  /**
   * Update a Crawler's configuration.
   *
   * @param id - Identifier of the crawler configuration to update.
   * @param partialJsonConfig - The config object that will be merged with the current configuration.
   * @example
   * The merge will be done on top-level properties:
   *   const newConfig = {
   *     ...currentConfigInDB,
   *     ...partialJsonConfig,
   *   }
   * @returns A promise that will resolve with an object containing a taskId: `{ taskId: 'task_id' }`.
   */
  async updateConfig(
    id: string,
    partialJsonConfig: ConfigJson
  ): Promise<UpdateConfigResponseBody> {
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers/${id}/config`, {
      method: 'PATCH',
      headers: {
        Authorization: this.basicAuthToken,
        'Content-Type': 'application/json',
        'User-Agent': USER_AGENT,
      },
      body: JSON.stringify(partialJsonConfig),
    });
    return CrawlerApiClient.__handleResponse<UpdateConfigResponseBody>(res);
  }

  /**
   * Get the crawler's configuration.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with the crawler's config (in JSON format).
   */
  async getConfig(id: string): Promise<CrawlerStatusResponseBody> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${id}?withConfig=true`,
      {
        headers: {
          Authorization: this.basicAuthToken,
        },
      }
    );
    /*     const { config } = await CrawlerApiClient.__handleResponse(res);
    return config; */
    return CrawlerApiClient.__handleResponse<CrawlerStatusResponseBody>(res);
  }

  /**
   * Get the status of a crawler.
   *
   * @param id - The id of the crawler.
   * @returns A promise that will resolve with an object containing the status of the crawler.
   */
  async getStatus(id: string): Promise<CrawlerStatusResponseBody> {
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers/${id}`, {
      headers: {
        Authorization: this.basicAuthToken,
        'User-Agent': USER_AGENT,
      },
    });
    return CrawlerApiClient.__handleResponse<CrawlerStatusResponseBody>(res);
  }

  /**
   * Get statistics of the last reindex a crawler.
   *
   * @param id - The id of the crawler.
   * @returns A promise that will resolve with an object containing some statistics about the last reindex.
   */
  async getURLStats(id: string): Promise<GetUrlStatsResponseBody> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${id}/stats/urls`,
      {
        headers: {
          Authorization: this.basicAuthToken,
          'User-Agent': USER_AGENT,
        },
      }
    );
    return CrawlerApiClient.__handleResponse<GetUrlStatsResponseBody>(res);
  }

  /**
   * Trigger a reindex on a crawler.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with an object containing a `taskId`.
   */
  async reindex(id: string): Promise<TaskResponseBody> {
    return await this.__triggerAction({ crawlerId: id, actionName: 'reindex' });
  }
  /**
   * Trigger a run on a crawler.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with an object containing a `taskId`.
   */
  async run(id: string): Promise<TaskResponseBody> {
    return await this.__triggerAction({ crawlerId: id, actionName: 'run' });
  }
  /**
   * Trigger a pause on a crawler.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with an object containing a `taskId`.
   */
  async pause(id: string): Promise<TaskResponseBody> {
    return await this.__triggerAction({ crawlerId: id, actionName: 'pause' });
  }

  async __triggerAction({
    crawlerId,
    actionName,
  }: ActionParams): Promise<TaskResponseBody> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${crawlerId}/${actionName}`,
      {
        method: 'POST',
        headers: {
          Authorization: this.basicAuthToken,
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT,
        },
      }
    );
    return CrawlerApiClient.__handleResponse<TaskResponseBody>(res);
  }

  /**
   * Wait for a task to complete. This method will poll the specified crawler every second
   * until the given task is not in `pending` state.
   *
   * @param p - Params.
   * @param p.crawlerId - The id of the crawler the task has been triggered on.
   * @param p.taskId - The id of the task.
   * @returns A promise that will resolve when the task has been executed.
   */
  async waitForTaskToComplete({
    crawlerId,
    taskId,
  }: TaskParams): Promise<void> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${crawlerId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: this.basicAuthToken,
          'User-Agent': USER_AGENT,
        },
      }
    );
    const { pending } = (await res.json()) as any;
    if (pending) {
      // console.log(`Task ${taskId} is pending, waiting...`);
      await new Promise((resolve) => {
        setTimeout(resolve, 1000);
      });
      await this.waitForTaskToComplete({ crawlerId, taskId });
    }
  }

  /**
   * Test a crawler config against an URL.
   *
   * @param p - Params.
   * @param p.crawlerId - The id of the crawler's config to test against.
   * @param p.url - The URL to test.
   * @param p.config - (optional) A partial configuration, that will be merged with the existing configuration
   * before testing the URL (the resulting configuration is only used for the test and not saved in DB).
   * This permit you to test modifications on a configuration before saving them.
   * @returns A promise that will resolve with an object containing the results of the test.
   */
  async testUrl({
    crawlerId,
    url,
    config,
  }: TestUrlParams): Promise<UrlTestResponseBody> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${crawlerId}/test`,
      {
        method: 'POST',
        headers: {
          Authorization: this.basicAuthToken,
          'Content-Type': 'application/json',
          'User-Agent': USER_AGENT,
        },
        body: JSON.stringify({ url, config }),
      }
    );
    return (await res.json()) as UrlTestResponseBody;
  }
}
