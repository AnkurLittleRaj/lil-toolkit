import fs from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
const mode=process.argv[2];
const root=JSON.parse(await fs.readFile('package.json','utf8'));
const version=root.version;
const tag=process.env.GITHUB_REF_NAME;
if(mode!=='check'&&tag!==`v${version}`)throw Error(`Release tag ${tag} must equal v${version}`);
const packages=['core','react','vue','angular'];
for(const folder of packages){
 const path=`packages/${folder}${folder==='angular'?'/dist':''}`;
 const pkg=JSON.parse(await fs.readFile(`${path}/package.json`,'utf8'));
 if(pkg.version!==version)throw Error(`${pkg.name}: version mismatch`);
 if(pkg.private)throw Error(`${pkg.name} is private`);
 if(pkg.license!=='MIT')throw Error(`${pkg.name}: expected approved MIT license`);
 if(mode==='check')continue;
 const registry=mode==='github'?'https://npm.pkg.github.com':'https://registry.npmjs.org';
 // Registry is selected explicitly. No credential is written into the repository.
 execFileSync('npm',['publish',path,'--access','public','--registry',registry,...(mode==='npm'?['--provenance']:[])],{stdio:'inherit'});
}
console.log(mode==='check'?'Release versions and license are consistent.':`Published ${packages.length} packages to ${mode}.`);
