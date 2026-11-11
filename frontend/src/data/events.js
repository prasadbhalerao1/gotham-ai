/**
 * EVENTS — the single source of truth for every event on the site.
 *
 * To add an event: copy the TEMPLATE below into the `events` array (order does
 * not matter — the site sorts by date), drop its photos into
 * `public/img/<folder>/`, then run `npm run check:content` (also runs on build).
 *
 * TEMPLATE
 * {
 *   slug: "my-event-2026",              // URL: /events/my-event-2026 — lowercase, hyphens, unique
 *   title: "My Event",
 *   date: "2026-08-21T10:00:00+05:30",  // ISO start, always with +05:30 (IST)
 *   endDate: "2026-08-22T17:00:00+05:30", // optional, for multi-day events
 *   time: "10:00 AM – 4:00 PM",         // optional, shown as-is
 *   location: "Intel Lab, JSPM's RSCOE",
 *   category: "Workshop",               // Workshop | Hackathon | Session | Meetup | Talk | Security | Networking
 *   summary: "One or two sentences used on cards, in search results and social previews.",
 *   cover: "/img/my-event/cover.jpg",   // main photo / poster
 *   gallery: ["/img/my-event/1.jpg"],   // photos and .mp4 videos, any number
 *   attendees: 120,                     // optional — leave out if not recorded
 *   highlights: ["Short, punchy bullet", "…"],
 *   sections: [{ title: "About", text: "Paragraph…", items: ["optional bullets"] }],
 *   agenda: [{ label: "Day 1", venue: "…", items: [{ time: "10:00", title: "…", by: "…" }] }], // optional
 *   speakers: [{ name: "…", title: "…", bio: "…", image: "/img/…" }],                       // optional
 *   registrationLink: "https://…",      // optional — shows a Register button while upcoming
 *   published: true,                    // false hides it everywhere
 * }
 */
export const events = [
  {
    slug: "ai-tech-session-2025",
    title: "AI Tech Session",
    date: "2025-10-11T12:30:00+05:30",
    time: "12:30 PM – 4:00 PM",
    location: "Jaywant Auditorium, JSPM Campus",
    category: "Session",
    summary:
      "A journey from the basics of machine learning to real-world AI tools that are transforming accessibility.",
    cover: "/img/gotham-jspm/gotham-jspm1.jpg",
    gallery: [
      "/img/gotham-jspm/gotham-jspm1.jpg",
      "/img/gotham-jspm/gotham-jspm2.jpg",
      "/img/gotham-jspm/gotham-jspm3.jpg",
      "/img/gotham-jspm/gotham-jspm4.jpg",
      "/img/gotham-jspm/gotham-jspm5.jpg",
      "/img/gotham-jspm/gotham-jspm6.jpg",
      "/img/gotham-jspm/gotham-jspm7.jpg",
    ],
    attendees: 500,
    highlights: [
      "How machines learn patterns from data",
      "Regression, classification and iterative model improvement",
      "AI tools that improve accessibility and independence",
    ],
    sections: [
      {
        title: "About the session",
        text: "The session explored the fundamentals of machine learning and demonstrated how modern AI systems are designed to solve real-world accessibility challenges.",
      },
      {
        title: "Session by Dr. Bhushan Akerkar",
        items: [
          "Introduced how machines learn patterns from data.",
          "Explained core machine learning mathematics in an intuitive way, focusing on functions, patterns, and errors.",
          "Regression — predicting continuous values; classification — grouping and labeling data; model improvement through iterative learning.",
          "Used everyday, relatable examples to connect theory with real-life applications.",
        ],
      },
      {
        title: "Session by Dr. Deepali Bhavale",
        items: [
          "Focused on practical and human-centred AI applications.",
          "How AI improves accessibility for people with vision challenges, people with reading difficulties, and users needing help with daily digital tasks.",
          "Demonstrated AI tools that simplify learning and promote independence.",
          "Highlighted how inclusive design makes technology easier for everyone to use.",
        ],
      },
      {
        title: "Takeaway",
        items: [
          "Students gained a strong foundation in machine learning fundamentals.",
          "The event bridged technical concepts with meaningful, real-world AI use cases.",
        ],
      },
    ],
    speakers: [
      {
        name: "Dr. Bhushan Akerkar",
        title: "Former CIO, Hindalco",
        bio: "B.Tech IIT (BHU) graduate, certified in ML & AI, with industry experience at HP, L&T, and TCS, former Chief Information Officer at Hindalco, and a passionate mentor and speaker in emerging technologies.",
        image: "/img/Bhushan_Akerkar.jpeg",
      },
      {
        name: "Dr. Deepali Bhavale",
        title: "Author, “Intelligent Inclusion”",
        bio: "VJTI alumna, tech lead, and author of “Intelligent Inclusion,” is an ex–Bank of America professional experienced in leading AI projects and dedicated to making education and technology more accessible.",
        image: "/img/Deepali_Bhavale.jpg",
      },
    ],
    published: true,
  },
  {
    slug: "cybersecurity-hackers-meetup-2025",
    title: "Cybersecurity via Hacker's Meetup",
    date: "2025-01-07T18:30:00+05:30",
    location: "JSPM's RSCOE",
    category: "Security",
    summary:
      "An invite-only evening where red-teamers and security researchers shared live demos and adversarial tactics.",
    cover: "/img/cyber/cyber.jpg",
    gallery: ["/img/cyber/cyber.jpg"],
    attendees: 90,
    highlights: [
      "Reverse engineering with real malware samples",
      "Hands-on labs on securing AI and LLM pipelines",
      "Responsible disclosure clinic",
    ],
    sections: [
      {
        title: "Inside the meetup",
        text: "An invite-only evening where red-teamers and security researchers shared real-world attack strategies, live demonstrations, and collaborative labs focused on modern offensive and defensive security techniques.",
      },
      {
        title: "Highlights",
        items: [
          "Reverse engineering sessions with real malware samples",
          "Hands-on labs focused on securing AI and LLM pipelines",
          "Responsible disclosure clinic led by Gotham AI security researchers",
        ],
      },
    ],
    published: true,
  },
  {
    slug: "mit-adt-tech-session-2025",
    title: "MIT ADT Tech Session",
    date: "2025-09-13T10:00:00+05:30",
    location: "MIT ADT",
    category: "Session",
    summary: "A hands-on technology meetup where student teams built prototypes across AI, blockchain and IoT.",
    cover: "/img/mit/mit.jpg",
    gallery: ["/img/mit/mit.jpg"],
    attendees: 100,
    highlights: ["Team-based prototyping", "Three emerging-tech tracks", "Direct interaction with mentors"],
    sections: [
      {
        title: "Session overview",
        text: "The session featured a hands-on technology meetup where students worked in teams to build real-world prototypes across multiple emerging technology domains.",
      },
      {
        title: "AI in Action",
        text: "Projects: chatbots, sentiment analysis, image classification. Skills: Python, TensorFlow/PyTorch, APIs.",
      },
      {
        title: "Blockchain Beyond Crypto",
        text: "Projects: voting systems, supply-chain tracking, token applications. Skills: Solidity, Ethereum, Polygon, Hyperledger.",
      },
      {
        title: "IoT & Edge Computing",
        text: "Projects: smart home automation, health monitoring, predictive maintenance. Skills: Arduino/Raspberry Pi, MQTT, cloud integration.",
      },
      {
        title: "Student & department benefits",
        items: [
          "Exposure to industry-relevant technologies",
          "Hands-on, team-based project development",
          "Direct interaction with mentors and experts",
          "Strengthened innovation-driven academic profile",
        ],
      },
    ],
    speakers: [
      {
        name: "Shripad Punde",
        title: "Network security researcher",
        bio: "Network security, forensics and blue-teaming specialist.",
        image: "/img/Shripad_Punde.jpg",
      },
    ],
    published: true,
  },
  {
    slug: "sih-guidance-session-2025",
    title: "SIH Guidance Session",
    date: "2025-09-22T11:00:00+05:30",
    time: "11:00 AM – 3:00 PM",
    location: "Intel Lab, JSPM's RSCOE",
    category: "Workshop",
    summary:
      "A Smart India Hackathon prep clinic covering ideation, submission strategy and rapid prototyping best practices.",
    cover: "/img/sih/sih1.jpg",
    gallery: ["/img/sih/sih1.jpg", "/img/sih/sih2.jpg", "/img/sih/sih3.jpg", "/img/sih/sih4.jpg"],
    attendees: 40,
    highlights: ["Problem statements with mentor guidance", "Pitch design that stands out", "Live feedback"],
    sections: [
      {
        title: "What students learned",
        text: "The session focused on preparing students for the Smart India Hackathon by refining idea presentation, structuring impactful pitches, and standing out during evaluations.",
      },
      {
        title: "Session highlights",
        items: [
          "Deep dive into problem statements with mentor guidance",
          "Pitch design techniques combining storytelling and clarity",
          "Live feedback to improve presentation confidence",
        ],
      },
    ],
    speakers: [
      {
        name: "Shripad Punde",
        title: "Smart India Hackathon Coach",
        bio: "Network security, forensics and blue-teaming specialist.",
        image: "/img/Shripad_Punde.jpg",
      },
    ],
    published: true,
  },
  {
    slug: "ai-symposium-hackathon-2026",
    title: "National Level AI Symposium & Hackathon",
    date: "2026-03-16T09:00:00+05:30",
    endDate: "2026-03-17T17:00:00+05:30",
    time: "Two days, 9:00 AM onwards",
    location: "VIT Bibwewadi & VIT Kondhwa Campuses, Pune",
    category: "Hackathon",
    summary:
      "A national-level two-day symposium and hackathon with expert AI sessions, networking and a hands-on build.",
    cover: "/img/AI_Symposium/AI_Symposium1.png",
    gallery: [
      "/img/AI_Symposium/AI_Symposium1.png",
      "/img/AI_Symposium/AI_Symposium2.png",
      "/img/AI_Symposium/AI_Symposium3.png",
      "/img/AI_Symposium/AI_Symposium4.png",
      "/img/AI_Symposium/Symposium_vid1.mp4",
      "/img/AI_Symposium/Symposium_vid2.mp4",
    ],
    highlights: [
      "Five expert sessions in one day",
      "A five-hour competitive hackathon",
      "Ethical and responsible AI in focus",
    ],
    sections: [
      {
        title: "About the event",
        text: "The symposium brought together students, researchers, and industry experts to explore advancements in artificial intelligence. It combined technical sessions with a competitive hackathon, fostering innovation, collaboration, and real-world problem-solving.",
      },
      {
        title: "Key takeaways",
        items: [
          "Exposure to real-world AI applications and industry insights",
          "Hands-on experience through a competitive hackathon",
          "Networking with experts, mentors, and peers",
          "Understanding ethical and responsible AI development",
        ],
      },
    ],
    agenda: [
      {
        label: "Day 1 — Symposium · 16 Mar",
        venue: "Sharad Arena, VIT Bibwewadi Campus",
        items: [
          { time: "09:00", title: "Registration" },
          { time: "10:00", title: "Inauguration ceremony" },
          { title: "Artificial Intelligence in Real-World Applications", by: "Dr. Vidya Kumbhar (Patkar)" },
          { title: "AI for Cybersecurity", by: "Mr. Sundaravenkataraman S." },
          { time: "11:45", title: "Tea break" },
          { title: "Machine Learning & Deep Learning Innovations", by: "Dr. Vivek Patil" },
          { title: "Future of Human-AI Collaboration", by: "Dr. Masuldar" },
          { time: "13:30", title: "Lunch break" },
          { title: "Responsible & Ethical AI", by: "Deepali Bhavale" },
          { time: "15:00", title: "Technical quiz" },
          { time: "15:45", title: "Closing ceremony" },
        ],
      },
      {
        label: "Day 2 — Hackathon · 17 Mar",
        venue: "Seminar Hall, E Building, VIT Kondhwa Campus",
        items: [
          { time: "09:00", title: "Registration" },
          { time: "10:00", title: "Introduction" },
          { time: "10:15", title: "Problem statements" },
          { time: "10:30", title: "Team allocation" },
          { time: "10:45", title: "Hackathon — five hours" },
          { time: "15:00", title: "Evaluation" },
          { time: "16:15", title: "Final gathering" },
          { time: "16:30", title: "Valedictory ceremony" },
        ],
      },
    ],
    speakers: [
      {
        name: "Dr. Vidya Kumbhar (Patkar)",
        title: "Deputy Director, Symbiosis Institute of Geoinformatics",
        bio: "Expert in geoinformatics and AI applications with extensive academic and research experience.",
      },
      {
        name: "Mr. Sundaravenkataraman S.",
        title: "GRC Lead, FPL Technologies (OneCard)",
        bio: "Industry expert specializing in governance, risk, compliance, and AI-driven cybersecurity.",
      },
      {
        name: "Dr. Vivek Patil",
        title: "Vishwakarma Institute of Technology, Pune",
        bio: "Academic expert in machine learning and deep learning innovations.",
      },
      {
        name: "Dr. Masuldar",
        title: "CEO, Afon Tech Solution",
        bio: "Leader in AI-driven solutions and human-AI collaboration technologies.",
      },
      {
        name: "Deepali Bhavale",
        title: "Technical Lead, Agiliad",
        bio: "AI leader focused on ethical and responsible AI systems and accessibility.",
        image: "/img/Deepali_Bhavale.jpg",
      },
    ],
    published: true,
  },
  {
    slug: "founders-dialogue-2026",
    title: "The Founder’s Dialogue",
    date: "2026-03-05T10:00:00+05:30",
    time: "10:00 AM",
    location: "MBA Seminar Hall, JSPM",
    category: "Networking",
    summary:
      "A founder-focused session with real-world startup lessons and inspiration for aspiring innovators.",
    cover: "/img/FoundersDialogue/FoundersDialogue1.jpeg",
    gallery: [
      "/img/FoundersDialogue/FoundersDialogue1.jpeg",
      "/img/FoundersDialogue/FoundersDialogue2.jpeg",
      "/img/FoundersDialogue/FoundersDialogue3.jpeg",
      "/img/FoundersDialogue/FoundersDialogue4.jpeg",
      "/img/FoundersDialogue/AtharvaBhamburkar.jpeg",
    ],
    highlights: ["Real startup journeys", "Security and AI-driven products", "Open Q&A with a founder"],
    sections: [
      {
        title: "About the event",
        text: "The Founder’s Dialogue is a session designed to inspire, educate, and empower the next generation of entrepreneurs. It gave students direct exposure to real-world startup journeys, challenges, and decision-making.",
      },
      {
        title: "Session overview",
        text: "Participants gained insights into building and scaling ventures, understanding industry dynamics, and navigating the evolving landscape of technology and innovation.",
        items: [
          "Real-world startup experiences and lessons",
          "Insights into cybersecurity and AI-driven solutions",
          "Guidance for aspiring founders and innovators",
          "Interactive discussion and Q&A session",
        ],
      },
      {
        title: "Key takeaways",
        items: [
          "Understanding the mindset of successful founders",
          "Exposure to real-world startup challenges",
          "Practical advice for building impactful solutions",
          "Networking with like-minded innovators",
        ],
      },
    ],
    speakers: [
      {
        name: "Atharva Bhamburkar",
        title: "Solutions Architect, Vulnuris Security Solutions",
        bio: "Cybersecurity and AI professional specializing in security services, product architecture, and real-world AI applications.",
        image: "/img/FoundersDialogue/AtharvaBhamburkar.jpeg",
      },
    ],
    published: true,
  },
  {
    slug: "code-architect",
    title: "Code Architect",
    date: "2026-03-18T11:00:00+05:30",
    time: "11:00 AM",
    location: "Intel Lab, JSPM's RSCOE",
    category: "Workshop",
    summary:
      "A focused AI learning challenge on LLM fundamentals, ChatGPT architecture, RAG systems and enterprise AI.",
    cover: "/img/CodeArchitectPy/CodeArchitect1.jpeg",
    gallery: [
      "/img/CodeArchitectPy/CodeArchitect1.jpeg",
      "/img/CodeArchitectPy/CodeArchitect2.jpeg",
      "/img/CodeArchitectPy/CodeArchitect3.jpeg",
      "/img/CodeArchitectPy/CodeArchitect4.jpeg",
    ],
    highlights: ["LLM fundamentals, demystified", "How ChatGPT actually works", "RAG on your own data"],
    sections: [
      {
        title: "About the event",
        text: "The Code Architect Challenge 2026 is a hands-on learning session designed to help students understand the inner workings of modern AI systems, especially large language models like ChatGPT — with both conceptual clarity and practical insight into how AI is built and used.",
      },
      {
        title: "Topics covered",
        items: [
          "LLM fundamentals — demystifying AI and ChatGPT",
          "Behind the tech — how ChatGPT actually works",
          "RAG mastery — building AI systems that work with your own data",
          "Corporate AI — how companies use internal AI bots",
        ],
      },
      {
        title: "Key takeaways",
        items: [
          "Clear understanding of LLMs and AI systems",
          "Practical insights into ChatGPT architecture",
          "Knowledge of RAG-based applications",
          "Awareness of real-world enterprise AI use cases",
        ],
      },
    ],
    published: true,
  },
];
