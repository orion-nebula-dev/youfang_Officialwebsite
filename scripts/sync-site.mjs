import { access, cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const codeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = path.resolve(codeRoot, '..');
const sourceCode = codeRoot;
const externalAssets = path.join(siteRoot, '素材');
const publicCode = path.join(codeRoot, 'public', '代码');
const publicAssets = path.join(codeRoot, 'public', '素材');

const hasExternalAssets = await access(externalAssets).then(() => true).catch(() => false);
const sourceAssets = hasExternalAssets ? externalAssets : publicAssets;

const runtimeCodeDirectories = ['brands', 'js', 'mdzs', 'news_detail', 'video'];
const runtimeAssetDirectories = ['logo', 'photo', 'qr', 'screen', 'visual'];

await rm(publicCode, { recursive: true, force: true });
await mkdir(publicCode, { recursive: true });

if (hasExternalAssets) {
  await rm(publicAssets, { recursive: true, force: true });
  await mkdir(publicAssets, { recursive: true });
}

const codeEntries = await readdir(sourceCode, { withFileTypes: true });
for (const entry of codeEntries) {
  if (entry.isFile() && (entry.name.endsWith('.html') || entry.name === 'style.css')) {
    await cp(path.join(sourceCode, entry.name), path.join(publicCode, entry.name));
  }
}

for (const directory of runtimeCodeDirectories) {
  await cp(path.join(sourceCode, directory), path.join(publicCode, directory), { recursive: true });
}

if (hasExternalAssets) {
  for (const directory of runtimeAssetDirectories) {
    await cp(path.join(sourceAssets, directory), path.join(publicAssets, directory), { recursive: true });
  }
}

console.log(
  `[sync-site] synced ${runtimeCodeDirectories.length} code directories and ${runtimeAssetDirectories.length} asset directories${hasExternalAssets ? '' : ' from bundled runtime assets'}`,
);
