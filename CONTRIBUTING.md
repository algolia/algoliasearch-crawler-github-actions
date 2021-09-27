# Contributing

##  Commands

```sh
yarn test                       # runs tests within src/ directory
yarn build                      # builds the project
yarn clean                      # empties the dist/ directory
yarn lint                       # runs eslinter
yarn semantic-release           # runs semantic-release
yarn compile                    # compiles the index.js file with vercel/ncc
```

## Releasing

- Use a semantic commit
- CI will compile and commit the `build/` (you don't need to commit it)
- A release will be created but not published to the marketplace
- Go to Releases
- Edit the release and check "Publish this Action to the GitHub Marketplace"
- Save
