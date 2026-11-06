import { execFileSync } from 'node:child_process';
import fs from 'node:fs/promises';
await fs.mkdir('artifacts',{recursive:true});
for(const name of ['core','react','vue','angular'])execFileSync('npm',['pack',name==='angular'?'./packages/angular/dist':`./packages/${name}`,'--pack-destination','artifacts'],{stdio:'inherit'});
