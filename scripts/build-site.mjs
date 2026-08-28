import { cp, mkdir, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const codeRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const publicRoot = path.join(codeRoot, 'public');
const distRoot = path.join(codeRoot, 'dist');
const staticRoot = path.join(distRoot, 'static');

await rm(distRoot, { recursive: true, force: true });
await mkdir(path.join(distRoot, 'server'), { recursive: true });
await mkdir(staticRoot, { recursive: true });

await cp(path.join(publicRoot, '代码'), staticRoot, { recursive: true });
await cp(path.join(publicRoot, '素材'), path.join(staticRoot, '素材'), { recursive: true });

const worker = `const assetRequest = (request, pathname) => {
  const url = new URL(request.url);
  url.pathname = pathname;
  return new Request(url, request);
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const pathname = url.pathname === '/' ? '/index.html' : url.pathname;
    let response = await env.ASSETS.fetch(assetRequest(request, pathname));

    if (response.status === 404 && pathname.endsWith('/')) {
      response = await env.ASSETS.fetch(assetRequest(request, pathname + 'index.html'));
    }

    return response;
  },
};
`;

await writeFile(path.join(distRoot, 'server', 'index.js'), worker);
console.log('[build-site] generated Cloudflare Worker entrypoint and static assets');
