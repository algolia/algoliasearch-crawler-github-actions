
<img alt="Algolia Crawler Github Action"  src="/cover.jpg" width="100%"/>

[![CircleCI](https://circleci.com/gh/algolia/algoliasearch-crawler-github-actions/tree/main.svg?style=svg)](https://circleci.com/gh/algolia/algoliasearch-crawler-github-actions/tree/main)

# Algolia Crawler Github Action

Automatically index your website to Algolia when deploying your website with the Algolia Crawler.
**IMPORTANT**: This Github Action is **only available for Algolia users with Crawler Public API access**.

- [What is Algolia?](https://www.algolia.com/doc/guides/getting-started/what-is-algolia/)
- [What is Algolia's Crawler?](https://www.algolia.com/doc/tools/crawler/getting-started/overview/)

## Platforms support

It should be compatible with **any hosts** as long as you provide the correct `site-url`.
On top of that, it has been tested with the following platforms:

- Github Pages
- Microsoft Azure
- Netlify
- Vercel

## How to add this Github Action to your workflow ?

On your repository:

- Create a Github Workflow file `.github/workflows/[FILENAME].yml`.
- Add a new job after your website deployment. For the Crawler to work, it needs an up and running website.

```yaml
  - name: Algolia crawler creation and crawl
    uses: algolia/algoliasearch-crawler-github-actions@v1.0.10
    id: algolia_crawler
    with: # mandatory parameters
      crawler-user-id: ${{ secrets.CRAWLER_USER_ID }}
      crawler-api-key: ${{ secrets.CRAWLER_API_KEY }}
      algolia-app-id: ${{ secrets.ALGOLIA_APP_ID }}
      algolia-api-key: ${{ secrets.ALGOLIA_API_KEY }}
      site-url: 'https://example.com'
```

## Example

- [Basic](/examples/basic.yml)
- [Github Pages](/examples/github_pages.yml)
- [Netlify](/examples/netlify.yml)
- Vercel: [PR](/examples/vercel_pr.yml), [Main branch](/examples/vercel_push.yml)

## Parameters to provide

### Mandatory parameters

- `crawler-user-id`

  User Id of your crawler account
- `crawler-api-key`

  Api Key of your crawler account
- `algolia-app-id`

  Algolia Application ID
- `algolia-api-key`

  Algolia API Key
- `site-url`

  URL of the website to crawl

### Optional parameters

- `crawler-api-base-url`

  Base URL of the crawler, default: [https://crawler.algolia.com/api/1/](https://crawler.algolia.com/api/1/)
- `crawler-name`

  Name of the created crawler, default: `'[Github] ${{ github.repository }} ${{ github.ref }}'`
- `override-config`

  Boolean to define if you want your crawler config to be overriden or not, default: `false`
- `github-token`

  Needed for adding comments to PR, default: Github Action `${{ github.token }}` variable

## Github secrets on your repository

We highly recommend not to define sensitive information such as Algolia and/or Crawler credentials directly in the YAML file and to **use Github secrets** (defined in Settings > Secrets).

### Recommended

- `ALGOLIA_API_KEY`

  Algolia Application ID
- `ALGOLIA_APP_ID`

  Algolia API Key
- `CRAWLER_API_KEY`

  Api Key of your crawler account
- `CRAWLER_USER_ID`

  User Id of your crawler account

## Troubleshooting

- Need help? We have you covered in our [Discourse forum](https://discourse.algolia.com/)
- Found a bug in the plugin? Please read our [contributing guide](/CONTRIBUTING.md) and either open an [issue](https://github.com/algolia/algoliasearch-crawler-github-actions/issues) or a [pull request](https://github.com/algolia/algoliasearch-crawler-github-actions/pulls)
- Can't find the answer to your issue? Please reach out to the [Algolia Support Team](https://alg.li/support).

## Development & Release

See [CONTRIBUTING.md](./CONTRIBUTING.md).
