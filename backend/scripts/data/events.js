export const events = [
  {
    title: "AI Tech Session",
    slug: "ai-tech-session-2025",
    description:
      "Gain insights from industry leaders in AI & ML! Join us for an immersive session exploring the latest breakthroughs in artificial intelligence.",
    content: `
      <h2>About the Event</h2>
      <p>Join us for an exclusive AI Tech Session where industry leaders share their insights on the latest developments in artificial intelligence and machine learning.</p>
      
      <h3>What You'll Learn</h3>
      <ul>
        <li>Latest trends in AI and Machine Learning</li>
        <li>Real-world applications of AI in various industries</li>
        <li>Career opportunities in AI</li>
        <li>Hands-on demonstrations and Q&A sessions</li>
      </ul>
      
      <h3>Who Should Attend</h3>
      <p>This event is perfect for students, professionals, and anyone interested in learning about AI and its applications.</p>
    `,
    date: new Date("2025-10-11T12:30:00"),
    dateDisplay: "October 11, 2025",
    time: "12:30 PM - 4:00 PM",
    location: "Jaywant Auditorium, JSPM Campus",
    image: "/img/Nvidia-event.png",
    gallery: [
      "/img/Nvidia-event.png",
      "/img/ai-event-1.jpg",
      "/img/ai-event-2.jpg",
      "/img/ai-event-3.jpg",
    ],
    attendees: 250,
    category: "Technology",
    speakers: [
      {
        name: "Dr. Sarah Johnson",
        title: "AI Research Lead at Tech Corp",
        bio: "Leading AI researcher with 15+ years of experience",
        image: "/img/speaker-1.jpg",
      },
      {
        name: "Prof. Michael Chen",
        title: "Professor of Computer Science",
        bio: "Expert in machine learning and neural networks",
        image: "/img/speaker-2.jpg",
      },
    ],
    tags: ["AI", "Machine Learning", "Technology", "Workshop"],
    published: true,
  },
  {
    title: "Deep Learning Workshop",
    slug: "deep-learning-workshop",
    description:
      "Hands-on workshop covering neural networks, CNNs, and RNNs. Build your first deep learning model!",
    content: `
      <h2>Workshop Overview</h2>
      <p>A comprehensive hands-on workshop where you'll learn to build and train deep learning models from scratch.</p>
      
      <h3>Topics Covered</h3>
      <ul>
        <li>Introduction to Neural Networks</li>
        <li>Convolutional Neural Networks (CNNs)</li>
        <li>Recurrent Neural Networks (RNNs)</li>
        <li>Transfer Learning and Fine-tuning</li>
        <li>Building real-world applications</li>
      </ul>
      
      <h3>Prerequisites</h3>
      <p>Basic Python programming knowledge and familiarity with machine learning concepts.</p>
    `,
    date: new Date("2025-11-15T10:00:00"),
    dateDisplay: "November 15, 2025",
    time: "10:00 AM - 5:00 PM",
    location: "Computer Lab, Building A",
    image: "/img/deep-learning.jpg",
    gallery: [
      "/img/deep-learning.jpg",
      "/img/workshop-1.jpg",
      "/img/workshop-2.jpg",
    ],
    attendees: 150,
    category: "Workshop",
    tags: ["Deep Learning", "Neural Networks", "Python", "Hands-on"],
    published: true,
  },
  {
    title: "AI Networking Mixer",
    slug: "ai-networking-mixer",
    description:
      "Connect with AI enthusiasts, professionals, and researchers. Expand your network in the AI community!",
    content: `
      <h2>Event Details</h2>
      <p>An evening of networking with fellow AI enthusiasts, industry professionals, and researchers.</p>
      
      <h3>What to Expect</h3>
      <ul>
        <li>Meet and connect with AI professionals</li>
        <li>Share ideas and collaborate on projects</li>
        <li>Learn about career opportunities</li>
        <li>Enjoy refreshments and casual conversations</li>
      </ul>
    `,
    date: new Date("2025-12-01T18:00:00"),
    dateDisplay: "December 1, 2025",
    time: "6:00 PM - 9:00 PM",
    location: "Innovation Hub, Tech Park",
    image: "/img/networking.jpg",
    gallery: ["/img/networking.jpg"],
    attendees: 200,
    category: "Networking",
    tags: ["Networking", "Community", "Career"],
    published: true,
  },
  {
    title: "Cybersecurity via Hacker's Meetup",
    slug: "cybersecurity-hackers-meetup-2025",
    description:
      "Invite-only evening where red-teamers and security researchers share live demos and adversarial tactics.",
    content: `
      <h2>Inside the Meetup</h2>
      <p>Expect lightning talks, live exploit breakdowns, and collaborative labs focused on modern offensive and defensive plays.</p>
      <h3>Highlights</h3>
      <ul>
        <li>Reverse engineering corner with real malware samples</li>
        <li>Hands-on lab for securing AI/LLM pipelines</li>
        <li>Responsible disclosure clinic with Gotham AI security research</li>
      </ul>
    `,
    date: new Date("2025-01-07T18:30:00"),
    dateDisplay: "January 7, 2025",
    time: "6:30 PM - 9:30 PM",
    location: "Gotham AI Cyber Range, Pune",
    image: "/img/event-hackers.svg",
    gallery: [
      "/img/event-hackers.svg",
      "/img/upcomingevent.jpg",
      "/img/Nvidia-event.png",
    ],
    attendees: 90,
    category: "Security",
    tags: ["Cybersecurity", "Hackers", "Meetup"],
    published: true,
    galleryOnly: true,
  },
  {
    title: "MIT Alandi Tech Session",
    slug: "mit-alandi-tech-session-2025",
    description:
      "Campus-wide deep dive on applied AI systems, co-hosted with MIT Alandi faculty and Gotham AI architects.",
    content: `
      <h2>Session Flow</h2>
      <p>The session mixes keynote briefings with live build-alongs showcasing how Gotham AI productizes research.</p>
      <h3>Agenda</h3>
      <ul>
        <li>Vision transformers for aerial imaging</li>
        <li>Edge deployment playbook for robotics</li>
        <li>Student lightning demos + mentorship pods</li>
      </ul>
    `,
    date: new Date("2025-09-13T10:00:00"),
    dateDisplay: "September 13, 2025",
    time: "10:00 AM - 4:00 PM",
    location: "MIT Art, Design and Technology University, Alandi",
    image: "/img/event-mit.svg",
    gallery: [
      "/img/event-mit.svg",
      "/img/contact-1.webp",
      "/img/contact-2.webp",
    ],
    attendees: 320,
    category: "Technology",
    tags: ["Campus", "Workshop", "AI Systems"],
    published: true,
    galleryOnly: true,
    speakers: [
      {
        name: "Suresh Kadam",
        title: "Senior AI Strategist",
        bio: "Drives applied AI transformations across education and defense partners.",
      },
    ],
  },
  {
    title: "SIH Guidance Session",
    slug: "sih-guidance-session-2025",
    description:
      "Smart India Hackathon prep clinic covering ideation, submission strategy, and rapid prototyping best practices.",
    content: `
      <h2>What You Will Learn</h2>
      <p>Mentors from Versanix and Gotham AI walk teams through solutioning frameworks, PoC scoping, and demo readiness.</p>
      <h3>Included Clinics</h3>
      <ul>
        <li>Problem statement deep reads with mentors</li>
        <li>Design partner roundtables with industry evaluators</li>
        <li>Pitch mechanics: storytelling + live feedback</li>
      </ul>
    `,
    date: new Date("2025-09-22T11:00:00"),
    dateDisplay: "September 22, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "Gotham AI Studio, Pune",
    image: "/img/event-sih.svg",
    gallery: ["/img/event-sih.svg", "/img/about.webp", "/img/swordman.webp"],
    attendees: 210,
    category: "Workshop",
    tags: ["SIH", "Mentorship", "Hackathon Prep"],
    published: true,
    galleryOnly: true,
    speakers: [
      {
        name: "Suresh Kadam",
        title: "Smart India Hackathon Coach",
        bio: "Mentors national teams on ideation discipline and submission excellence.",
      },
    ],
  },
  {
    title: "Gotham AI x Versanix Hackathon",
    slug: "gotham-ai-versanix-hackathon",
    description:
      "48-hour product sprint with Versanix mentors to tackle real AI deployment challenges for community partners.",
    content: `
      <h2>About the Hackathon</h2>
      <p>Bring your team and build deployable AI solutions guided by Versanix mentors and Gotham AI architects.</p>
      <h3>Focus Areas</h3>
      <ul>
        <li>Applied computer vision for physical security</li>
        <li>Privacy-first AI assistants for enterprises</li>
        <li>Edge-ready inference pipelines</li>
      </ul>
      <p>The top three teams receive paid pilot opportunities with Versanix ecosystem partners.</p>
    `,
    date: new Date("2025-02-08T09:00:00"),
    dateDisplay: "February 8-9, 2025",
    time: "Starts 9:00 AM IST",
    location: "Innovation Hub, JSPM Campus",
    image: "/img/upcomingevent.jpg",
    gallery: ["/img/upcomingevent.jpg"],
    attendees: 180,
    category: "Technology",
    tags: ["Hackathon", "AI Builders", "Versanix"],
    published: true,
  },
  {
    title: "Gotham AI x E-Cell Hackathon",
    slug: "gotham-ai-ecell-hackathon",
    description:
      "Entrepreneurship focused hackathon with E-Cell to launch AI-first startups in fintech, mobility, and cybersecurity.",
    content: `
      <h2>Program Format</h2>
      <p>Day one focuses on rapid ideation with founders and day two on product demos with feedback from investors.</p>
      <h3>Why Join</h3>
      <ul>
        <li>Direct mentorship from E-Cell venture partners</li>
        <li>Access to Gotham AI internal APIs and datasets</li>
        <li>Seed funding consideration for standout teams</li>
      </ul>
      <p>Showcase your MVP to a panel of 12 VCs and industry veterans.</p>
    `,
    date: new Date("2025-03-22T10:00:00"),
    dateDisplay: "March 22-23, 2025",
    time: "Starts 10:00 AM IST",
    location: "Entrepreneurship Cell Arena, Pune",
    image: "/img/Nvidia-event.png",
    gallery: ["/img/Nvidia-event.png"],
    attendees: 220,
    category: "Networking",
    tags: ["Hackathon", "Startup", "E-Cell"],
    published: true,
  },
  // Add new events here - they'll automatically be included when you run the seed script!
];

