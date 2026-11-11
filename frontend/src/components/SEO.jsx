import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { SITE_URL, site } from "../data/site.js";

const defaultDescription = site.description;
const defaultKeywords =
  "Gotham AI, Gotham Club, RSCOE, JSPM, Rajarshi Shahu College Of Engineering, Tathawade, Pune, AI Club, Machine Learning, Agentic AI, Deep Learning, Hackathon, Prasad Bhalerao";

/**
 * Page metadata. `title` gets " | Gotham AI" appended; pass `fullTitle` to set
 * the whole title yourself. `noindex` keeps a page out of search results.
 */
const Seo = ({ title, fullTitle: exactTitle, description, keywords, image, imageAlt, type = "website", name = "Gotham AI", noindex = false }) => {
  const { pathname } = useLocation();
  const fullTitle = exactTitle ?? (!title || title === name ? `${name} | AI & Technology Community in Pune` : `${title} | ${name}`);
  const canonical = pathname === "/" ? SITE_URL : `${SITE_URL}${pathname.replace(/\/$/, "")}`;
  const ogImage = `${SITE_URL}${image || "/img/og-default.jpg"}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={canonical} />
      {/* plain-text twin of this page for AI crawlers (written at build time) */}
      {!noindex && <link rel="alternate" type="text/markdown" href={`${pathname === "/" ? "/index" : pathname.replace(/\/$/, "")}.md`} />}
      <meta name="robots" content={noindex ? "noindex, follow" : "index, follow, max-image-preview:large, max-snippet:-1"} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:alt" content={imageAlt || fullTitle} />
      <meta property="og:site_name" content={name} />
      <meta property="og:locale" content="en_IN" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
      <meta name="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Seo;
