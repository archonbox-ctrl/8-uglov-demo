import { readFile, mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import React from "react";
import { renderToString } from "react-dom/server";
import { createServer } from "vite";
import { normalizeBasePath, withBasePath } from "../shared/basePath";

const root = process.cwd();
const output = path.join(root, "dist/public");
const base = normalizeBasePath(process.env.VITE_BASE_PATH);
const manifest = JSON.parse(await readFile(path.join(root, "client/public/manus-routes.json"), "utf8")) as { routes: { path: string; title?: string }[] };
const original = await readFile(path.join(output, "index.html"), "utf8");
const html = (value: string) => value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// The public host is not yet approved. No canonical or absolute share URL is guessed.
// Until legal and rights checks are complete every generated page remains noindex.
const browser = {
  location: { pathname: "/", search: "", hash: "" },
  matchMedia: () => ({ matches: true, addEventListener() {}, removeEventListener() {} }),
};
Object.defineProperty(globalThis, "window", { value: browser, writable: true, configurable: true });

const vite = await createServer({ configFile: path.join(root, "vite.config.ts"), server: { middlewareMode: true }, appType: "custom", logLevel: "error" });
try {
  const { default: App } = await vite.ssrLoadModule("/src/App.tsx");
  const { editorialEntries, knownPaths } = await vite.ssrLoadModule("/src/editorialRegistry.ts");
  const { default: EditorialPage } = await vite.ssrLoadModule("/src/components/EditorialPage.tsx");
  const { Header, Footer } = await vite.ssrLoadModule("/src/components/SiteChrome.tsx");
  const { catalogPageForPath, catalogPaths } = await vite.ssrLoadModule("/src/catalogData.ts");
  const concrete = new Map<string, string>();
  for (const route of manifest.routes) if (!route.path.includes(":")) concrete.set(route.path, route.title || "8 Углов");
  for (const route of catalogPaths as Set<string>) concrete.set(route, catalogPageForPath(route.replace(/\/$/, ""))?.title || "Каталог — 8 Углов");
  concrete.set("/404/", "Страница не найдена — 8 Углов");

  for (const [route, routeTitle] of concrete) {
    const pathname = route === "/404/" ? "/404" : route;
    browser.location = { pathname: withBasePath(pathname, base), search: "", hash: "" };
    const normalized = pathname.replace(/\/$/, "");
    const data = catalogPageForPath(normalized) || (editorialEntries[normalized] ? await editorialEntries[normalized].load() : null);
    const description = data?.description || (route === "/o-kompanii/" ? "Подход 8 Углов к клиентским процессам, команде и технологиям." : "8 Углов: связываем привлечение, CRM и работу команды от обращения до повторной покупки.");
    const title = data?.title || routeTitle;
    const element = data ? React.createElement("div", { className: "site-shell" }, React.createElement(Header), React.createElement(EditorialPage, { page: data, knownPaths }), React.createElement(Footer)) : React.createElement(App);
    const rendered = renderToString(element);
    const metadata = `<meta property="og:type" content="website" /><meta property="og:site_name" content="8 Углов" /><meta property="og:title" content="${html(title)}" /><meta property="og:description" content="${html(description)}" /><meta name="twitter:card" content="summary" />`;
    let result = original.replace(/<title>[\s\S]*?<\/title>/, `<title>${html(title)}</title>`).replace(/<meta name="description"[^>]*>/, `<meta name="description" content="${html(description)}" />`).replace("</head>", `${metadata}\n  </head>`).replace('<div id="root"></div>', `<div id="root">${rendered}</div>`);
    const target = route === "/" ? path.join(output, "index.html") : route === "/404/" ? path.join(output, "404.html") : path.join(output, route.replace(/^\/+|\/+$/g, ""), "index.html");
    await mkdir(path.dirname(target), { recursive: true });
    await writeFile(target, result, "utf8");
  }
  console.log(`Статически подготовлено HTML-страниц: ${concrete.size} (включая страницу 404). Индексация пока выключена.`);
} finally {
  await vite.close();
}
