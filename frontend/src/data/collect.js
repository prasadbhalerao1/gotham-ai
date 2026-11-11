// Turns a folder of content files (one item per file, loaded with
// import.meta.glob) into an array. The file name is the slug; files starting
// with "_" (templates) are skipped.
export function collect(modules) {
  return Object.entries(modules)
    .map(([path, item]) => [path.split("/").pop().replace(/\.js$/, ""), item])
    .filter(([slug]) => !slug.startsWith("_"))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([slug, item]) => ({ slug, ...item }));
}
