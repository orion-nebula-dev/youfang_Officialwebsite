import { cp, mkdir, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const codeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(codeRoot, 'public');
const distRoot = path.join(codeRoot, 'dist');
const staticRoot = path.join(distRoot, 'client');

await rm(distRoot, { recursive: true, force: true });
await mkdir(path.join(distRoot, 'server'), { recursive: true });
await mkdir(staticRoot, { recursive: true });

await cp(path.join(publicRoot, '代码'), staticRoot, { recursive: true });
await cp(path.join(publicRoot, '素材'), path.join(staticRoot, '素材'), { recursive: true });

await cp(path.join(codeRoot, 'server', 'index.js'), path.join(distRoot, 'server', 'index.js'));
console.log('[build-site] generated Cloudflare Worker entrypoint and static assets');
