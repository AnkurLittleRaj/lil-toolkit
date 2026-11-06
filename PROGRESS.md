# Build progress

**Current publication policy: GitHub Packages only.** No npmjs.org package was published. The npm attempt was rejected, and the owner then canceled npm publishing. npm remains the build/install CLI. Historical references to dual-registry setup below are superseded by this policy.

## Checkpoint 1 — 6 November 2026

- Public repository created: `AnkurLittleRaj/lil-toolkit`.
- MIT license approved by Ankur.
- npm namespace confirmed: `@ankurlittleraj`.
- 20 Stencil components and generated React, Vue and standalone Angular packages implemented.
- Original Figma tokens recovered; light/dark CSS and one DTCG token set generated.
- Four packages compile. Storybook static build passes. Ten token/package tests pass.
- Dependency audit: zero reported vulnerabilities after a targeted minimatch override.
- Storybook Pages deployment and dual-registry release workflows prepared.
- zeroheight login completed; styleguide creation in progress.

Remaining: browser behavior/accessibility tests and fixes, packaged consumer checks, Pages deployment, registry authentication and publication, GitHub package visibility, zeroheight content and embeds. No package release or hosted documentation is claimed complete at this checkpoint.

## Checkpoint 2

- All four packages compile; ten token/package checks and fourteen browser tests pass.
- React and Vue generated bindings verified for model updates in the browser.
- Both themes checked at 390px and 1280px with automated axe accessibility checks.
- Angular artifact corrected and all four tarballs checked for runtime files.
- Public source formatted and package/release documentation added.
- GitHub Pages configured for Actions deployment.
- zeroheight styleguide created with Inter, indigo-violet branding and “By Ankur” cover content.

Remaining: verify remote CI and Pages, publish version 0.1.0 to registries, finish zeroheight pages/embeds and public sharing.

## Checkpoint 3

- Removed the npmjs.org publishing job, command, credentials and account-setup instructions at the owner's request.
- All package publishConfig entries now explicitly target https://npm.pkg.github.com.
- Updated README, package READMEs, Storybook, release guidance and zeroheight installation documentation for GitHub-only distribution.
- Added registry mapping and GitHub authentication steps for consumers.
- Completed zeroheight welcome, principles, installation, color, typography, spacing, tokens, component and SaaS-pattern guidance.
