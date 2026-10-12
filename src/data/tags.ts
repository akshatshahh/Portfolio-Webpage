import NextJS from "@/components/icons/NextJS.astro"
import Tailwind from "@/components/icons/Tailwind.astro"
import ReactJS from "@/components/icons/ReactJS.astro"
import Python from "@/components/icons/Python.astro"
import Node from "@/components/icons/Node.astro"
import Javascript from "@/components/icons/Javascript.astro"
import Svelte from "@/components/icons/Svelte.astro"
import Unity from "@/components/icons/Unity.astro"

export interface Tag {
  name: string
  class: string
  icon?: (props: Record<string, unknown>) => unknown
}

export const TAGS = {
  NEXT: { name: "Next.js", class: "bg-black text-white", icon: NextJS },
  TAILWIND: { name: "Tailwind CSS", class: "bg-[#003159] text-white", icon: Tailwind },
  REACT: { name: "React", class: "bg-blue-600 text-white", icon: ReactJS },
  PYTHON: { name: "Python", class: "bg-[#3776AB] text-white", icon: Python },
  NODE: { name: "Node.js", class: "bg-[#68A063] text-white", icon: Node },
  JAVASCRIPT: { name: "JavaScript", class: "bg-[#f7df1e] text-black", icon: Javascript },
  SVELTE: { name: "Svelte", class: "bg-[#ff3e00] text-white", icon: Svelte },
  UNITY: { name: "Unity", class: "bg-[#222C37] text-white", icon: Unity },
  TYPESCRIPT: { name: "TypeScript", class: "bg-[#3178c6] text-white" },
  FASTAPI: { name: "FastAPI", class: "bg-[#009688] text-white" },
  POSTGRES: { name: "PostgreSQL", class: "bg-[#336791] text-white" },
  POSTGIS: { name: "PostGIS", class: "bg-[#2b5f8a] text-white" },
  SQLALCHEMY: { name: "SQLAlchemy", class: "bg-[#7a1d1d] text-white" },
  STRIPE: { name: "Stripe", class: "bg-[#635bff] text-white" },
  DOCKER: { name: "Docker", class: "bg-[#2496ed] text-white" },
  OLLAMA: { name: "Ollama + Gemma", class: "bg-gray-700 text-white" },
  MONGODB: { name: "MongoDB Atlas", class: "bg-[#13aa52] text-white" },
  EXPRESS: { name: "Express", class: "bg-gray-800 text-white" },
  SWIFT: { name: "SwiftUI", class: "bg-[#f05138] text-white" },
  DOTNET: { name: ".NET 10", class: "bg-[#512bd4] text-white" },
  ANGULAR: { name: "Angular", class: "bg-[#dd0031] text-white" },
  SIGNALR: { name: "SignalR", class: "bg-[#4b2c91] text-white" },
  CLAUDE: { name: "Claude API", class: "bg-[#c96442] text-white" },
  GEMINI: { name: "Gemini API", class: "bg-[#1a73e8] text-white" },
  FLASK: { name: "Flask", class: "bg-gray-800 text-white" },
  CHROMA: { name: "ChromaDB", class: "bg-[#ff6446] text-white" },
  PLAYWRIGHT: { name: "Playwright", class: "bg-[#2ead33] text-white" },
  OAUTH: { name: "OAuth 2.0", class: "bg-gray-600 text-white" },
  LLM: { name: "LLMs", class: "bg-purple-700 text-white" },
} satisfies Record<string, Tag>
