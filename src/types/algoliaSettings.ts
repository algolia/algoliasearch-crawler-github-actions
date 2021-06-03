// Copied from algoliasearchjs client
// Explicitely copied for monaco editor, direct import did not work (but should)
// If you find a solution you can remove this file

export interface AlgoliaSettings {
  /**
   * The complete list of attributes that will be used for searching.
   */
  searchableAttributes?: string[];
  /**
   * @deprecated Use `searchableAttributes` instead.
   */
  attributesToIndex?: string[];
  /**
   * The complete list of attributes that will be used for faceting.
   */
  attributesForFaceting?: string[];
  /**
   * List of attributes that cannot be retrieved at query time.
   */
  unretrievableAttributes?: string[];
  /**
   * Gives control over which attributes to retrieve and which not to retrieve.
   */
  attributesToRetrieve?: string[];
  /**
   * Controls the way results are sorted.
   */
  ranking?: string[];
  /**
   * Specifies the custom ranking criterion.
   */
  customRanking?: string[];
  /**
   * Creates replicas, exact copies of an index.
   */
  replicas?: string[];
  /**
   * @deprecated Use `replicas` instead.
   */
  slaves?: string[];
  /**
   * The primary parameter is automatically added to a replica's settings when the replica is created and cannot be modified.
   *
   * Can not be setted.
   */
  primary?: string;
  /**
   * Maximum number of facet values to return for each facet during a regular search.
   */
  maxValuesPerFacet?: number;
  /**
   * Controls how facet values are sorted.
   */
  sortFacetValuesBy?: 'count' | 'alpha';
  /**
   * List of attributes to highlight.
   */
  attributesToHighlight?: string[];
  /**
   * List of attributes to snippet, with an optional maximum number of words to snippet.
   */
  attributesToSnippet?: string[];
  /**
   * The HTML string to insert before the highlighted parts in all highlight and snippet results.
   */
  highlightPreTag?: string;
  /**
   * The HTML string to insert after the highlighted parts in all highlight and snippet results.
   */
  highlightPostTag?: string;
  /**
   * String used as an ellipsis indicator when a snippet is truncated.
   */
  snippetEllipsisText?: string;
  /**
   * Restrict highlighting and snippeting to items that matched the query.
   */
  restrictHighlightAndSnippetArrays?: boolean;
  /**
   * Set the number of hits per page.
   */
  hitsPerPage?: number;
  /**
   * Set the maximum number of hits accessible via pagination.
   */
  paginationLimitedTo?: number;
  /**
   * Minimum number of characters a word in the query string must contain to accept matches with 1 typo.
   */
  minWordSizefor1Typo?: number;
  /**
   * Minimum number of characters a word in the query string must contain to accept matches with 2 typos.
   */
  minWordSizefor2Typos?: number;
  /**
   * Controls whether typo tolerance is enabled and how it is applied.
   */
  typoTolerance?: string | boolean;
  /**
   * Hether to allow typos on numbers (“numeric tokens”) in the query string.
   */
  allowTyposOnNumericTokens?: boolean;
  /**
   * List of attributes on which you want to disable typo tolerance.
   */
  disableTypoToleranceOnAttributes?: string[];
  /**
   * List of words on which you want to disable typo tolerance.
   */
  disableTypoToleranceOnWords?: string[];
  /**
   * Control which separators are indexed.
   */
  separatorsToIndex?: string;
  /**
   * Treats singular, plurals, and other forms of declensions as matching terms.
   */
  ignorePlurals?: string[] | boolean;
  /**
   * Sets the languages to be used by language-specific settings and functionalities such as ignorePlurals, removeStopWords, and CJK word-detection.
   */
  queryLanguages?: string[];
  /**
   * A list of language ISO code.
   */
  indexLanguages?: string[];
  /**
   * Whether rules should be globally enabled.
   */
  enableRules?: boolean;
  /**
   * Controls if and how query words are interpreted as prefixes.
   */
  queryType?: 'prefixLast' | 'prefixAll' | 'prefixNone';
  /**
   * Selects a strategy to remove words from the query when it doesn’t match any hits.
   */
  removeWordsIfNoResults?: 'none' | 'lastWords' | 'firstWords' | 'allOptional';
  /**
   * Enables the advanced query syntax.
   */
  advancedSyntax?: boolean;
  /**
   * AdvancedSyntaxFeatures can be exactPhrase or excludeWords.
   */
  advancedSyntaxFeatures?: Array<'exactPhrase' | 'excludeWords'>;
  /**
   * A list of words that should be considered as optional when found in the query.
   */
  optionalWords?: string[];
  /**
   * List of attributes on which you want to disable prefix matching.
   */
  disablePrefixOnAttributes?: string[];
  /**
   * List of attributes on which you want to disable the exact ranking criterion.
   */
  disableExactOnAttributes?: string[];
  /**
   * Controls how the exact ranking criterion is computed when the query contains only one word.
   */
  exactOnSingleWordQuery?: 'attribute' | 'none' | 'word';
  /**
   * List of alternatives that should be considered an exact match by the exact ranking criterion.
   */
  alternativesAsExact?: Array<
    'ignorePlurals' | 'singleWordSynonym' | 'multiWordsSynonym'
  >;
  /**
   * Removes stop (common) words from the query before executing it.
   */
  removeStopWords?: boolean | string[];
  /**
   * List of numeric attributes that can be used as numerical filters.
   */
  numericAttributesForFiltering?: string[];
  /**
   * Enables compression of large integer arrays.
   */
  allowCompressionOfIntegerArray?: boolean;
  /**
   * Name of the de-duplication attribute to be used with the distinct feature.
   */
  attributeForDistinct?: string;
  /**
   * Enables de-duplication or grouping of results.
   */
  distinct?: boolean | number;
  /**
   * Whether to highlight and snippet the original word that matches the synonym or the synonym itself.
   */
  replaceSynonymsInHighlight?: boolean;
  /**
   * Allows proximity to impact which searchable attribute is matched in the attribute ranking stage.
   */
  attributeCriteriaComputedByMinProximity?: boolean;
  /**
   * Precision of the proximity ranking criterion.
   */
  minProximity?: number;
  /**
   * Choose which fields the response will contain. Applies to search and browse queries.
   */
  responseFields?: string[];
  /**
   * Maximum number of facet hits to return during a search for facet values.
   */
  maxFacetHits?: number;
  /**
   * List of attributes on which to do a decomposition of camel case words.
   */
  camelCaseAttributes?: string[];
  /**
   * Specify on which attributes in your index Algolia should apply word-splitting (“decompounding”).
   */
  decompoundedAttributes?: Record<string, string[]>;
  /**
   * Characters that should not be automatically normalized by the search engine.
   */
  keepDiacriticsOnCharacters?: string;
  /**
   * Overrides Algolia's default normalization.
   */
  customNormalization?: Record<string, Record<string, string>>;
  /**
   * Custom userData that could be added to the Settings.
   */
  userData?: any;
}
