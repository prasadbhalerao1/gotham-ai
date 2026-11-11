// EVENT TEMPLATE — copy this file to `your-event-slug.js` in this folder.
// The file name becomes the URL: /events/your-event-slug (lowercase, hyphens).
// Files starting with "_" are ignored. Run `npm run check:content` when done.
export default {
  title: "My Event",
  date: "2026-08-21T10:00:00+05:30", // start, always with +05:30 (IST)
  // endDate: "2026-08-22T17:00:00+05:30", // optional, multi-day events
  time: "10:00 AM – 4:00 PM", // optional, shown as-is
  location: "Intel Lab, JSPM's RSCOE",
  category: "Workshop", // Workshop | Hackathon | Session | Meetup | Talk | Security | Networking
  summary: "One or two sentences — used on cards, in Google results and link previews.",
  cover: "/img/my-event/cover.jpg", // put photos in public/img/my-event/
  gallery: ["/img/my-event/1.jpg"], // photos and .mp4 clips
  // attendees: 120, // optional — leave out if not recorded
  highlights: ["Short punchy line", "Another one", "A third"],
  sections: [{ title: "About", text: "A paragraph…", items: ["optional bullet"] }],
  // agenda: [{ label: "Day 1", venue: "…", items: [{ time: "10:00", title: "…", by: "…" }] }],
  // speakers: [{ name: "…", title: "…", bio: "…", image: "/img/…" }],
  // registrationLink: "https://…", // shows a Register button while upcoming
  published: true, // false hides it everywhere
};
