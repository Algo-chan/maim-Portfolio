import fcnCare from "../assets/projects/fcn-care.png";
import localConnect from "../assets/projects/local-connect.png";
import goldBot from "../assets/projects/gold-bot.png";
import mahad from "../assets/projects/mahad.png";

export interface Project {
  /** Displayed as 01, 02, ... */
  index: string;
  name: string;
  /** Short category label shown under the name on the featured cards */
  short: string;
  description: string;
  tags: string[];
  /** Empty string renders no link wrapper */
  url: string;
  image: ImageMetadata;
}

/**
 * Featured work.
 * [EDIT ME] every description below is a first draft — rewrite them in your own words,
 * fill in the real URLs, and correct any stacks I guessed.
 */
export const projects: Project[] = [
  {
    index: "01",
    name: "FCN Care",
    short: "Healthcare",
    description:
      "Healthcare platform for Dire Dawa — appointments, patient records, and the clinic workflows in between.",
    tags: ["[EDIT ME] stack"],
    url: "",
    image: fcnCare,
  },
  {
    index: "02",
    name: "LocalConnect",
    short: "Marketplace",
    description:
      "Local services marketplace connecting people in the neighbourhood with the hands that can help.",
    tags: ["Flutter", "Node.js"],
    url: "",
    image: localConnect,
  },
  {
    index: "03",
    name: "Gold Scalping Bot",
    short: "Trading",
    description:
      "Python + Streamlit + MetaTrader 5 bot that scalps gold (XAUUSD) with an AI strategy layer.",
    tags: ["Python", "Streamlit", "MT5"],
    url: "",
    image: goldBot,
  },
  {
    index: "04",
    name: "Mahad School Website",
    short: "Education",
    description:
      "Website for a local school — admissions, announcements, and a homepage parents can actually use.",
    tags: ["[EDIT ME] stack"],
    url: "",
    image: mahad,
  },
];
