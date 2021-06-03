import fetch from 'node-fetch';

import type { AlgoliaResponseJson } from './types/algoliaResponseJson';

type SearchParams = { [key: string]: string | number | null };

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
class CrawlerApiClient {
  crawlerUserId: string;
  crawlerApiKey: string;
  crawlerApiBaseUrl: string;

  constructor({ crawlerUserId, crawlerApiBaseUrl, crawlerApiKey }) {
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

  static async __handleResponse(res): Promise<AlgoliaResponseJson> {
    if (res.ok) {
      return await res.json();
    }
    const error = await res.json();
    throw new Error(
      `${res.status}: ${res.statusText}\n${error ? JSON.stringify(error) : ''}`
    );
  }

  /**
   * Create a new Crawler.
   *
   * @param name - The crawler's name.
   * @param jsonConfig - The crawler configuration, in JSON format.
   * @returns A promise that will resolve with an object containing the crawler's id: `{ id: 'crawler_id' }`.
   */
  async createCrawler(name, jsonConfig): Promise<AlgoliaResponseJson> {
    const body = {
      name,
      config: jsonConfig,
    };
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers`, {
      method: 'POST',
      headers: {
        Authorization: this.basicAuthToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    return CrawlerApiClient.__handleResponse(res);
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
  async updateCrawler({ id, name, jsonConfig }): Promise<AlgoliaResponseJson> {
    const body = {
      name,
      config: jsonConfig,
    };
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers/${id}`, {
      method: 'PATCH',
      headers: {
        Authorization: this.basicAuthToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    return CrawlerApiClient.__handleResponse(res);
  }

  /**
   * List all Crawlers.
   *
   * @param itemsPerPage - The number of crawlers to return per page.
   * @param page - The page to fetch.
   * @returns A promise that will resolve with an object looking like:
   * {
   * items: [{ id: 'crawler_1_id', name: 'crawler_1_name' },  { id: 'crawler_2_id, ... }],
   * itemsPerPage: 20,
   * page: 1,
   * total: 5
   * }
   * .
   */
  async getCrawlers(
    itemsPerPage = undefined,
    page = undefined
  ): Promise<AlgoliaResponseJson> {
    const searchParams: SearchParams = {};
    if (itemsPerPage) searchParams.itemsPerPage = itemsPerPage;
    if (page) searchParams.page = page;
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
        },
      }
    );
    return CrawlerApiClient.__handleResponse(res);
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
  async updateConfig(id, partialJsonConfig): Promise<AlgoliaResponseJson> {
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers/${id}/config`, {
      method: 'PATCH',
      headers: {
        Authorization: this.basicAuthToken,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(partialJsonConfig),
    });
    return CrawlerApiClient.__handleResponse(res);
  }

  /**
   * Get the crawler's configuration.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with the crawler's config (in JSON format).
   */
  async getConfig(id): Promise<AlgoliaResponseJson> {
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
    return CrawlerApiClient.__handleResponse(res);
  }

  /**
   * Get the status of a crawler.
   *
   * @param id - The id of the crawler.
   * @returns A promise that will resolve with an object containing the status of the crawler.
   */
  async getStatus(id): Promise<AlgoliaResponseJson> {
    const res = await fetch(`${this.crawlerApiBaseUrl}/crawlers/${id}`, {
      headers: {
        Authorization: this.basicAuthToken,
      },
    });
    return CrawlerApiClient.__handleResponse(res);
  }

  /**
   * Get statistics of the last reindex a crawler.
   *
   * @param id - The id of the crawler.
   * @returns A promise that will resolve with an object containing some statistics about the last reindex.
   */
  async getURLStats(id): Promise<AlgoliaResponseJson> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${id}/stats/urls`,
      {
        headers: {
          Authorization: this.basicAuthToken,
        },
      }
    );
    return CrawlerApiClient.__handleResponse(res);
  }

  /**
   * Trigger a reindex on a crawler.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with an object containing a `taskId`.
   */
  async reindex(id): Promise<AlgoliaResponseJson> {
    return await this.__triggerAction({ crawlerId: id, actionName: 'reindex' });
  }
  /**
   * Trigger a run on a crawler.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with an object containing a `taskId`.
   */
  async run(id): Promise<AlgoliaResponseJson> {
    return await this.__triggerAction({ crawlerId: id, actionName: 'run' });
  }
  /**
   * Trigger a pause on a crawler.
   *
   * @param id - Identifier of the Crawler.
   * @returns A promise that will resolve with an object containing a `taskId`.
   */
  async pause(id): Promise<AlgoliaResponseJson> {
    return await this.__triggerAction({ crawlerId: id, actionName: 'pause' });
  }

  async __triggerAction({
    crawlerId,
    actionName,
  }): Promise<AlgoliaResponseJson> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${crawlerId}/${actionName}`,
      {
        method: 'POST',
        headers: {
          Authorization: this.basicAuthToken,
          'Content-Type': 'application/json',
        },
      }
    );
    return CrawlerApiClient.__handleResponse(res);
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
  async waitForTaskToComplete({ crawlerId, taskId }): Promise<void> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${crawlerId}/tasks/${taskId}`,
      {
        headers: {
          Authorization: this.basicAuthToken,
        },
      }
    );
    const { pending } = await res.json();
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
   * @param   p.config - (optional) A partial configuration, that will be merged with the existing configuration
   * before testing the URL (the resulting configuration is only used for the test and not saved in DB).
   * This permit you to test modifications on a configuration before saving them.
   * @returns A promise that will resolve with an object containing the results of the test.
   */
  async testUrl({ crawlerId, url, config }): Promise<AlgoliaResponseJson> {
    const res = await fetch(
      `${this.crawlerApiBaseUrl}/crawlers/${crawlerId}/test`,
      {
        method: 'POST',
        headers: {
          Authorization: this.basicAuthToken,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, config }),
      }
    );
    return await res.json();
  }
}

export { CrawlerApiClient };
