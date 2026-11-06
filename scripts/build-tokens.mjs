import fs from 'node:fs/promises';
const {palette,semantic,spacing,radius,typography}=JSON.parse(await fs.readFile(new URL('../tokens/source.json',import.meta.url),'utf8'));
const cssName=n=>'--lil-'+n.replaceAll('/','-');
const colorTokens=Object.entries(palette).map(([k,v])=>`  ${cssName(k)}: #${v};`).join('\n');
const modes=theme=>Object.entries(semantic).map(([k,values])=>`  ${cssName(k)}: var(${cssName(values[theme==='dark'?1:0])});`).join('\n');
const dimensions=[...spacing.map(n=>`  --lil-space-${n}: ${n}px;`),...radius.map(n=>`  --lil-radius-${n}: ${n}px;`),'  --lil-font-family: "Inter", ui-sans-serif, system-ui, sans-serif;','  --lil-control-sm: 36px;','  --lil-control-md: 44px;','  --lil-control-lg: 48px;','  --lil-sidebar-width: 232px;'].join('\n');
const css=`/* Generated from tokens/source.json. Do not edit. */\n:root, :host {\n${colorTokens}\n${dimensions}\n${modes('light')}\n  color-scheme: light;\n}\n[data-lil-theme="dark"] {\n${modes('dark')}\n  color-scheme: dark;\n}\n[data-lil-theme="light"] {\n${modes('light')}\n  color-scheme: light;\n}\n@media (prefers-color-scheme: dark) {\n  :root:not([data-lil-theme]) {\n${modes('dark')}\n    color-scheme: dark;\n  }\n}\n`;
await fs.mkdir('packages/core/src/fonts',{recursive:true});
const dtcg={};
function token(path,type,value){let o=dtcg;const p=path.split('/');for(const n of p.slice(0,-1))o=o[n]??={};o[p.at(-1)]={$type:type,$value:value};}
for(const [name,value]of Object.entries(palette))token('primitive/'+name,'color','#'+value);
for(const [name,values]of Object.entries(semantic))for(const [i,mode]of ['light','dark'].entries())token(mode+'/'+name,'color','{primitive.'+values[i].replaceAll('/','.')+'}');
for(const n of spacing)token('spacing/'+n,'dimension',{value:n,unit:'px'});
for(const n of radius)token('radius/'+n,'dimension',{value:n,unit:'px'});
for(const [name,t]of Object.entries(typography))token('typography/'+name,'typography',{fontFamily:'Inter',fontSize:{value:t.size,unit:'px'},fontWeight:t.weight,lineHeight:t.line/t.size,letterSpacing:{value:0,unit:'px'}});
await fs.writeFile('packages/core/src/tokens.css',css);await fs.writeFile('tokens/tokens.json',JSON.stringify(dtcg,null,2)+'\n');await fs.writeFile('packages/core/src/tokens.json',JSON.stringify(dtcg,null,2)+'\n');
let fonts='/* Inter, SIL Open Font License 1.1. Self-hosted; no tracking or remote requests. */\n';
for(const weight of [400,500,600]){const name=`inter-latin-${weight}-normal.woff2`;await fs.copyFile('node_modules/@fontsource/inter/files/'+name,'packages/core/src/fonts/'+name);fonts+=`@font-face { font-family: Inter; font-style: normal; font-weight: ${weight}; font-display: swap; src: url('./fonts/${name}') format('woff2'); }\n`;}
await fs.copyFile('node_modules/@fontsource/inter/LICENSE','packages/core/src/fonts/OFL.txt');await fs.writeFile('packages/core/src/fonts.css',fonts);
console.log(`Generated ${Object.keys(palette).length} primitive colors, ${Object.keys(semantic).length} semantic pairs and layout tokens.`);
