import Koa from "koa";
import koaConnect from "koa-connect";

import { readFileSync } from "fs";
import { resolve } from "path";
import { createServer } from "vite";

(async () => {
  const app = new Koa();

  const viteServer = await createServer({
    root: process.cwd(),
    logLevel: "error",
    server: {
      middlewareMode: true,
    },
  });

  app.use(koaConnect(viteServer.middlewares));

  app.use(async (ctx) => {
    try {
      let template = readFileSync(
        resolve(__dirname, "index.html"),
        "utf-8"
      );
      template = await viteServer.transformIndexHtml(ctx.path, template);
      const { render } = await viteServer.ssrLoadModule("/src/entry-server.ts");
      const { renderedHtml } = await render(ctx, {});
      const html = template.replace("<!--app-html-->", renderedHtml);
      ctx.type = "text/html";
      ctx.body = html;
    } catch (e) {
      viteServer && viteServer.ssrFixStacktrace(e);
      console.log(e.stack);
      ctx.throw(500, e.stack);
    }
  });

  app.listen(9000, () => {
    console.log("server is listening in 9000");
  });
})();
