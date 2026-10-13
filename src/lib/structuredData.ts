import { ALL_SKILLS, PROFILE } from "@/data/profile"

const PERSON_ID = `${PROFILE.site}/#person`

/** schema.org Person: what search engines and AI assistants read to know who this is. */
export function personSchema() {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PROFILE.name,
    alternateName: PROFILE.fullName,
    jobTitle: PROFILE.titles,
    description: PROFILE.summary,
    url: PROFILE.site,
    image: `${PROFILE.site}/og.jpg`,
    email: `mailto:${PROFILE.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: PROFILE.location.city,
      addressRegion: PROFILE.location.region,
      addressCountry: PROFILE.location.country,
    },
    worksFor: { "@type": "Organization", name: PROFILE.employer.name, url: PROFILE.employer.url },
    alumniOf: PROFILE.education.map((e) => ({ "@type": "CollegeOrUniversity", name: e.name })),
    knowsAbout: ALL_SKILLS,
    seeks: { "@type": "Demand", description: `${PROFILE.lookingFor.join(", ")} roles. ${PROFILE.relocation}.` },
    sameAs: [PROFILE.github, PROFILE.linkedin],
  }
}

/** The homepage describes a person, so it is a ProfilePage whose main entity is the Person. */
export function profilePageSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: `${PROFILE.site}/`,
    mainEntity: personSchema(),
  }
}

export function pageSchema(url: string, name: string, description: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    url,
    name,
    description,
    about: { "@id": PERSON_ID },
    author: personSchema(),
  }
}
