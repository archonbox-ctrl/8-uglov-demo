import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { readFile } from "node:fs/promises";
import { defineConfig } from "vite";
import { editorialIndex } from "./client/src/editorialIndex";
import { catalogPaths } from "./client/src/catalogData";
import { normalizeBasePath, withoutBasePath } from "./shared/basePath";

const base = normalizeBasePath(process.env.VITE_BASE_PATH);
const validPreviewPaths = new Set(["/", "/o-kompanii/", ...editorialIndex.map((page) => page.route), ...catalogPaths].map((route) => route.replace(/\/$/, "") || "/"));
const realPreview404 = () => ({
  name: "real-preview-404",
  configureServer(server: import("vite").ViteDevServer) {
    server.middlewares.use(async (request, response, next) => {
      const accept = request.headers.accept || "";
      const pathname = withoutBasePath(new URL(request.url || "/", "http://localhost").pathname, base);
      const normalized = pathname.replace(/\/$/, "") || "/";
      if (request.method !== "GET" || !accept.includes("text/html") || pathname.startsWith("/@") || pathname.startsWith("/src/") || pathname.includes(".") || validPreviewPaths.has(normalized)) return next();
      try {
        const source = await readFile(path.resolve(import.meta.dirname, "client/index.html"), "utf8");
        const html = await server.transformIndexHtml(request.url || "/", source);
        response.statusCode = 404;
        response.setHeader("Content-Type", "text/html; charset=utf-8");
        response.end(html);
      } catch (error) { next(error); }
    });
  },
});

// The first review is static and does not collect interaction telemetry.
export default defineConfig({
  base,
  plugins: [react(), tailwindcss(), realPreview404()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  envDir: path.resolve(import.meta.dirname),
  root: path.resolve(import.meta.dirname, "client"),
  publicDir: path.resolve(import.meta.dirname, "client", "public"),
  build: { outDir: path.resolve(import.meta.dirname, "dist/public"), emptyOutDir: true },
  server: {
    host: true,
    allowedHosts: [".manuspre.computer", ".manus.computer", ".manus-asia.computer", ".manuscomputer.ai", ".manusvm.computer", "localhost", "127.0.0.1"],
    fs: { strict: true, deny: ["**/.*"] },
  },
});
