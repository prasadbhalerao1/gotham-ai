import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import "@fontsource-variable/instrument-sans/standard.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource/jetbrains-mono/400.css";
import "./index.css";
import App from "./App.jsx";

const tree = (
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);

const root = document.getElementById("root");
// Production pages are prerendered (scripts/prerender.mjs). Hydrate only when
// the HTML was rendered for this URL — a host's SPA fallback may serve another page's HTML.
const path = window.location.pathname.replace(/\/$/, "") || "/";
if (root.hasChildNodes() && root.dataset.route === path) hydrateRoot(root, tree);
else {
  root.textContent = "";
  createRoot(root).render(tree);
}
