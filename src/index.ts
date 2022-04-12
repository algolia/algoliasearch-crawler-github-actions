/* eslint-disable no-console */
import * as core from '@actions/core';
import * as github from '@actions/github';

import { CrawlerApiClient } from './crawler-api-client';
import { addComment, getCrawlerId } from './helpers';

// CREDENTIALS
const CRAWLER_USER_ID = core.getInput('crawler-user-id');
const CRAWLER_API_KEY = core.getInput('crawler-api-key');
const CRAWLER_API_BASE_URL = core.getInput('crawler-api-base-url');
const GITHUB_TOKEN = core.getInput('github-token');

// CRAWLER CONFIGURATION
const CRAWLER_NAME = core.getInput('crawler-name');
const INDEX_NAME = CRAWLER_NAME.replace(/[ /]/g, '-').replace(
  /[/~,[\]`&|;$*\\]/g,
  ''
);
const ALGOLIA_APP_ID = core.getInput('algolia-app-id');
const ALGOLIA_API_KEY = core.getInput('algolia-api-key');
const SITE_URL = core.getInput('site-url');
const OVERRIDE_CONFIG = core.getInput('override-config') === 'true';

async function run(): Promise<void> {
  const crawlerApiBaseUrl = CRAWLER_API_BASE_URL;
  const appId = ALGOLIA_APP_ID;
  const name = CRAWLER_NAME;

  const client = new CrawlerApiClient({
    crawlerApiBaseUrl,
    crawlerUserId: CRAWLER_USER_ID,
    crawlerApiKey: CRAWLER_API_KEY,
  });
  const octokit = github.getOctokit(GITHUB_TOKEN);

  console.log('---------CRAWLER CONFIG---------');
  console.log(`CRAWLER_NAME : ${CRAWLER_NAME}`);

  let crawlerId: string;
  try {
    crawlerId = await getCrawlerId(
      {
        client,
        override: OVERRIDE_CONFIG,
        name,
      },
      {
        appId,
        apiKey: ALGOLIA_API_KEY,
        indexName: INDEX_NAME,
        siteUrl: SITE_URL,
      }
    );
  } catch (err) {
    core.error(new Error('Can not upsert crawler'), {
      title: err instanceof Error ? err.message : '',
    });
    return;
  }

  console.log(`---------- Reindexing crawler ${crawlerId} ----------`);
  await client.reindex(crawlerId);

  await addComment({ octokit, crawlerApiBaseUrl, crawlerId, appId, name });
}

run().catch((error) => {
  core.setFailed(error);
});
