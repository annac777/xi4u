import {build,transform} from 'esbuild';
import {readFile,mkdir,writeFile,copyFile,rm} from 'node:fs/promises';
import {execFile} from 'node:child_process';
import {promisify} from 'node:util';
import {resolve} from 'node:path';

const run=promisify(execFile);
const outputRoot=resolve(process.env.OUTPUT_DIR || 'outputs/溪间四时');
const miniDir=resolve(outputRoot,'小红书工具包');
const miniZip=resolve(outputRoot,'溪间四时-小红书工具.zip');
const tracks=[
 'spring-rain-1.m4a','spring-rain-2.m4a',
 'cicada-veranda-1.m4a','cicada-veranda-2.m4a',
 'maple-room-1.m4a','maple-room-2.m4a',
];
const cssSource=(await readFile('app/globals.css','utf8'))
 .replace(/@import[^;]+;/g,'')
 .replace(/@theme inline\s*\{[^}]*\}/g,'')+
 '\n.season-tabs [data-slot="tabs-list"]{display:flex}.season-tabs{display:flex}.season-tabs [data-slot="tabs-trigger"]{border:0;background:none}.season-tabs [data-slot="tabs-trigger"][data-active]{background:#718d721d;color:var(--accent)}';

async function bundle(defines,target='es2022'){
 const result=await build({entryPoints:['scripts/offline-entry.tsx'],bundle:true,write:false,minify:true,format:'iife',platform:'browser',target,jsx:'automatic',define:{'process.env.NODE_ENV':'"production"',...defines},alias:{'@':process.cwd()},legalComments:'none'});
 return result.outputFiles[0].text.replace(/<\/script/gi,'<\\/script');
}

await mkdir(outputRoot,{recursive:true});
await mkdir(resolve(outputRoot,'music'),{recursive:true});
const standaloneJs=await bundle({'__MINITOOL__':'false'});
const standalone='<!doctype html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="theme-color" content="#dce8de"><meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover"><title>溪间四时 · Streamside Garden</title><style>'+cssSource+'</style></head><body><div id="root"></div><script>'+standaloneJs+'</script></body></html>';
await writeFile(resolve(outputRoot,'溪间四时.html'),standalone);
for(const track of tracks)await copyFile(resolve('public/music',track),resolve(outputRoot,'music',track));

await rm(miniDir,{recursive:true,force:true});
await rm(miniZip,{force:true});
await mkdir(resolve(miniDir,'assets'),{recursive:true});

const miniJs=await bundle({'__MINITOOL__':'true'},['es2017','chrome61']);
const miniCss=(await transform(cssSource,{loader:'css',minify:true,target:['chrome61']})).code;
const miniHtml='<!DOCTYPE html><html lang="zh-CN"><head><meta charset="UTF-8"><meta name="theme-color" content="#dce8de"><meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"><title>溪间四时</title><link rel="stylesheet" href="./assets/style.css"></head><body><div id="root"></div><script src="./assets/app.js"></script></body></html>';
await writeFile(resolve(miniDir,'index.html'),miniHtml);
await writeFile(resolve(miniDir,'assets/app.js'),miniJs);
await writeFile(resolve(miniDir,'assets/style.css'),miniCss);
await run('zip',['-q','-r',miniZip,'.'],{cwd:miniDir});
console.log(`Offline HTML written, ${(Buffer.byteLength(standalone)/1024/1024).toFixed(2)} MB.`);
console.log(`Mini tool zip written to ${miniZip}.`);
