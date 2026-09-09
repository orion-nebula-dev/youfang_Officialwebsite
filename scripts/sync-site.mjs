import { createReadStream, createWriteStream } from 'node:fs';
import { access, cp, mkdir, readdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
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
const runtimeAssetDirectories = ['logo', 'photo', 'qr', 'screen', 'visual', 'video'];
const chunkedVideos = ['lingshu-2.0.mp4', 'promo-3min.mp4'];

const assembleChunkedVideo = async (filename) => {
  const partsDirectory = path.join(codeRoot, 'video-parts', filename);
  const hasParts = await access(partsDirectory).then(() => true).catch(() => false);
  if (!hasParts) return false;

  const parts = (await readdir(partsDirectory, { withFileTypes: true }))
    .filter((entry) => entry.isFile() && entry.name.endsWith('.part'))
    .sort((left, right) => left.name.localeCompare(right.name, undefined, { numeric: true }));
  if (!parts.length) throw new Error(`[sync-site] no video parts found for ${filename}`);

  const target = path.join(publicAssets, 'video', filename);
  await mkdir(path.dirname(target), { recursive: true });
  const output = createWriteStream(target);
  const finished = new Promise((resolve, reject) => {
    output.once('finish', resolve);
    output.once('error', reject);
  });

  try {
    for (const part of parts) {
      await pipeline(createReadStream(path.join(partsDirectory, part.name)), output, { end: false });
    }
    output.end();
    await finished;
  } catch (error) {
    output.destroy();
    throw error;
  }

  return true;
};

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

for (const filename of chunkedVideos) {
  await assembleChunkedVideo(filename);
}

console.log(
  `[sync-site] synced ${runtimeCodeDirectories.length} code directories and ${runtimeAssetDirectories.length} asset directories${hasExternalAssets ? '' : ' from bundled runtime assets'}`,
);
