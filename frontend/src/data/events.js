// Every file in src/content/events/ is one event (see _template.js there).
import { collect } from "./collect.js";

export const events = collect(import.meta.glob("../content/events/*.js", { eager: true, import: "default" }));
