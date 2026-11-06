import type { Config } from '@stencil/core';
import { reactOutputTarget } from '@stencil/react-output-target';
import { angularOutputTarget } from '@stencil/angular-output-target';
import { vueOutputTarget } from '@stencil/vue-output-target';

export const config: Config = {
  namespace: 'LilToolkit',
  globalStyle: 'src/global.css',
  sourceMap: true,
  outputTargets: [
    { type: 'dist', esmLoaderPath: '../loader', copy: [{ src: 'tokens.css', dest: 'tokens.css' }, { src: 'tokens.json', dest: 'tokens.json' }, { src: 'fonts.css', dest: 'fonts.css' }, { src: 'fonts', dest: 'fonts' }] },
    { type: 'dist-custom-elements', customElementsExportBehavior: 'single-export-module', externalRuntime: false, generateTypeDeclarations: true },
    { type: 'docs-custom-elements-manifest', file: 'custom-elements.json' },
    reactOutputTarget({ outDir: '../react/src/generated' }),
    angularOutputTarget({ componentCorePackage: '@ankurlittleraj/lil-toolkit', outputType: 'standalone', directivesProxyFile: '../angular/src/generated/components.ts', directivesArrayFile: '../angular/src/generated/index.ts', valueAccessorConfigs: [
      { elementSelectors: ['lil-input'], event: 'lilInput', targetAttr: 'value', type: 'text' },
      { elementSelectors: ['lil-checkbox', 'lil-switch'], event: 'lilChange', targetAttr: 'checked', type: 'boolean' }
    ] }),
    vueOutputTarget({ componentCorePackage: '@ankurlittleraj/lil-toolkit', proxiesFile: '../vue/src/generated/components.ts', includeImportCustomElements: true, includeDefineCustomElements: false, componentModels: [
      { elements: ['lil-input'], event: 'lilInput', targetAttr: 'value' },
      { elements: ['lil-checkbox', 'lil-switch'], event: 'lilChange', targetAttr: 'checked' }
    ] })
  ],
  testing: { browserHeadless: true }
};
