import express from "express";
import { renderPage } from "vike/server";
import { IS_DEV } from "./lib/consts";

async function createServer() {
  const app = express();
  const root = process.cwd();

  if (IS_DEV) {
    // start vite development server
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      root,
      server: { middlewareMode: true },
      appType: "custom",
    });

    app.use(vite.middlewares);
  } else {
    // serve client assets
    app.use(express.static(root + "/dist/client"));
  }

  app.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    const pageContext = {};
    const ctx = await renderPage({ urlOriginal: url, ...pageContext });

    const { httpResponse } = ctx;
    if (!httpResponse) {
      return next();
    }

    const { body, statusCode, headers, earlyHints } = httpResponse;
    if (res.writeEarlyHints) {
      res.writeEarlyHints({ link: earlyHints.map((e) => e.earlyHintLink) });
    }

    headers.forEach(([name, value]) => res.setHeader(name, value));
    res.status(statusCode).send(body);
  });

  const host = process.env.HOST || "127.0.0.1";
  const port = Number(process.env.PORT) || 3000;

  app.listen(port, host, () => {
    console.log(`Server listening on http://${host}:${port}`);
  });
}

createServer();
