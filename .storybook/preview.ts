import type { Preview } from '@storybook/web-components-vite';
import { html } from 'lit';
import { defineCustomElements } from '../packages/core/dist/register.js';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import manifest from '../packages/core/custom-elements.json';
import '../packages/core/src/fonts.css';
import '../packages/core/src/tokens.css';
import '../stories/docs.css';
defineCustomElements();
setCustomElementsManifest(manifest);
const preview:Preview={
 globalTypes:{theme:{description:'Color theme',toolbar:{icon:'paintbrush',items:[{value:'light',title:'Light'},{value:'dark',title:'Dark'}],dynamicTitle:true}}},
 initialGlobals:{theme:'light'},
 decorators:[(story,context)=>{document.documentElement.dataset.lilTheme=context.globals.theme;return html`<div class="lil-story" data-lil-theme=${context.globals.theme}>${story()}</div>`;}],
 parameters:{layout:'padded',a11y:{test:'error'},options:{storySort:{order:['Welcome','Foundations','Components','Patterns','Examples','Integration']}},controls:{expanded:true}}
};
export default preview;
