import { Helmet } from "react-helmet-async";

/** Renders one or more schema.org objects (see lib/structuredData.js). */
const StructuredData = ({ data }) => (
  <Helmet>
    {[].concat(data).filter(Boolean).map((d, i) => (
      <script key={i} type="application/ld+json">
        {JSON.stringify(d)}
      </script>
    ))}
  </Helmet>
);

export default StructuredData;
