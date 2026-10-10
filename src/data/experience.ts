export interface Experience {
  /** Sequence marker displayed as "01", "02", ... The list is a real timeline. */
  index: string;
  /** Organization / project name (rendered as the entry heading). */
  org: string;
  /** Role or capacity held. */
  role: string;
  /** Human-readable period, e.g. "June 2026 — Present". */
  period: string;
  /** Impact statements rendered as a bulleted list. */
  bullets: string[];
  /** Comma-separated stack / tools, rendered after "Technologies:". */
  tech: string;
  /** Optional outbound link; omit to render no link. */
  link?: { label: string; href: string };
  /**
   * Optional highlighted chips (mono) rendered above the bullets.
   * Currently used on entry 01 only.
   */
  stats?: string[];
}

/**
 * Experience entries.
 *
 * All copy is the owner's own. Any `[EDIT ME]` markers are intentional and are
 * rendered verbatim on the page — they must not be replaced with invented data.
 */
export const experience: Experience[] = [
  {
    index: "01",
    org: "FCN (Fast Care Network)",
    role: "Founder & Full Stack Developer",
    period: "June 2026 — Present",
    bullets: [
      "Founded and built a digital healthcare platform for Dire Dawa, Ethiopia, handling product, development, testing, and deployment on my own.",
      "Live in production and actively maintained: around 100 registered accounts in the first month after launch and 50+ people on the waitlist.",
      "Architected the full stack: React frontend on Vercel, Node.js/Express API on Railway, PostgreSQL with Prisma, Redis caching, and real-time features with Socket.io.",
      "Designed a seven-role access system with strict RBAC, and a multilingual AI symptom checker (Google Gemini) supporting English, Amharic, Somali, and Oromo.",
      "Integrated Chapa payments (switched off during the free pilot) and resolved production issues across PWA builds, routing rewrites, and role-based UI bugs.",
    ],
    tech: "React, TypeScript, Node.js, Express, PostgreSQL, Prisma, Socket.io, Redis, Gemini API, Vercel, Railway",
    link: { label: "View project →", href: "https://app.fcncare.com" },
    stats: ["~100 registered accounts in month one", "50+ on the waitlist"],
  },
  {
    index: "02",
    org: "Mahad School Website",
    role: "Freelance Full Stack Developer",
    period: "July 2026",
    bullets: [
      "Delivered a live website for a nonprofit Islamic school in Ethiopia on July 15, 2026, accepted and paid for by the client.",
      "Built a donation page and a secure admin panel so school staff can manage the site themselves.",
      "Developed mainly in TypeScript, with security and UX requirements scoped for production use.",
    ],
    tech: "TypeScript, [EDIT ME: framework / database]",
    link: { label: "View project →", href: "https://mahad.fcncare.com" },
  },
  {
    index: "03",
    org: "LocalConnect",
    role: "Side Project | Full Stack & Mobile Developer",
    period: "Feb 2026 — May 2026",
    bullets: [
      "Built and completed a local services marketplace for Ethiopia: a Flutter mobile app backed by a Node.js API, with customer, provider, and admin roles.",
      "Designed a 39-screen role-based app architecture with unique route IDs, JWT authentication, and real-time updates through Socket.io.",
    ],
    tech: "Flutter, Node.js, JWT, Socket.io, NeDB",
    link: { label: "View project →", href: "[EDIT ME: GitHub link]" },
  },
  {
    index: "04",
    org: "AI Gold Scalping Bot",
    role: "Side Project | Developer (code private)",
    period: "June 2025 — Present",
    bullets: [
      "Built an AI-assisted XAUUSD trading system with a three-engine design: technical microstructure, ML price prediction, and order-flow analysis. The code stays private, but the engineering story is below.",
      "Problem: the system was producing almost no valid trades. Real trade logs showed runaway loops, zero take-profits being hit, and one engine acting as a gate that silenced every signal.",
      "Solution: I traced the failures through the logs, then redesigned the gate as a veto-on-conflict check instead of a permission-required one, so engines can disagree without killing every trade.",
      "Lesson: in multi-model systems, the logic that connects the models usually fails before the models do.",
    ],
    tech: "Python, Streamlit, pandas, MetaTrader5, XGBoost, CNN/LSTM",
  },
  {
    index: "05",
    org: "Hack The Box Academy",
    role: "Cybersecurity Learner (Self-Directed)",
    period: "2024 — Present",
    bullets: [
      "Studying offensive and defensive security through HTB Academy, to think like an attacker and build safer software.",
      "Completed modules including Linux Fundamentals, Windows Fundamentals, Networking, and SQL Injection.",
      "Researched Java RMI architecture and its deserialization attack surface.",
    ],
    tech: "Linux, Windows, Networking, Web Security, SQL Injection, Java",
  },
  {
    index: "06",
    org: "Dire Dawa University",
    role: "BSc Software Engineering (3rd Year)",
    period: "Sept 2024 — Present",
    bullets: [
      "Full stack foundation in HTML, CSS, JavaScript, React, Node.js, and PostgreSQL, plus coursework in C, C++, Java, and MySQL.",
      "Built an online bookstore applying the Mediator, Composite, Chain of Responsibility, State, and Memento design patterns.",
      "Earned a certificate from the university's Incubation Center for developing and applying the Fast Care Network system.",
      "Earned a Udacity certificate in Programming Fundamentals (App Development).",
    ],
    tech: "HTML, CSS, JavaScript, React, TypeScript, Node.js, PostgreSQL, MySQL, C, C++, Java",
  },
];
