export interface Experience {
  /** Displayed as 01, 02, ... */
  index: string;
  /** [EDIT ME] role or company name */
  name: string;
  /** [EDIT ME] e.g. "Jun 2026 — Present" */
  date: string;
  /** [EDIT ME] one-liner about the role */
  description: string;
  /** [EDIT ME] comma-separated stack / tools */
  tech: string;
}

/**
 * Experience entries shown under the Experience stack.
 * All values are [EDIT ME] placeholders — replace them with your actual roles
 * before going live. Keep this honest: no invented employment.
 */
export const experiences: Experience[] = [
  {
    index: "01",
    name: "[EDIT ME] Role @ Company",
    date: "[EDIT ME]",
    description: "[EDIT ME] What you actually did, shipped, or fixed in this role.",
    tech: "[EDIT ME] stack",
  },
  {
    index: "02",
    name: "[EDIT ME] Role @ Project",
    date: "[EDIT ME]",
    description: "[EDIT ME] The problem you solved, the team you wore, the result.",
    tech: "[EDIT ME] stack",
  },
  {
    index: "03",
    name: "[EDIT ME] Open-source / volunteer",
    date: "[EDIT ME]",
    description: "[EDIT ME] Side work or community work you want to highlight.",
    tech: "[EDIT ME] stack",
  },
];