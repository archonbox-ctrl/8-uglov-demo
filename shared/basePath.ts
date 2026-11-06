// Keep logical routes independent of the directory where the site is hosted.
export function normalizeBasePath(value: string | undefined): string {
  const trimmed = (value ?? "").trim();
  if (!trimmed || /^\/+$/.test(trimmed)) return "/";

  const path = trimmed.replace(/^\/+|\/+$/g, "");
  if (/[?#\\\s]/.test(path) || path.includes("//") || path.split("/").some((segment) => segment === "." || segment === "..")) {
    throw new Error(`Invalid VITE_BASE_PATH: ${value}`);
  }
  return `/${path}/`;
}

// Only root-relative local URLs are changed. Queries, fragments and other URL
// forms stay intact, and a previously prefixed URL is left as-is.
export function withBasePath(url: string, base: string): string {
  if (base === "/" || !url.startsWith("/") || url.startsWith("//")) return url;
  const prefix = base.slice(0, -1);
  if (url === prefix || url.startsWith(`${prefix}/`) || url.startsWith(`${prefix}?`) || url.startsWith(`${prefix}#`)) return url;
  return `${prefix}${url}`;
}

// Strip only a complete path segment, not a similarly named directory.
export function withoutBasePath(pathname: string, base: string): string {
  if (base === "/") return pathname;
  const prefix = base.slice(0, -1);
  if (pathname === prefix) return "/";
  return pathname.startsWith(`${prefix}/`) ? pathname.slice(prefix.length) : pathname;
}
