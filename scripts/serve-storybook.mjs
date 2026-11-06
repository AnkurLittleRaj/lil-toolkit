import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";
const root = path.resolve("storybook-static");
const mime = {
  ".html": "text/html",
  ".js": "application/javascript",
  ".css": "text/css",
  ".json": "application/json",
  ".woff2": "font/woff2",
  ".svg": "image/svg+xml",
  ".png": "image/png",
};
http
  .createServer(async (req, res) => {
    try {
      const pathname = decodeURIComponent(
        new URL(req.url, "http://localhost").pathname,
      );
      const file = path.resolve(
        root,
        "." + (pathname === "/" ? "/index.html" : pathname),
      );
      if (!file.startsWith(root + path.sep)) {
        res.writeHead(403);
        res.end();
        return;
      }
      const body = await fs.readFile(file);
      res.writeHead(200, {
        "Content-Type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(body);
    } catch {
      res.writeHead(404);
      res.end("Not found");
    }
  })
  .listen(6006, "127.0.0.1", () =>
    console.log("Storybook at http://127.0.0.1:6006"),
  );
