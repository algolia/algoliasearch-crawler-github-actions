# Algolia Crawler Github action

## How to use

- On your repository, create a `.github/workflows/main.yml` file
- Add the following code when needed in your flow:

```yaml
on: [push]

jobs:
  algolia_reindex:
    name: Algolia Reindex
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
          ref: v0.4 # version of the release you want to use
          token: ${{ secrets.GIT_HUB_TOKEN }}
      - name: Algolia crawler creation and reindex
        uses: ./
        id: crawler
        with:
          crawler-user-id: ${{ secrets.CRAWLER_USER_ID }}
          crawler-api-key: ${{ secrets.CRAWLER_API_KEY }}
          crawler-api-base-url: 'https://crawler-dev.algolia.com/api/1/'
          crawler-name: ${{ github.repository }}-${{ github.ref }}
          algolia-app-id: ${{ secrets.ALGOLIA_APP_ID }}
          algolia-api-key: ${{ secrets.ALGOLIA_API_KEY }}
          site-url: 'https://crawler.algolia.com/test-website/'
```

- More for information about Github actions [here](https://docs.github.com/en/actions)

## Variables to provide
- `crawler-user-id`: User Id of your crawler account
- `crawler-api-key`: Api Key of your crawner account
- `crawler-api-base-url`: Base URL of the crawler (by default it's [https://crawler.algolia.com/api/1/](https://crawler.algolia.com/api/1/))
- `crawler-name`: Name of the created crawler 
- `algolia-app-id`: Algolia Application ID 
- `algolia-api-key`: Algolia API Key
- `site-url`: URL of the website to crawl

## Create the following Github secrets on your repository (in Settings > Secrets)
- `ALGOLIA_API_KEY`: Algolia Application ID 
- `ALGOLIA_APP_ID`: Algolia API Key
- `CRAWLER_API_KEY`: Api Key of your crawler account
- `CRAWLER_USER_ID`: User Id of your crawler account
- `GIT_HUB_TOKEN`: Github token (to use the action as long it's a private repository)