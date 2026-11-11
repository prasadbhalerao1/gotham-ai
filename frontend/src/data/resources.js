// Every file in src/content/resources/ is one resource (see _template.js there).
import { collect } from "./collect.js";

export const resources = collect(import.meta.glob("../content/resources/*.js", { eager: true, import: "default" }));
