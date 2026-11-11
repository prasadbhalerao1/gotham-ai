// Every file in src/content/team/ is one person (see _template.js there).
import { collect } from "./collect.js";

export const team = collect(import.meta.glob("../content/team/*.js", { eager: true, import: "default" })).sort(
  (a, b) => (a.order ?? 99) - (b.order ?? 99),
);
