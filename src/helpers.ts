import * as core from '@actions/core';
import * as github from '@actions/github';
import type { GitHub } from '@actions/github/lib/utils';

import type { CrawlerApiClient } from './crawler-api-client';
import type { ConfigJson } from './types/configJson';
import type { GithubComment } from './types/github';

export function getConfig({
  appId,
  apiKey,
  siteUrl,
  indexName,
}: Pick<ConfigJson, 'apiKey' | 'appId'> & {
  siteUrl: string;
  indexName: string;
}): ConfigJson {
  return {
    appId,
    apiKey,
    indexPrefix: 'crawler_',
    rateLimit: 8,
    startUrls: [siteUrl],
    ignoreQueryParams: ['source', 'utm_*'],
    ignoreNoIndex: false,
    ignoreNoFollowTo: false,
    ignoreRobotsTxtRules: false,
    actions: [
      {
        indexName: `${indexName}_index`,
        pathsToMatch: [`${siteUrl}**`],
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

function findCommentPredicate(
  crawlerId: string,
  comment: GithubComment
): boolean {
  return (
    (comment.user ? comment.user.login === 'github-actions[bot]' : false) &&
    (comment.body ? comment.body.includes(crawlerId) : false)
  );
}

async function findComment({
  octokit,
  prNumber,
  crawlerId,
}: {
  octokit: InstanceType<typeof GitHub>;
  prNumber: number;
  crawlerId: string;
}): Promise<GithubComment | undefined> {
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
    if (gaComment) {
      return gaComment;
    }
  }

  return undefined;
}

export async function addComment({
  octokit,
  crawlerApiBaseUrl,
  crawlerId,
  appId,
  name,
}: {
  octokit: InstanceType<typeof GitHub>;
  crawlerApiBaseUrl: string;
  crawlerId: string;
  appId: string;
  name: string;
}): Promise<void> {
  // eslint-disable-next-line no-console
  console.log('prout');
  try {
    const context = github.context;
    if (context.payload.pull_request === undefined) {
      core.info('No pull request found.');
      return;
    }

    const prNumber = context.payload.pull_request.number;

    // First check if the comment doesn't already exist
    const comment = await findComment({ octokit, prNumber, crawlerId });

    const pathArray = crawlerApiBaseUrl.split('/');
    const protocol = pathArray[0];
    const host = pathArray[2];
    const baseUrl = `${protocol}//${host}`;

    const message = `<p>Check your created <a href="${baseUrl}/admin/crawlers/${crawlerId}/overview" target="_blank">Crawler</a></p>
    <p>Check your created index on your <a href="https://www.algolia.com/apps/${appId}/explorer/browse/${name}" target="_blank">Algolia Application</a></p>`;

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
      // eslint-disable-next-line no-console
      console.log(error);
    }

    core.setFailed(errorMessage);
  }
}

export async function getCrawlerId(
  {
    client,
    name,
    override,
  }: {
    client: CrawlerApiClient;
    name: string;
    override: boolean;
  },
  config: Pick<ConfigJson, 'apiKey' | 'appId'> & {
    siteUrl: string;
    indexName: string;
  }
): Promise<string> {
  // Searching for the crawler, based on the name and application ID
  const crawlers = await client.getCrawlers({
    name,
    appId: config.appId,
  });

  if (crawlers.items.length > 0) {
    // If the crawler exists : update it
    const crawlerId = crawlers.items[0].id;
    if (override) {
      const configJson = getConfig(config);
      await client.updateConfig(crawlerId, configJson);
    }
    return crawlerId;
  }

  // If it doesn't exist yet: create it
  const crawler = await client.createCrawler(name, getConfig(config));
  return crawler.id;
}
