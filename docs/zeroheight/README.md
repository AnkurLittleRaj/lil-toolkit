# Little Design System in zeroheight Free

**By Ankur**

The repository supplies the documentation content; zeroheight is the editorial presentation layer. Storybook remains the live component reference. Do not enable a paid plan or depend on the paid API.

## One styleguide

Create a styleguide named **Little Design System**, with **By Ankur** on its cover. Set the accent to `#6941D9` and use the following page outline:

1. Welcome — purpose, principles and links
2. Foundations — color, typography, spacing, accessibility and responsive rules
3. Components — usage guidance and embedded Storybook stories
4. Patterns — SaaS data surfaces
5. Getting started — JavaScript, React, Angular and Vue
6. Contributing and releases

Public guide: https://zeroheight.com/75c403f45

Content is in `welcome.md`, `foundations.md`, `components.md` and the repository README. Keep a single token set by uploading `tokens/zeroheight.json`; its named light/dark groups contain both themes. The import file uses the second editor draft dimension format accepted by zeroheight; `tokens/tokens.json` retains structured dimensions for code. This is not zeroheight Enterprise multi-theme support.

All four code packages are distributed only through GitHub Packages, not npmjs.org. Installation requires `@ankurlittleraj:registry=https://npm.pkg.github.com` in the consumer's `.npmrc` and GitHub authentication with `read:packages`. npm is the CLI, not the publication destination. The release workflow uses GITHUB_TOKEN and does not use an npmjs.org credential.

## Connect the source

- Figma: https://www.figma.com/design/mjE6UWIjTk1zkJ0F0uonGD
- Storybook: https://ankurlittleraj.github.io/lil-toolkit/
- Repository: https://github.com/AnkurLittleRaj/lil-toolkit

Embed live examples with Storybook iframe URLs, for example:

`https://ankurlittleraj.github.io/lil-toolkit/iframe.html?id=components-button--primary&viewMode=story`

`https://ankurlittleraj.github.io/lil-toolkit/iframe.html?id=examples-saas--dashboard&viewMode=story`

`https://ankurlittleraj.github.io/lil-toolkit/iframe.html?id=examples-saas--settings&viewMode=story`

Do not mark this setup complete until the styleguide exists in the owner’s zeroheight account and the links/embeds work. A prepared Markdown folder is not a published zeroheight site.
