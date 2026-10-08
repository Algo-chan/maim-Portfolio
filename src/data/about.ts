export interface NowItem {
  key: string;
  value: string;
}

export interface About {
  label: string;
  headline: string;
  /** Substrings of `headline` rendered as .text-highlight spans (scrub to #990900) */
  highlights: string[];
  paragraphs: string[];
  now: NowItem[];
}

/**
 * About section copy.
 */
export const about: About = {
  label: "About",
  headline: "I build real products from Dire Dawa — and students can ship too.",
  highlights: ["Dire Dawa", "students can ship too"],
  paragraphs: [
    "I'm a software engineering student at Dire Dawa University doing what textbooks only describe: shipping with a team, arguing about schemas, and deploying at 2 a.m. because that's when the bug finally made sense.",
    "Most of my time goes into full-stack work — Flutter and Node.js for LocalConnect, Python and Streamlit for a gold scalping bot, and whatever else the problem asks for. I'm part of a startup team, which is a fancy way of saying I wear three hats and regularly lose all of them.",
    "Lately I've gone deeper on security: Hack The Box Academy boxes, write-ups, and the occasional humbling moment when the machine owns me first. I'm a student, so this page has no fake metrics — just things I've built and things I'm still figuring out.",
  ],
  now: [
    { key: "Based", value: "Dire Dawa, Ethiopia" },
    { key: "Studying", value: "Software Engineering, Dire Dawa University" },
    { key: "Building", value: "Startups, side projects, trading bots" },
    { key: "Learning", value: "Cybersecurity · Hack The Box Academy" },
    { key: "Status", value: "[EDIT ME] open to internships & collabs" },
  ],
};
