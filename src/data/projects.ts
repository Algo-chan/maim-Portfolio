import fcnWeb from "../assets/projects/fcn-care-1.png";
import incomeWeb from "../assets/projects/income-calculator-1.png";
import queuWeb from "../assets/projects/queu-system-1.png";
import mahadWeb from "../assets/projects/mahad-1.png";
import nexbotWeb from "../assets/projects/nexbot-1.png";

export interface Project {
  /** Displayed as 01, 02, ... */
  index: string;
  name: string;
  /** Short category label shown under the name on the featured cards */
  short: string;
  description: string;
  tags: string[];
  /** "View in web" link. Empty/absent renders no Live button */
  webUrl?: string;
  /** "View in GitHub" link. Empty/absent renders no Code button */
  repoUrl?: string;
  /** Static screenshot of the project's landing page */
  image?: ImageMetadata;
  /** Card background colour sampled from the screenshot */
  bg?: string;
}

/**
 * Featured work.
 * [EDIT ME] tags/descriptions are placeholders — rewrite in your own words and
 * confirm the stack per project. Screenshots live in src/assets/projects/.
 */
export const projects: Project[] = [
  {
    index: "01",
    name: "FCN Care",
    short: "Healthcare",
    description:
      "Fast Care Now (FCN) — digital healthcare platform for appointments, patient records, and clinic workflows.",
    tags: ["[EDIT ME] stack"],
    webUrl: "https://fcncare.com",
    repoUrl: "https://github.com/Algo-chan/FCN-new.git",
    image: fcnWeb,
    bg: "#073047",
  },
  {
    index: "02",
    name: "School Management System",
    short: "Education",
    description: "School management system — students, classes, grades, and day-to-day admin.",
    tags: ["[EDIT ME] stack"],
    webUrl: "",
    repoUrl: "https://github.com/Algo-chan/School-Management.git",
  },
  {
    index: "03",
    name: "Income Calculator",
    short: "Web tool",
    description: "Income/budget calculator tool (FlowBudget) — track money in and out, plan monthly budgets.",
    tags: ["[EDIT ME] stack"],
    webUrl: "https://income-calculator-seven.vercel.app/",
    repoUrl: "https://github.com/Algo-chan/income-calculator.git",
    image: incomeWeb,
    bg: "#0c1219",
  },
  {
    index: "04",
    name: "Queue System",
    short: "Government services",
    description: "Citizen-side queue platform — take a number, track your turn, for government services.",
    tags: ["[EDIT ME] stack"],
    webUrl: "https://queu-system.vercel.app/",
    repoUrl: "https://github.com/Algo-chan/Queu-System.git",
    image: queuWeb,
    bg: "#4175c6",
  },
  {
    index: "05",
    name: "Mahad Al-Towheed School",
    short: "Education",
    description: "Website for Mahad Al-Towheed Islamic School — admissions, announcements, and program info.",
    tags: ["[EDIT ME] stack"],
    webUrl: "https://mahad.fcncare.com",
    repoUrl: "https://github.com/Algo-chan/Mahad-site.git",
    image: mahadWeb,
    bg: "#315b4d",
  },
  {
    index: "06",
    name: "Nexbot",
    short: "Commercial website",
    description: "NexBot Studio — commercial site for an AI bot agency: services, pricing, and portfolio.",
    tags: ["[EDIT ME] stack"],
    webUrl: "https://nexbot-eta.vercel.app/",
    repoUrl: "https://github.com/Algo-chan/nexbot.git",
    image: nexbotWeb,
    bg: "#2c1709",
  },
  {
    index: "07",
    name: "E-commerce Store",
    short: "Commerce",
    description: "Simple e-commerce store — products, cart, and checkout flow.",
    tags: ["[EDIT ME] stack"],
    webUrl: "",
    repoUrl: "https://github.com/Algo-chan/CodeAlpha_Simple_E-commerce_store.git",
  },
];