import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const serverDir = path.join(dist, "server");
const hostingDir = path.join(dist, ".openai");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(hostingDir, { recursive: true });

const readText = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");
const hub = readText("prototype/index.html")
  .replace('href="../index.html"', 'href="/directions/"')
  .replace('href="../白名单电销系统_PRD_v1.0.md"', 'href="/白名单电销系统_PRD_v1.0.md"');
const chooser = readText("index.html").replace('href="prototype/index.html"', 'href="/"');

const siteFiles = {
  "/": { body: hub, contentType: "text/html; charset=utf-8" },
  "/index.html": { body: hub, contentType: "text/html; charset=utf-8" },
  "/angola-app.html": { body: readText("prototype/angola-app.html"), contentType: "text/html; charset=utf-8" },
  "/angola-app-zh.html": { body: readText("prototype/angola-app.html"), contentType: "text/html; charset=utf-8" },
  "/bangladesh-web.html": { body: readText("prototype/bangladesh-web.html"), contentType: "text/html; charset=utf-8" },
  "/bangladesh-web-zh.html": { body: readText("prototype/bangladesh-web-zh.html"), contentType: "text/html; charset=utf-8" },
  "/unified-admin.html": { body: readText("prototype/unified-admin.html"), contentType: "text/html; charset=utf-8" },
  "/白名单电销系统_PRD_v1.0.md": { body: readText("白名单电销系统_PRD_v1.0.md"), contentType: "text/markdown; charset=utf-8" },
  "/directions/": { body: chooser, contentType: "text/html; charset=utf-8" },
  "/directions/index.html": { body: chooser, contentType: "text/html; charset=utf-8" },
  "/directions/direction-a.html": { body: readText("direction-a.html"), contentType: "text/html; charset=utf-8" },
  "/directions/direction-b.html": { body: readText("direction-b.html"), contentType: "text/html; charset=utf-8" },
  "/directions/direction-c.html": { body: readText("direction-c.html"), contentType: "text/html; charset=utf-8" }
};

fs.copyFileSync(path.join(root, ".openai", "hosting.json"), path.join(hostingDir, "hosting.json"));

const server = `const files = ${JSON.stringify(siteFiles)};

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const file = files[url.pathname];
    if (!file) {
      return new Response("Not found", {
        status: 404,
        headers: { "content-type": "text/plain; charset=utf-8" }
      });
    }
    return new Response(file.body, {
      headers: {
        "content-type": file.contentType,
        "cache-control": "public, max-age=300",
        "x-content-type-options": "nosniff"
      }
    });
  }
};
`;

fs.writeFileSync(path.join(serverDir, "index.js"), server);
