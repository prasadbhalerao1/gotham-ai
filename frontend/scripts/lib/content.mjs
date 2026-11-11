// Node-side twin of src/data/collect.js: loads src/content/<kind>/*.js
// (one item per file, file name = slug, "_" files skipped) for build scripts.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");

export async function loadContent(kind) {
  const dir = path.join(ROOT, "src/content", kind);
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".js") && !f.startsWith("_")).sort();
  return Promise.all(
    files.map(async (f) => {
      const mod = await import(pathToFileURL(path.join(dir, f)).href);
      return { slug: f.replace(/\.js$/, ""), ...mod.default, __file: path.join(dir, f) };
    }),
  );
}
