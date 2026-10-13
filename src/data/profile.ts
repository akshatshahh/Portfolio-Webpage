import { TAGS, type Tag } from "./tags"

/** One source of truth for who Akshat is: used by the page, structured data and llms.txt. */
export const PROFILE = {
  name: "Akshat Shah",
  fullName: "Akshat Divyang Shah",
  titles: ["Software Engineer", "AI Engineer"],
  headline: "Software Engineer · AI Engineer · Backend & Full Stack",
  summary:
    "Software Engineer and AI Engineer in Los Angeles. Builds backend services, full stack apps and LLM agents; Software Engineer at USC IMSC, previously a Software Engineer Intern at Microsoft; MS in Computer Science from USC (2026).",
  location: { city: "Los Angeles", region: "CA", country: "US" },
  relocation: "Open to relocating anywhere in the US",
  lookingFor: ["Software Engineer", "AI Engineer", "Backend Engineer", "Full Stack Engineer"],
  email: "akshatshahh2003@gmail.com",
  site: "https://akshatshah.tech",
  github: "https://github.com/akshatshahh",
  linkedin: "https://www.linkedin.com/in/akshatshahh",
  employer: { name: "Integrated Media Systems Center (IMSC), University of Southern California", url: "https://imsc.usc.edu" },
  education: [
    { name: "University of Southern California", degree: "MS, Computer Science", year: 2026 },
    { name: "Indus University", degree: "BTech, Computer Science and Engineering", year: 2024 },
  ],
}

export interface SkillGroup {
  name: string
  tags: Tag[]
}

export const SKILL_GROUPS: SkillGroup[] = [
  {
    name: "AI & LLM engineering",
    tags: [TAGS.CLAUDE, TAGS.GEMINI, TAGS.OPENAI, TAGS.LANGCHAIN, TAGS.LITELLM, TAGS.MCP, TAGS.MASTRA, TAGS.OLLAMA, TAGS.RAG, TAGS.CHROMA, TAGS.HUGGINGFACE, TAGS.PYDANTIC],
  },
  {
    name: "Machine learning",
    tags: [TAGS.PYTORCH, TAGS.TENSORFLOW, TAGS.SKLEARN, TAGS.PANDAS, TAGS.NUMPY, TAGS.JUPYTER, TAGS.OPENCV, TAGS.SAGEMAKER, TAGS.CUDA],
  },
  {
    name: "Languages",
    tags: [TAGS.PYTHON, TAGS.TYPESCRIPT, TAGS.JAVASCRIPT, TAGS.JAVA, TAGS.KOTLIN, TAGS.CSHARP, TAGS.SWIFT_LANG, TAGS.CPP, TAGS.SQL],
  },
  {
    name: "Backend & APIs",
    tags: [TAGS.FASTAPI, TAGS.NODE, TAGS.EXPRESS, TAGS.SPRING, TAGS.DJANGO, TAGS.FLASK, TAGS.GRAPHQL, TAGS.ZOD, TAGS.POSTMAN],
  },
  {
    name: "Frontend & mobile",
    tags: [TAGS.REACT, TAGS.NEXT, TAGS.ANGULAR, TAGS.SVELTE, TAGS.TAILWIND, TAGS.HTML, TAGS.REACT_NATIVE, TAGS.ANDROID, TAGS.SWIFT, TAGS.UNITY],
  },
  {
    name: "Data & cloud",
    tags: [TAGS.POSTGIS, TAGS.MONGODB, TAGS.MYSQL, TAGS.REDIS, TAGS.SQLITE, TAGS.AWS, TAGS.GCP, TAGS.DOCKER, TAGS.KUBERNETES, TAGS.GITHUB_ACTIONS, TAGS.VERCEL, TAGS.NETLIFY],
  },
]

/** Flat, de-duplicated skill names for structured data and llms.txt. */
export const ALL_SKILLS = [...new Set(SKILL_GROUPS.flatMap((g) => g.tags.map((t) => t.name)))]
