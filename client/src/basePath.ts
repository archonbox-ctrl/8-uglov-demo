import { normalizeBasePath, withBasePath as addBase, withoutBasePath as removeBase } from "../../shared/basePath";

const base = normalizeBasePath(import.meta.env.BASE_URL);

export const withBasePath = (url: string): string => addBase(url, base);
export const withoutBasePath = (pathname: string): string => removeBase(pathname, base);
