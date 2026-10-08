export type IconKey = "react" | "typescript" | "node" | "flutter" | "python";

export interface Skill {
  /** Uppercase label shown under the icon */
  label: string;
  /** Key matching an inline SVG glyph in TechStrip.astro */
  icon: IconKey;
}

/**
 * Hero tech strip — 5 items.
 * [EDIT ME] confirm these match your actual core stack, then delete this note.
 */
export const skills: Skill[] = [
  { label: "React JS", icon: "react" },
  { label: "TypeScript", icon: "typescript" },
  { label: "Node JS", icon: "node" },
  { label: "Flutter", icon: "flutter" },
  { label: "Python", icon: "python" },
];
