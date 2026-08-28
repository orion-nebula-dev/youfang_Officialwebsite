import { access, readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const codeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const siteRoot = path.resolve(codeRoot, '..');
const sourceCode = codeRoot;
const externalAssets = path.join(siteRoot, '素材');
const publicCode = path.join(codeRoot, 'public', '代码');
const publicAssets = path.join(codeRoot, 'public', '素材');
const hasExternalAssets = await access(externalAssets).then(() => true).catch(() => false);
const sourceAssets = hasExternalAssets ? externalAssets : publicAssets;
const activeAssetDirectories = ['logo', 'photo', 'qr', 'screen', 'visual'];
const failures = [];

const exists = async (target) => {
  try {
    await stat(target);
    return true;
  } catch {
    return false;
  }
};

const listFiles = async (directory, prefix = '') => {
  const results = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const relativePath = path.posix.join(prefix, entry.name);
    if (entry.isDirectory()) {
      results.push(...await listFiles(path.join(directory, entry.name), relativePath));
    } else {
      results.push(relativePath);
    }
  }
  return results;
};

const dataPath = path.join(sourceCode, 'js', 'data.js');
// 配置层（js/config/*.js）与 data.js 一起进入校验上下文，保证聚合字段可解析
const configDir = path.join(sourceCode, 'js', 'config');
const configSources = [];
for (const entry of await readdir(configDir, { withFileTypes: true })) {
  if (entry.isFile() && entry.name.endsWith('.js')) {
    configSources.push(await readFile(path.join(configDir, entry.name), 'utf8'));
  }
}
const dataSource = configSources.join('\n;\n') + '\n;\n' + await readFile(dataPath, 'utf8');
const sandbox = {};
vm.runInNewContext(`${dataSource}\n;globalThis.__SITE_DATA = SITE_DATA;`, sandbox, { filename: dataPath });
const siteData = sandbox.__SITE_DATA;
const registeredPaths = new Map();

for (const [id, record] of Object.entries(siteData.assets)) {
  if (!record || typeof record !== 'object') {
    failures.push(`${id}: registry entry must be an object`);
    continue;
  }
  for (const field of ['src', 'sourcePath', 'alt']) {
    if (typeof record[field] !== 'string' || !record[field].trim()) {
      failures.push(`${id}: missing ${field}`);
    }
  }
  if (typeof record.src !== 'string') continue;
  if (/^(?:https?:)?\/\//.test(record.src)) {
    failures.push(`${id}: remote asset URL is not allowed during local development`);
  }
  if (!await exists(path.join(sourceAssets, record.src))) {
    failures.push(`${id}: active asset missing at ${record.src}`);
  }
  if (typeof record.sourcePath === 'string' && !await exists(path.join(sourceAssets, record.sourcePath))) {
    failures.push(`${id}: source path missing at ${record.sourcePath}`);
  }
  if (registeredPaths.has(record.src)) {
    failures.push(`${id}: duplicates path registered by ${registeredPaths.get(record.src)}`);
  }
  registeredPaths.set(record.src, id);
}

const activeFiles = [];
for (const directory of activeAssetDirectories) {
  for (const file of await listFiles(path.join(sourceAssets, directory), directory)) {
    activeFiles.push(file);
  }
}
for (const file of activeFiles) {
  if (!registeredPaths.has(file)) failures.push(`unregistered active asset: ${file}`);
}

const runtimeFiles = (await listFiles(sourceCode)).filter(
  (file) => !file.startsWith('public/') && /\.(?:html|js|css)$/.test(file),
);
const referencedIds = new Set();
for (const file of runtimeFiles) {
  if (file === 'js/data.js') continue;
  const content = await readFile(path.join(sourceCode, file), 'utf8');
  for (const match of content.matchAll(/data-asset-(?:img|bg)=["']([^"']+)["']/g)) {
    if (/^[a-z0-9-]+$/.test(match[1])) referencedIds.add(match[1]);
  }
  for (const match of content.matchAll(/\basset\(["']([^"']+)["']\)/g)) referencedIds.add(match[1]);
  for (const match of content.matchAll(/\bbrandAsset\(["']([^"']+)["']\)/g)) referencedIds.add(match[1]);
  if (/(?:src|poster)=["']https?:\/\//.test(content) || /url\(["']?https?:\/\//.test(content)) {
    failures.push(`${file}: contains a remote image or media URL`);
  }
}

const collectAssetIds = (value, key = '') => {
  if (typeof value === 'string' && (key === 'image' || key === 'logo' || key === 'logoVertical' || key === 'screen' || key === 'id' || /AssetId$/i.test(key))) {
    if (value in siteData.assets) referencedIds.add(value);
  } else if (Array.isArray(value)) {
    value.forEach((item) => collectAssetIds(item, key));
  } else if (value && typeof value === 'object') {
    for (const [childKey, child] of Object.entries(value)) {
      if (childKey !== 'assets') collectAssetIds(child, childKey);
    }
  }
};
collectAssetIds(siteData);

for (const id of referencedIds) {
  if (!(id in siteData.assets)) failures.push(`unregistered referenced asset ID: ${id}`);
}
for (const id of Object.keys(siteData.assets)) {
  if (!referencedIds.has(id)) failures.push(`registered but unused asset ID: ${id}`);
}

for (const [relativePath, id] of registeredPaths) {
  if (!await exists(path.join(publicAssets, relativePath))) failures.push(`${id}: public asset missing after sync`);
}
for (const requiredFile of ['index.html', 'style.css', 'js/data.js', 'js/site.js', 'js/brand-detail.js']) {
  if (!await exists(path.join(publicCode, requiredFile))) failures.push(`public runtime file missing: ${requiredFile}`);
}

if (failures.length) {
  console.error(`[verify-assets] FAIL (${failures.length})`);
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`[verify-assets] PASS (${Object.keys(siteData.assets).length} registered local assets, ${runtimeFiles.length} runtime files)`);
