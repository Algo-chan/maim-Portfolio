export interface FooterContact {
  /** [EDIT ME] your real address — used for the mailto fallback and the copy button */
  email: string;
  /** [EDIT ME] full profile URLs */
  github: string;
  linkedin: string;
  telegram: string;
  /** Shown next to the live clock. */
  location: string;
  /** IANA time zone for the live clock. */
  timeZone: string;
}

/**
 * Footer contact details. Every value below is a placeholder — replace each
 * `[EDIT ME]` with the real link. The component reads only from this file.
 */
export const footerContact: FooterContact = {
  email: "wealthyempire13@gmail.com",
  github: "https://github.com/Algo-chan",
  linkedin: "https://www.linkedin.com/in/muhammad-abdulgefar-61921a409?trk=contact-info",
  telegram: "https://t.me/M_Slick",
  location: "Dire Dawa",
  timeZone: "Africa/Addis_Ababa",
};
