import { Link } from "react-router-dom";
import { faqs } from "../../data/site.js";

// Plain, crawlable answers (also published as FAQPage JSON-LD on the home page).
const Faq = () => (
  <section id="faq" aria-labelledby="faq-title" className="border-t border-bone/10 bg-ink py-24 md:py-32">
    <div className="wrap grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-4">
        <p className="label mb-6">FAQ</p>
        <h2 id="faq-title" data-reveal="mask" className="display text-6xl md:text-7xl">
          Good <span className="accent">questions</span>
        </h2>
      </div>
      <div className="lg:col-span-8">
        {faqs.map((f) => (
          <details key={f.q} data-reveal="rise" className="group border-b border-bone/10 first:border-t">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-xl text-bone transition-colors hover:text-signal md:text-2xl [&::-webkit-details-marker]:hidden">
              {f.q}
              <span aria-hidden className="relative size-4 shrink-0">
                <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-300 group-open:scale-y-0" />
              </span>
            </summary>
            <p className="max-w-2xl pb-7 text-lg leading-relaxed text-bone-dim">
              {f.a}
              {f.to && (
                <>
                  {" "}
                  <Link to={f.to} className="whitespace-nowrap text-bone underline decoration-bone/30 underline-offset-4 hover:text-signal">
                    Read more →
                  </Link>
                </>
              )}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
);

export default Faq;
