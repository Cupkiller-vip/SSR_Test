import Koa from "koa";
import koaConnect from "koa-connect";

import fs from "fs";
import path from "path";
import { createServer } from "vite";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
(async () => {
  const app = new Koa();
  const viteServer = await createServer({
    root: process.cwd(),
    logLevel: "error",
    server: {
      middlewareMode: true,
    },
    appType: "custom",
  });

  app.use(koaConnect(viteServer.middlewares));
  try {
    app.use(async (ctx) => {
      let template = fs.readFileSync(
        path.resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await viteServer.transformIndexHtml(ctx.path, template);
      const { render } = await viteServer.ssrLoadModule("/src/server.ts");
      const [renderedHtml] = await render(ctx, {});
      const html = template.replace("<!--app-html-->", renderedHtml);
      ctx.type = "text/html";
      ctx.body = html;
    });
  } catch (e) {
    viteServer.ssrFixStacktrace(e);
  }

  app.listen(9000, () => {
    console.log("server is listening in http://localhost:9000");
  });
})();
