// Every file in src/content/projects/ is one project (see _template.js there).
import { collect } from "./collect.js";

export const projects = collect(import.meta.glob("../content/projects/*.js", { eager: true, import: "default" }));
