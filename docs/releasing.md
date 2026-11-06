# Publishing and hosting

## Storybook on GitHub Pages

In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. `Deploy Storybook` builds and tests the library, uploads the static output, and deploys to:

https://ankurlittleraj.github.io/lil-toolkit/

No paid hosting service is needed. The workflow uses `pages:write` and OIDC only in the deployment job. Fork pull requests cannot deploy.

## Versioned packages

1. Bump the workspace version and all four package versions together. Update wrapper core dependency versions too.
2. Run `npm install --package-lock-only`, `npm run check`, `npm run release:check`, and `npm run pack`.
3. Commit, then create a matching `v0.1.0` tag (or the new version).
4. `Publish public packages` validates and publishes the core before its wrappers.

The tag must match the version. Manual workflow dispatch must select the version tag, not `main`. A failed partial release may leave immutable versions published; inspect registries before retrying and bump the version when required. The workflow never unpublishes a version.

### GitHub Packages

Publishing uses the repository `GITHUB_TOKEN`; no personal token needs to be stored. On the first publish GitHub creates **private** packages by default. Open each package’s settings and change visibility to **Public**. The `--access public` npm flag alone does not guarantee GitHub visibility.

Consumers of the GitHub npm registry must authenticate with `read:packages`, even when a package is public. Keep credentials in a user-level npm config or an environment secret; never commit them.

### npmjs.org

Scope confirmed by the owner: `@ankurlittleraj`.

For the first publication, use a narrowly scoped npm automation credential stored as the repository Actions secret **NPM_TOKEN**, or publish the initial packages yourself with 2FA. Then enable trusted publishing for each package:

- Provider: GitHub Actions
- Owner: `AnkurLittleRaj`
- Repository: `lil-toolkit`
- Workflow filename: `release.yml`

After account ownership and authorization are ready, set the repository Actions variable **NPM_PUBLISH_ENABLED** to `true`. It remains off until then so GitHub releases do not fail because npm has not been connected. npm uses `--access public` and provenance. The workflow supports OIDC after trusted publishing has been configured.

Never paste an npm token into chat or a source file. Add it directly in GitHub’s secret UI if bootstrap credentials are needed.

## Free-plan boundaries

- Stencil, Storybook and the source library are open-source tooling.
- GitHub Pages is available for public repositories on GitHub Free.
- npm public packages do not require a paid npm subscription.
- zeroheight Free provides one editor, one styleguide and one token set; do not depend on paid APIs, custom domains or Enterprise theme management.

Official references: [Stencil framework bindings](https://stenciljs.com/docs/overview), [GitHub Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages), [GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry), [npm trusted publishers](https://docs.npmjs.com/trusted-publishers/), [zeroheight pricing](https://zeroheight.com/pricing/).
