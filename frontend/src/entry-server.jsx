import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.jsx";
import { SITE_URL, eventDateLabel, faqs, publishedProjects, site, sortedEvents } from "./data/site.js";
import { resources } from "./data/resources.js";

// data the prerender script needs (it can't import Vite-only modules itself)
export { SITE_URL, eventDateLabel, faqs, publishedProjects, resources, site, sortedEvents };
export { llmsFull, markdownPages } from "./lib/markdown.js";

export const routes = [
  "/",
  "/about",
  "/contact",
  "/events",
  "/projects",
  "/resources",
  ...sortedEvents.map((e) => `/events/${e.slug}`),
  ...publishedProjects.filter((p) => !p.disableDetail).map((p) => `/projects/${p.slug}`),
  ...resources.filter((r) => r.published !== false).map((r) => `/resources/${r.slug}`),
];

export function render(url) {
  const helmetContext = {};
  const html = renderToString(
    <HelmetProvider context={helmetContext}>
      <StaticRouter location={url}>
        <App />
      </StaticRouter>
    </HelmetProvider>,
  );
  const { helmet } = helmetContext;
  const head = helmet
    ? [helmet.title, helmet.meta, helmet.link, helmet.script].map((h) => h.toString()).join("")
    : "";
  return { html, head };
}
