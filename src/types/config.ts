/* eslint-disable no-undef */
/// <reference types="@types/cheerio" />

import type { AlgoliaSettings } from './algoliaSettings';
import type { FileTypes } from './fileTypes';

/**
 * Specification of a CrawlerConfig object, i.e. The unserialized UserConfig.config field.
 */
export interface ExternalDataSourceGoogleAnalytics {
  dataSourceId: string;
  type: 'googleanalytics';
  metrics: string[];
  startDate?: string;
  endDate?: string;
  samplingLevel?: 'DEFAULT' | 'SMALL' | 'LARGE';
  credentials: {
    type: 'service_account';
    client_email: string;
    private_key: string;
    viewIds?: string[];
  };
}

export interface ExternalDataSourceCSV {
  dataSourceId: string;
  type: 'csv';
  url: string;
}

export interface ExtractionHelpers {
  splitContentIntoRecords: (params?: {
    /**
     * A [Cheerio instance](https://cheerio.js.org/) that determines from which element(s) textual content will be extracted and turned into records.
     *
     * @default `$('body')`
     */
    $elements?: cheerio.Cheerio;

    /**
     * Attributes (and their values) to add to all resulting records.
     *
     * @default `{}`
     */
    baseRecord?: Record<string, unknown>;

    /**
     * Maximum number of bytes allowed per record, on the resulting Algolia index.
     *
     * @default `10000`
     */
    maxRecordBytes?: number;

    /**
     * Name of the attribute in which to store the text of each record.
     *
     * @default `'text'`
     */
    textAttributeName?: string;

    /**
     * Name of the attribute in which to store the number of each record.
     */
    orderingAttributeName?: string;
  }) => Array<Record<string, any>>;

  docsearch: (params: {
    selectors: {
      lvl0?: string;
      lvl1: string;
      lvl2?: string;
      lvl3?: string;
      lvl4?: string;
      lvl5?: string;
      lvl6?: string;
      content: string;
    };

    /**
     * Should we indexHeadings
     * - true = yes
     * - false = no
     * - { from, to } = from lvl to lvl only.
     */
    indexHeadings?:
      | {
          from: number;
          to: number;
        }
      | false;
  }) => Array<{
    objectID: string;
    [key: string]: any;
  }>;
}

export type RecordExtractor = (params: {
  /** A [Cheerio instance](https://cheerio.js.org/) that contains the HTML for the crawled page. */
  $: cheerio.Root;

  /** A [Location object](https://developer.mozilla.org/en-US/docs/Web/API/Location) containing the URL and metadata for the crawled page. */
  url: URL;

  /** The fileType of the crawled page (e.g.: html, pdf, ...). */
  fileType: keyof typeof FileTypes;

  /** The number of bytes in the crawled page. */
  contentLength: number;

  /** Array of external data sources. */
  dataSources: { [dataSourceName: string]: { [key: string]: any } };

  /** A set of functions to help you extract content. */
  helpers: ExtractionHelpers;
}) => Array<{
  objectID?: string;
  [key: string]: any;
}>;

export interface ExtractorCustom {
  type: 'custom';
  params: {
    method: RecordExtractor;
  };
}

export interface Action {
  /** Unique name of the action. */
  name?: string;

  indexName: string;

  partialUpdate?: boolean;

  /** How often this specific action will run.
   *  See root level schedule for more details.
   */
  schedule?: string;

  /** Will determine which webpages will match for this action. This list is checked against the url of webpages using [micromatch](https://github.com/micromatch/micromatch). Negation, wildcards and more can be used. Check the full documentation. */
  pathsToMatch?: string[];

  /** Will check for the presence or absence of DOM nodes. */
  selectorsToMatch?: string[];

  /** Override if you want to index documents. Chosen file types will be converted to HTML using [Tika](https://wiki.apache.org/tika/TikaJAXRS), then treated as a normal HTML page. See the [documents guide](https://www.algolia.com/doc/tools/crawler/guides/extracting-data/how-to/index-documents/) for a list of available `fileTypes`. */
  fileTypesToMatch?: Array<keyof typeof FileTypes>;

  /** Generate an `objectID` for records that don't have one. See the [`objectID` definition](#). Setting this parameter to `false` means we'll raise an error in case an extracted record doesn't have an `objectID`. Note, this parameter is not compatible with `partialUpdate = true`. */
  autoGenerateObjectIDs?: boolean;

  /** An recordExtractor is just a custom Javascript function that let you execute your own code and extract what you want from a page. */
  recordExtractor?: RecordExtractor;
  extractors?: ExtractorCustom[];
}

/**
 * Typed Schema used for autocompletion in the Editor of the Admin Console.
 * Note: please keep in sync with crawler-common/src/config/validation.
 */
export interface Config {
  /** @required Application ID that specifies which of your Algolia application you want to save your crawler extractions to. */
  appId: string;

  /**
   * @required Algolia API key for your targeted Algolia application. Using the Admin API key is not allowed, and it must:
   * - Have the following rights: `search`, `addObject`, `deleteObject`, `deleteIndex`, `settings`, `editSettings`, `listIndexes`, `browse`
   * - Have access to the correct set of indexes, according to the `indexPrefix` (e.g. have access to `crawler_*` if the indexPrefix is `crawler_`)
   *
   * This key will be generated for you by the Admin Console when you create a configuration, if you provide the Admin API Key. We will never store the Admin API Key.
   */
  apiKey: string;

  /**
   * @default 8 seconds
   *
   * @required Number of concurrent tasks (per second) that can run for this configuration. Higher means more crawls per second.
   * This number works with the following formula:
   * ```
   * MAX ( urls_added_in_the_last_second, urls_currently_being_processed ) <= rateLimit
   * ```
   * If fetching, processing, uploading is taking less than a second, your crawler processes `rateLimit` urls per second.
   *
   * However, if each page takes on average 4 secondes to be processed, your crawler processes `rateLimit / 4` pages per second.
   *
   * It's recommend to start with a low value (e.g. 2) and update it if you need faster crawling: a high `rateLimit` can have a huge impact over bandwidth cost and server resource consumption.
   */
  rateLimit: number;

  /**
   * How often you want to execute a complete recrawl. Expressed using [Later.js' syntax](https://bunkat.github.io/later/).
   *
   * If omitted, you will need to manually launch a reindex operation in order to update the crawled records.
   *
   * Important notes:
   * 1. The interval between two scheduled crawls must be equal or higher than 24 hours.
   * 2. Times will be interpreted as UTC (GMT+0 timezone).
   */
  schedule?: string;

  /**
   * When `true`, all web pages are rendered with a chrome headless browser. You get the rendered HTML result.
   *
   * Because rendering JavaScript-based web pages is much slower than crawling regular HTML pages, you can apply this setting to a specified list of [micromatch](https://github.com/micromatch/micromatch) URL patterns. These patterns can include negations and wildcards.
   *
   *  With this setting enabled, JavaScript is executed on the webpage. Because a lot of websites have infinite refreshes and updates, this Chrome headless browser is configured with a timeout (set to a few seconds).
   *
   * This can lead to inconsistent records across recrawls, depending on the browser load and the website speed.
   *
   * Make sure your crawler manages to load the data from JavaScript-based pages interested in fast enough.
   */
  renderJavaScript?: string[] | boolean;

  /** Saves a backup of your production index before it is overwritten by the index generated during a recrawl. */
  saveBackup?: boolean;

  /**
   * When set to `true`, this tells the Crawler to ignore rules set in the robots.txt.
   */
  ignoreRobotsTxtRules?: boolean;

  /**
   * Whether the Crawler should extract records from a page whose `robots` meta tag contains `noindex` or `none`.
   *
   * When `true`, the crawler will ignore the `noindex` directive of the [robots meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#Other_metadata_names).
   *
   * Its default value is currently `true`, but it will change to `false` in a near future. If you'd like the crawler to not respect the `noindex` directive, you should set it explicitely.
   */
  ignoreNoIndex?: boolean;

  /**
   * Whether the Crawler should follow links marked as `nofollow`.
   *
   * This setting applies to both:
   * - links which should be ignored because the [`robots` meta tag](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/meta/name#Other_metadata_names) contains `nofollow`;
   * - links whose [rel attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel) contains the `nofollow` directive.
   *
   * When `true`, the crawler will consider those links as if they weren't marked to be ignored.
   *
   * The crawler might still ignore links that don't match the patterns of your configuration.
   *
   * Its default value is currently `true`, but it will change to `false` in a near future. If you'd like the crawler to never respect `nofollow` directives, you should set it explicitely.
   *
   * Note: The "To" suffix is here for consistency with `ignoreCanonicalTo`. While it only accepts a boolean for now, we plan for it to accept an array of patterns eventually. Please contact us if you need such fine grained control.
   */
  ignoreNoFollowTo?: boolean;

  /**
   * This tells the Crawler to process a page even if there is a meta canonical URL specified.
   *
   * When set to `true`, it will ignore all canonical.
   * When set to `string[]`, it will ignore canonical that matches the specified patterns.
   */
  ignoreCanonicalTo?: string[] | boolean;

  /**
   * @required if no `sitemaps`
   *
   * Your crawler uses these URLs as a starting point for its crawl.
   */
  startUrls?: string[];

  /**
   * @required if no `startUrls`
   *
   * URLs found in `sitemaps` are treated as `startUrls` for your crawler: they are used as start points for the crawl.
   */
  sitemaps?: string[];

  /**
   * URLs found in `extraUrls` are treated as `startUrls` for your crawler: they are used as start points for the crawl.
   *
   * Crawler saves URLs added through the **Add a URL** field of the Admin's Configuration tab to the `extraUrls` array.
   *
   * Internally `extraUrls` is treated like `startUrls`. The seperate parameter serves to identify which URLs were added directly to the crawler's configuration file vs. Those that were added through the Admin.
   */
  extraUrls?: string[];

  /**
   * Determines the webpage patterns ignored or excluded during a crawl.
   *
   * This list is checked against the url of webpages using [micromatch](https://github.com/micromatch/micromatch). You can use negation, wildcards, and more.
   */
  exclusionPatterns?: string[];

  /** Filters out specified query parameters from crawled urls. Useful for avoiding duplicate crawls of the same page. */
  ignoreQueryParams?: string[];

  /** Prefix added in front of all indices defined in the crawler's configuration. */
  indexPrefix?: string;

  /**
   * Defines the settings for the indices that updated by your crawler.
   *
   * Index names should be provided as keys. Their values are objects that define Algolia index settings as properties (e.g. `searchableAttributes` `attributesForFaceting`).
   *
   * Index settings will only be applied on your Algolia's index during the first run (or if the index doesn't exist when launching the reindex). Once an index has been created, settings are never re-applied: this prevents to not override any manual changes you may have done.
   */
  initialIndexSettings?: {
    [indexName: string]: AlgoliaSettings;
  };

  /**
   * Limits the number of URLs your crawler processes.
   *
   * Useful for demoing and preventing infinite link holes in the website structure.
   *
   * `maxUrls` does not guarantee consistent indexing accross recrawls. Because of parallel processing, discovered URLs can be processed in different orders for different recrawls.
   *
   * This parameter is capped at a maximum of  `1,000,000`.
   */
  maxUrls?: number;

  /**
   * Limits the processing of URLs to a specified depth, inclusively.
   *
   *_Maximum_: `100`.
   *
   * URLs added manually (startUrls, sitemaps...) are not checked against this limit.
   *
   * **How we calculate depth:**.
   *
   * @example
   * ```javascript
   * http://example.com          => 1
   * http://example.com/         => 1
   * http://example.com/foo      => 1
   * http://example.com/foo/     => 2
   * http://example.com/foo/bar  => 2
   * http://example.com/foo/bar/ => 3
   * ...
   * ```
   */
  maxDepth?: number;

  /**
   * Defines which webpages will be visited.
   * It is used in combination with the `pathsToMatchs` of your actions.
   * The Crawler will visit all links that match at least one of those paths.
   */
  discoveryPatterns?: string[];

  /**
   * Defines a hostname key that will be transformed as the value specified.
   * The keys are exact match only.
   *
   * Applied to:
   * - All URLs found
   * - Canonical
   * - Redirection.
   *
   * Not applied to:
   * - props: startUrls, extraUrls, pathsToMatch, etc...
   * - URLs in your code.
   *
   * @example
   * ```javascript
   * hostnameAliases: {
   *    'algolia.com': 'dev.algolia.com'
   * }
   * ```
   */
  hostnameAliases?: Record<string, string>;

  pathAliases?: Record<string, Record<string, string>>;

  /**
   * Determines the function used to extract URLs from pages.
   *
   * If provided, this function is called on a crawled page. Only the URLs it returns are enqueued for further crawling. By default, all the URLs found while crawling a page are enqueued given that they comply with `pathsToMatch`, `fileTypesToMatch` and `exclusions`.
   *
   * Expected return value: `array` of `strings` (URLs).
   */
  linkExtractor?: (params: {
    $: cheerio.Root;
    url: URL;
    defaultExtractor: () => string[];
  }) => string[];

  /**
   * Modify all requests behavior.
   *
   * Cookie Header will be overriden by the cookie fetched in `login`.
   */
  requestOptions?: {
    proxy?: string;
    timeout?: number;
    retries?: number;
    headers?: {
      'Accept-Language'?: string;
      Authorization?: string;
      Cookie?: string;
    };
  };

  /**
   * This property can be set in order to define how the Crawler should login to the website before crawling pages.
   *
   * The Crawler will then extract the `Set-Cookie` response header from the login page and send that Cookie when crawling all pages of the website defined in the configuration.
   */
  login?: {
    fetchRequest?: {
      url: string;
      requestOptions?: {
        method?: string;
        headers?: {
          'Content-Type'?: string;
          Cookie?: string;
          Authorization?: string;
        };
        body?: string;
        timeout?: number;
      };
    };
    browserRequest?: {
      url: string;
      username: string;
      password: string;
    };
  };

  cache?: {
    enabled: boolean;
  };

  /**
   * Defines external data sources you want to retrieve during every recrawl and made available to your extractors.
   *
   * **There are two supported data sources: Google Analytics and CSV files.**.
   *
   * Once you setup an `externalDataSource`, it is exposed your [`extractors`].
   * You can have maximum 10 sources. 11 millions URLs accross all sources.
   * You can access it through the `dataSources` object, which has the following structure.
   *
   * @example
   * ```javascript
   * {
   *   dataSourceId1: { data1: 'val1', data2: 'val2' },
   *   dataSourceId2: { data1: 'val1', data2: 'val2' },
   * }
   * ```
   */
  externalDataSources?: Array<
    ExternalDataSourceGoogleAnalytics | ExternalDataSourceCSV
  >;

  /**
   * Determines which web pages are translated into Algolia records and in what way.
   *
   * A single action defines:
   * 1. The subset of your crawler's websites it targets,
   * 2. The extraction process for those websites,
   * 3. And the index(es) to which the extracted records are pushed.
   *
   * A single web page can match multiple actions. In this case, your crawler creates a record for each matched actions.
   */
  actions: Action[];

  /**
   * A configurable collection of safety checks to make sure the crawl was successful.
   *
   * This configuration describes all the checks the Crawler can perform to ensure data is correct.
   * For example, the number of records from one crawl to another.
   */
  safetyChecks?: {
    /**
     * Checks triggered after the Crawler is done, and before the records
     * are pushed to Algolia into the final index.
     */
    beforeIndexPublishing?: {
      /**
       * Defines the limit of records difference between the new and the last crawl as a percentage of total records (inclusive).
       *
       * _Default_: `10`.
       *
       * _Minimum_: `0`\
       * _Maximum_: `100`.
       *
       * If the new number of records is less than `last number of records * (1 - maxLostRecordsPercentage / 100)`,
       * the process throws a `SafeReindexingError`, blocking the Crawler until manual restart.
       */
      maxLostRecordsPercentage?: number;
    };
  };
}

export default Config;
