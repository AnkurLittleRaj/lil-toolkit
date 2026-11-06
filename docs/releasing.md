# Publishing and hosting

## Storybook on GitHub Pages

In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. `Deploy Storybook` builds and tests the library, uploads the static output, and deploys to:

https://ankurlittleraj.github.io/lil-toolkit/

No paid hosting service is needed. The workflow uses `pages:write` and OIDC only in the deployment job. Fork pull requests cannot deploy.

## Versioned packages

1. Bump the workspace version and all four package versions together. Update wrapper core dependency versions too.
2. Run `npm install --package-lock-only`, `npm run check`, `npm run release:check`, and `npm run pack`.
3. Commit, then create a matching `v0.1.0` tag (or the new version).
4. `Publish GitHub packages` validates and publishes the core before its wrappers.

The tag must match the version. Manual workflow dispatch must select the version tag, not `main`. A failed partial release may leave immutable versions published; inspect registries before retrying and bump the version when required. The workflow never unpublishes a version.

### GitHub Packages

Publishing uses the repository `GITHUB_TOKEN`; no personal token needs to be stored. On the first publish GitHub creates **private** packages by default. Open each package’s settings and change visibility to **Public**. The `--access public` npm flag alone does not guarantee GitHub visibility.

Consumers of the GitHub npm registry must authenticate with `read:packages`, even when a package is public. Keep credentials in a user-level npm config or an environment secret; never commit them.

## Registry policy

All four packages publish only to GitHub Packages. npmjs.org publishing was explicitly removed at the owner’s request. No NPM_TOKEN or NPM_PUBLISH_ENABLED setting is needed. npm is the local CLI used to install, build and publish to the configured GitHub registry.

Consumers add `@ankurlittleraj:registry=https://npm.pkg.github.com` to their application’s `.npmrc`, then authenticate with `read:packages` using `npm login --scope=@ankurlittleraj --auth-type=legacy --registry=https://npm.pkg.github.com`. Do not commit credentials.

## Free-plan boundaries

- Stencil, Storybook and the source library are open-source tooling.
- GitHub Pages is available for public repositories on GitHub Free.
- zeroheight Free provides one editor, one styleguide and one token set; do not depend on paid APIs, custom domains or Enterprise theme management.

Official references: [Stencil framework bindings](https://stenciljs.com/docs/overview), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), [zeroheight pricing](https://zeroheight.com/pricing/).
