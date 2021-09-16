/* eslint-disable no-console */
import * as core from '@actions/core';
import * as github from '@actions/github';

import { CrawlerApiClient } from './crawler-api-client';
import type { ConfigJson } from './types/configJson';
import type { GetCrawlersResponseBody } from './types/publicApiJsonResponses';

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
const OVERRIDE_CONFIG = core.getInput('override-config');

interface Comment {
  id: number;
  body?: string;
  user: {
    login: string;
  } | null;
}

const client = new CrawlerApiClient({
  crawlerApiBaseUrl: CRAWLER_API_BASE_URL,
  crawlerUserId: CRAWLER_USER_ID,
  crawlerApiKey: CRAWLER_API_KEY,
});

const octokit = github.getOctokit(GITHUB_TOKEN);

function getConfig(): ConfigJson {
  return {
    appId: ALGOLIA_APP_ID,
    apiKey: ALGOLIA_API_KEY,
    indexPrefix: 'crawler_',
    rateLimit: 8,
    startUrls: [SITE_URL],
    ignoreQueryParams: ['source', 'utm_*'],
    ignoreNoIndex: false,
    ignoreNoFollowTo: false,
    ignoreRobotsTxtRules: false,
    actions: [
      {
        indexName: `${INDEX_NAME}_index`,
        pathsToMatch: [`${SITE_URL}**`],
        recordExtractor: {
          __type: 'function',
          source: getRecordExtractorSource(),
        },
      },
    ],
  };
}

function getRecordExtractorSource(): string {
  return `({ helpers }) => {
  return helpers.netlifyExtractor({ template: 'default' });
}`;
}

function findCommentPredicate(crawlerId: string, comment: Comment): boolean {
  return (
    (comment.user ? comment.user.login === 'github-actions[bot]' : false) &&
    (comment.body ? comment.body.includes(crawlerId) : false)
  );
}

async function findComment(
  prNumber: number,
  crawlerId: string
): Promise<Comment | undefined> {
  const parameters = {
    owner: github.context.repo.owner,
    repo: github.context.repo.repo,
    issue_number: prNumber,
  };

  for await (const { data: comments } of octokit.paginate.iterator(
    octokit.rest.issues.listComments,
    parameters
  )) {
    // Search each page for the comment
    const gaComment = comments.find((comment) =>
      findCommentPredicate(crawlerId, comment)
    );
    if (gaComment) return gaComment;
  }

  return undefined;
}

async function addComment(crawlerId: string): Promise<void> {
  try {
    const context = github.context;
    if (context.payload.pull_request === undefined) {
      core.info('No pull request found.');
      return;
    }
    const prNumber = context.payload.pull_request.number;

    // First check if the comment doesn't already exist
    const comment = await findComment(prNumber, crawlerId);

    const pathArray = CRAWLER_API_BASE_URL.split('/');
    const protocol = pathArray[0];
    const host = pathArray[2];
    const baseUrl = `${protocol}//${host}`;

    const message = `<p>Check your created <a href="${baseUrl}/admin/crawlers/${crawlerId}/overview" target="_blank">Crawler</a></p>
    <p>Check your created index on your <a href="https://www.algolia.com/apps/${ALGOLIA_APP_ID}/explorer/browse/${CRAWLER_NAME}" target="_blank">Algolia Application</a></p>`;

    // If the comment exists, we update it
    if (comment !== undefined) {
      core.info('Existing comment found.');
      await octokit.rest.issues.updateComment({
        ...context.repo,
        comment_id: comment.id,
        body: message,
      });
      core.info(`Updated comment id '${comment.id}'.`);
      return;
    }

    octokit.rest.issues.createComment({
      ...context.repo,
      issue_number: prNumber,
      body: message,
    });
  } catch (error) {
    let errorMessage = 'An unexpected error happened.';

    if (error instanceof Error) {
      errorMessage = error.message;
    } else {
      console.log(error);
    }

    core.setFailed(errorMessage);
  }
}

async function crawlerReindex(): Promise<void> {
  let crawlerId = '';

  // Searching for the crawler, based on the name and application ID
  const crawlers: GetCrawlersResponseBody | undefined =
    await client.getCrawlers({ name: CRAWLER_NAME, appId: ALGOLIA_APP_ID });

  if (typeof crawlers === 'undefined') {
    return;
  }

  if (crawlers.items.length !== 0) {
    // If the crawler exists : update it
    crawlerId = crawlers.items[0].id;
    if (OVERRIDE_CONFIG) {
      const config = getConfig();
      await client.updateConfig(crawlerId, config);
    }
  } else {
    // If it doesn't exist yet: create it
    const crawler = await client.createCrawler(CRAWLER_NAME, getConfig());
    crawlerId = crawler.id;
  }

  console.log(`---------- Reindexing crawler ${crawlerId} ----------`);
  await client.reindex(crawlerId);
  addComment(crawlerId);
}

console.log('---------CRAWLER CONFIG---------');
console.log(`CRAWLER_NAME : ${CRAWLER_NAME}`);

crawlerReindex().catch((error) => console.log(error));
