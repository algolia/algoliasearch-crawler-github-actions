import { CrawlerApiClient } from './crawler-api-client';
import { getCrawlerId } from './helpers';

jest.mock('./crawler-api-client');

const CRAWLER_USER_ID = '00000000-0000-4000-a000-000000000001';
const CRAWLER_API_KEY = '00000000-0000-4000-a000-000000000001';
const CRAWLER_API_BASE_URL = 'https://crawler.algolia.com/api/1/';
const ALGOLIA_APP_ID = process.env.ALGOLIA_APP_ID!;

describe('crawlerReindex', () => {
  it('should create a crawler if none', async () => {
    const client = new CrawlerApiClient({
      crawlerApiBaseUrl: CRAWLER_API_BASE_URL,
      crawlerUserId: CRAWLER_USER_ID,
      crawlerApiKey: CRAWLER_API_KEY,
    });
    const spyGet = jest.spyOn(client, 'getCrawlers');
    spyGet.mockImplementation(() => {
      return Promise.resolve({
        items: [],
        itemsPerPage: 20,
        page: 1,
        total: 0,
      });
    });

    const spyCreate = jest.spyOn(client, 'createCrawler');
    spyCreate.mockImplementation(() => {
      return Promise.resolve({
        id: 'foobar',
      });
    });

    const id = await getCrawlerId(
      {
        client,
        name: 'test',
        override: false,
      },
      {
        appId: ALGOLIA_APP_ID,
        apiKey: CRAWLER_API_KEY,
        indexName: 'test',
        siteUrl: 'http://localhost',
      }
    );

    expect(spyGet).toHaveBeenCalledTimes(1);
    expect(id).toBe('foobar');
  });
});
