export interface SocialLink {
  label: string;
  url: string;
}

export interface Site {
  name: string;
  firstName: string;
  lastName: string;
  location: string;
  role: string;
  tagline: string;
  email: string;
  links: SocialLink[];
  status: string;
}

/**
 * All page copy lives here. Edit values directly — components read from this file.
 */
export const site: Site = {
  name: "Muhammad Abdulfgefar",
  firstName: "Muhammad",
  lastName: "Abdulfgefar",
  location: "Dire Dawa, Ethiopia",
  role: "Software Engineering student & full-stack developer",
  // [EDIT ME] tweak your tagline here
  tagline: "Founder-developer shipping live products for Ethiopia, and breaking them on purpose to make them safer.",
  email: "wealthyempire13@gmail.com",
  links: [
    { label: "GitHub", url: "https://github.com/Algo-chan" },
    {
      label: "LinkedIn",
      url: "https://www.linkedin.com/in/muhammad-abdulgefar-61921a409?trk=contact-info",
    },
    { label: "Telegram", url: "https://t.me/M_Slick" },
  ],
  // [EDIT ME] change this if you are not looking for internships/collabs right now
  status: "Open to internships & collaborations",
};
