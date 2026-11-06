import type { EditorialPageContent } from "./editorial/types";
import { editorialIndex } from "./editorialIndex";
import { catalogPaths } from "./catalogData";

const modules = import.meta.glob<{ default: EditorialPageContent }>("./editorial/*.ts");
export const editorialEntries: Record<string, { title: string; description: string; load: () => Promise<EditorialPageContent> }> = {};
for (const entry of editorialIndex) {
  const load = modules[`./editorial/${entry.file}`];
  if (!load) throw new Error(`Missing editorial page module: ${entry.file}`);
  editorialEntries[entry.route.replace(/\/$/, "")] = { title: entry.title, description: entry.description, load: async () => (await load()).default };
}
export const knownPaths = new Set(["/", "/o-kompanii/", ...editorialIndex.map((page) => page.route), ...catalogPaths]);
