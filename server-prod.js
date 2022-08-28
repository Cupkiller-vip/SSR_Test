import Koa from "koa";
import sendFile from "koa-send";
import { fileURLToPath } from "node:url";
import { resolve as _resolve } from "path";
import { readFileSync } from "fs";
import { render } from "./dist/server/server.js";
import path from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const resolve = (p) => _resolve(__dirname, p);

const clientRoot = resolve("dist/client");
const template = readFileSync(resolve("dist/client/index.html"), "utf-8");
const manifest = JSON.parse(
  readFileSync(resolve("./dist/client/ssr-manifest.json"), "utf-8")
);

(async () => {
  const app = new Koa();
  app.use(async (ctx) => {
    if (ctx.path.startsWith("/assets")) {
      await sendFile(ctx, ctx.path, { root: clientRoot });
      return;
    }
    const [appHtml, preloadLinks] = await render(ctx, manifest);
    const html = template
      .replace("<!--preload-links-->", preloadLinks)
      .replace("<!--app-html-->", appHtml);
    ctx.type = "text/html";
    ctx.body = html;
  });

  app.listen(8000, () =>
    console.log("started server on http://localhost:8000")
  );
})();
