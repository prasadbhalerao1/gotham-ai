import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

const NotFoundPage = ({ what = "page" }) => (
  <section className="grain relative flex min-h-[80svh] items-center overflow-hidden pt-24">
    <Helmet>
      <title>Signal lost | Gotham AI</title>
      <meta name="robots" content="noindex" />
    </Helmet>
    <div className="wrap">
      <p className="label mb-6 text-signal">Error 404</p>
      <h1 className="display text-[22vw] md:text-[14vw]">
        Signal <span className="accent">lost</span>
      </h1>
      <p className="mt-6 max-w-md text-lg text-bone-dim">We couldn&apos;t find that {what}. It may have moved, or never existed.</p>
      <Link to="/" className="btn-signal mt-10">
        Back to Gotham →
      </Link>
    </div>
  </section>
);

export default NotFoundPage;
