// Reads the real pixel size of every image in public/img and writes
// src/data/image-meta.json, so pages can set width/height (no layout shift)
// and structured data can describe each photo. Runs before dev and build.
import fs from "node:fs";
import path from "node:path";
import { imageSize } from "image-size";
import { ROOT } from "./lib/content.mjs";

const pub = path.join(ROOT, "public");
const meta = {};
const walk = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).forEach((d) => {
    const p = path.join(dir, d.name);
    if (d.isDirectory()) return walk(p);
    if (!/\.(jpe?g|png|webp|gif|avif)$/i.test(d.name)) return;
    try {
      const { width, height } = imageSize(fs.readFileSync(p));
      meta["/" + path.relative(pub, p).split(path.sep).join("/")] = { width, height, bytes: fs.statSync(p).size };
    } catch {
      // unreadable image — pages fall back to no explicit size
    }
  });
walk(path.join(pub, "img"));
const out = path.join(ROOT, "src/data/image-meta.json");
fs.writeFileSync(out, JSON.stringify(meta, null, 1) + "\n");
console.log(`✓ Image metadata — ${Object.keys(meta).length} images measured`);
