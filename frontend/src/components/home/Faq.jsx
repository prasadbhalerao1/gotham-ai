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
        {faqs.map((f, i) => (
          <details
            key={f.q}
            data-reveal="rise"
            className="faq group border-b border-bone/10 first:border-t"
          >
            <summary className="flex cursor-pointer list-none items-center gap-5 py-6 text-xl text-bone md:gap-8 md:text-2xl [&::-webkit-details-marker]:hidden">
              <span aria-hidden className="w-7 shrink-0 font-mono text-xs text-bone-mute transition-colors duration-300 group-hover:text-signal group-open:text-signal">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="flex-1 transition-transform duration-500 ease-expo group-hover:translate-x-2">{f.q}</span>
              <span
                aria-hidden
                className="relative size-4 shrink-0 transition-colors duration-500 group-open:text-signal"
              >
                <span className="absolute left-0 top-1/2 h-px w-4 bg-current" />
                <span className="absolute left-1/2 top-0 h-4 w-px bg-current transition-transform duration-500 ease-expo group-open:rotate-90" />
              </span>
            </summary>
            <p className="faq-answer max-w-2xl pb-7 pl-12 text-lg leading-relaxed text-bone-dim md:pl-[3.75rem]">
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
