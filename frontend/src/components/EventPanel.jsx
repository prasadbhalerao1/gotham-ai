import { Link } from "react-router-dom";
import { eventCover, eventDateLabel } from "../data/site.js";

const EventPanel = ({ event, number, upcoming = false, className = "" }) => (
  <Link
    data-reveal="rise"
    to={`/events/${event.slug}`}
    className={`group relative flex flex-col overflow-hidden border border-bone/10 bg-ink-800 transition-colors duration-500 hover:border-signal/60 ${className}`}
  >
    <div className="photo relative aspect-[4/3] w-full">
      <img
        src={event.cover}
        alt={eventCover(event).alt}
        width={eventCover(event).width}
        height={eventCover(event).height}
        loading="lazy"
        decoding="async"
        className="size-full object-cover group-hover:scale-[1.04]"
      />
      <span className="absolute left-4 top-4 z-10 font-mono text-[0.6875rem] uppercase tracking-[0.18em] text-bone">
        No. {number}
      </span>
      <span className="absolute right-4 top-4 z-10 rounded-full border border-bone/30 bg-ink/40 px-3 py-1 font-mono text-[0.6875rem] uppercase tracking-[0.16em] text-bone backdrop-blur-sm">
        {upcoming ? "Upcoming" : event.category}
      </span>
    </div>
    <div className="flex flex-1 flex-col gap-4 p-5 md:p-6">
      <p className="font-mono text-xs uppercase tracking-[0.14em] text-signal">{eventDateLabel(event)}</p>
      <h3 className="display text-4xl leading-[0.9] md:text-5xl">{event.title}</h3>
      <p className="line-clamp-2 text-bone-dim">{event.summary}</p>
      <div className="mt-auto flex items-end justify-between gap-4 border-t border-bone/10 pt-4">
        <span className="font-mono text-[0.6875rem] uppercase leading-relaxed tracking-[0.12em] text-bone-mute">
          {event.location}
          {event.attendees > 0 && (
            <>
              <br />
              {event.attendees} attendees
            </>
          )}
        </span>
        <span aria-hidden className="flex size-10 shrink-0 items-center justify-center rounded-full border border-bone/20 transition-all duration-500 group-hover:-rotate-45 group-hover:border-signal group-hover:bg-signal group-hover:text-ink">
          →
        </span>
      </div>
    </div>
  </Link>
);

export default EventPanel;
