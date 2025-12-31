import { Helmet } from 'react-helmet-async';

const SEO = ({ title, description, keywords, canonical, type = 'website', name = 'Gotham AI' }) => {
  const siteUrl = 'https://gotham-ai.vercel.app';
  const defaultDescription = 'Gotham AI at RSCOE - The premier Versanix Community AI hub leading innovation in Deep Learning, AIML, and CSBS.';
  const defaultKeywords = 'Gotham AI, Gotham Club, RSCOE, Versanix, AI Club, Deep Learning, Artificial Intelligence, Prasad Bhalerao';
  
  // Clean up title
  const fullTitle = title === name ? title : `${title} | ${name}`;
  
  // Handle canonical URL
  const currentUrl = canonical || (typeof window !== 'undefined' ? window.location.href : siteUrl);
  // Ensure we consistently use the production domain for canonicals (clean up localhost references)
  const safeCanonical = canonical || (typeof window !== 'undefined' ? window.location.pathname === '/' ? siteUrl : `${siteUrl}${window.location.pathname}` : siteUrl);

  return (
    <Helmet>
      {/* Standard metadata */}
      <title>{fullTitle}</title>
      <meta name="description" content={description || defaultDescription} />
      <meta name="keywords" content={keywords || defaultKeywords} />
      <link rel="canonical" href={safeCanonical} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description || defaultDescription} />
      <meta property="og:url" content={safeCanonical} />
      <meta property="og:site_name" content={name} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description || defaultDescription} />
    </Helmet>
  );
};

export default SEO;
