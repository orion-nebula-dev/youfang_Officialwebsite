import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { dirname, extname, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const codeRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = resolve(codeRoot, "public");
const host = process.env.HOST || "127.0.0.1";
const port = Number(process.env.PORT || 3000);

const contentTypes = {
  ".css": "text/css; charset=utf-8",
  ".gif": "image/gif",
  ".html": "text/html; charset=utf-8",
  ".ico": "image/x-icon",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml; charset=utf-8",
  ".webp": "image/webp",
};

function resolveRequestPath(requestUrl = "/") {
  const pathname = decodeURIComponent(new URL(requestUrl, "http://localhost").pathname);
  const normalizedPath = pathname === "/" ? "/代码/index.html" : pathname;
  const filePath = resolve(publicRoot, `.${normalizedPath}`);

  if (filePath !== publicRoot && !filePath.startsWith(`${publicRoot}${sep}`)) {
    return null;
  }

  return filePath;
}

const server = createServer(async (request, response) => {
  try {
    let filePath = resolveRequestPath(request.url);
    if (!filePath) {
      response.writeHead(403).end("Forbidden");
      return;
    }

    let fileStat = await stat(filePath);
    if (fileStat.isDirectory()) {
      filePath = resolve(filePath, "index.html");
      fileStat = await stat(filePath);
    }

    if (!fileStat.isFile()) throw new Error("Not a file");

    response.writeHead(200, {
      "Content-Length": fileStat.size,
      "Content-Type": contentTypes[extname(filePath).toLowerCase()] || "application/octet-stream",
    });
    createReadStream(filePath).pipe(response);
  } catch {
    response.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" }).end("Not Found");
  }
});

server.listen(port, host, () => {
  console.log(`[serve-local] http://${host}:${port}`);
});
