import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const docs = path.join(root, "docs");
const serverDir = path.join(dist, "server");
const hostingDir = path.join(dist, ".openai");

fs.rmSync(dist, { recursive: true, force: true });
fs.rmSync(docs, { recursive: true, force: true });
fs.mkdirSync(serverDir, { recursive: true });
fs.mkdirSync(hostingDir, { recursive: true });
fs.mkdirSync(path.join(docs, "directions"), { recursive: true });

const readText = relativePath => fs.readFileSync(path.join(root, relativePath), "utf8");
const hub = readText("prototype/index.html")
  .replace('href="../index.html"', 'href="/directions/"')
  .replace('href="../白名单电销系统_PRD_v1.0.md"', 'href="/白名单电销系统_PRD_v1.0.md"');
const chooser = readText("index.html").replace('href="prototype/index.html"', 'href="/"');
const pagesHub = readText("prototype/index.html")
  .replace('href="../index.html"', 'href="directions/index.html"')
  .replace('href="../白名单电销系统_PRD_v1.0.md"', 'href="白名单电销系统_PRD_v1.0.md"');
const pagesChooser = readText("index.html").replace('href="prototype/index.html"', 'href="../index.html"');

const writeDoc = (relativePath, body) => {
  const output = path.join(docs, relativePath);
  fs.mkdirSync(path.dirname(output), { recursive: true });
  fs.writeFileSync(output, body);
};

writeDoc("index.html", pagesHub);
writeDoc("angola-app.html", readText("prototype/angola-app.html"));
writeDoc("angola-app-zh.html", readText("prototype/angola-app.html"));
writeDoc("bangladesh-web.html", readText("prototype/bangladesh-web.html"));
writeDoc("bangladesh-web-zh.html", readText("prototype/bangladesh-web-zh.html"));
writeDoc("unified-admin.html", readText("prototype/unified-admin.html"));
writeDoc("白名单电销系统_PRD_v1.0.md", readText("白名单电销系统_PRD_v1.0.md"));
writeDoc("directions/index.html", pagesChooser);
for (const name of ["direction-a", "direction-b", "direction-c"]) {
  writeDoc(`directions/${name}.html`, readText(`${name}.html`));
  fs.copyFileSync(path.join(root, `${name}.png`), path.join(docs, "directions", `${name}.png`));
}
writeDoc(".nojekyll", "");

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
