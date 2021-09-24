# Algolia Crawler Github Action

**IMPORTANT**: This Github Action is currently in Beta and only available for selected Algolia customers.

## Compatibility with platforms

It should be compatible with any hosts as long as you provide the correct `site-url`.
On top of that, it has been tested with the following platforms:

- Github Pages
- Microsoft Azure
- Netlify
- Vercel

## How to add this Github Action to your workflow ?

On your repository:

- Create a (About [Github Actions](https://docs.github.com/en/actions)) workflow file `.github/workflows/[FILENAME].yml`.
- Add a new job after your website deployment
  For the Crawler to work, it needs an up and running website.

```yaml
  - name: Algolia crawler creation and crawl
    uses: ./
    id: algolia_crawler
    with: # mandatory parameters
      crawler-user-id: ${{ secrets.CRAWLER_USER_ID }}
      crawler-api-key: ${{ secrets.CRAWLER_API_KEY }}
      algolia-app-id: ${{ secrets.ALGOLIA_APP_ID }}
      algolia-api-key: ${{ secrets.ALGOLIA_API_KEY }}
      site-url: 'https://crawler.algolia.com/test-website/'
```

## Example

```yaml
name: Algolia Recrawl Example

on:
  push:
    branches: [ main ]
  pull_request:
    types: ['opened', 'edited', 'reopened', 'synchronize']

jobs:
  algolia_crawl:
    name: Algolia Recrawl
    runs-on: ubuntu-latest
    steps:
      # checkout this repo
      - name: Checkout Repo
        uses: actions/checkout@v2
      # checkout the private repo containing the action to run
      - name: Checkout GitHub Action Repo
        uses: actions/checkout@v2
        with:
          repository: algolia/algoliasearch-crawler-github-actions
          ref: v0.8.0 # version of the release you want to use
      - name: Algolia crawler creation and crawl
        uses: ./
        id: algolia_crawler
        with: # mandatory parameters
          crawler-user-id: ${{ secrets.CRAWLER_USER_ID }}
          crawler-api-key: ${{ secrets.CRAWLER_API_KEY }}
          algolia-app-id: ${{ secrets.ALGOLIA_APP_ID }}
          algolia-api-key: ${{ secrets.ALGOLIA_API_KEY }}
          site-url: 'https://crawler.algolia.com/test-website/'
```

- [Github Pages](/.github/workflows/github_pages.yml)
- [Netlify](/.github/workflows/netlify.yml)
- [Vercel PR](/other_workflow_examples/vercel_pr.yml) [Vercel Main branch](/other_workflow_examples/vercel_push.yml)

## Parameters to provide

### Mandatory parameters

- `crawler-user-id`
  User Id of your crawler account
- `crawler-api-key`
  Api Key of your crawner account
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

### See example above

- `ALGOLIA_API_KEY`: Algolia Application ID
- `ALGOLIA_APP_ID`: Algolia API Key
- `CRAWLER_API_KEY`: Api Key of your crawler account
- `CRAWLER_USER_ID`: User Id of your crawler account
