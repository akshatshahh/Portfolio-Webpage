import {
  siAndroid,
  siAngular,
  siClaude,
  siCplusplus,
  siCss,
  siDjango,
  siDocker,
  siDotnet,
  siExpress,
  siFastapi,
  siFlask,
  siGithubactions,
  siGooglecloud,
  siGooglegemini,
  siGraphql,
  siHtml5,
  siHuggingface,
  siJavascript,
  siJupyter,
  siKotlin,
  siKubernetes,
  siLangchain,
  siModelcontextprotocol,
  siMongodb,
  siMysql,
  siNetlify,
  siNextdotjs,
  siNodedotjs,
  siNumpy,
  siNvidia,
  siOllama,
  siOpenai,
  siOpencv,
  siOpenjdk,
  siPandas,
  siPostgresql,
  siPostman,
  siPydantic,
  siPython,
  siPytorch,
  siReact,
  siRedis,
  siScikitlearn,
  siSpringboot,
  siSqlalchemy,
  siSqlite,
  siStripe,
  siSvelte,
  siSwift,
  siTailwindcss,
  siTensorflow,
  siTypescript,
  siUnity,
  siVercel,
  siZod,
} from "simple-icons"

export interface Tag {
  name: string
  /** 24x24 SVG path */
  path: string
  /** Icon color on light backgrounds */
  light: string
  /** Icon color on dark backgrounds */
  dark: string
}

function luminance(hex: string): number {
  const [r, g, b] = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

/** Mix a hex color toward white so dark brand colors stay visible on dark cards. */
function lighten(hex: string, amount: number): string {
  const mixed = [0, 2, 4].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16)
    return Math.round(c + (255 - c) * amount).toString(16).padStart(2, "0")
  })
  return `#${mixed.join("")}`
}

function tag(name: string, path: string, hex?: string): Tag {
  if (!hex) return { name, path, light: "currentColor", dark: "currentColor" }
  const lum = luminance(hex)
  return {
    name,
    path,
    // Near-white logos disappear on light chips, near-black ones on dark chips.
    light: lum > 0.8 ? "currentColor" : `#${hex}`,
    dark: lum < 0.03 ? "currentColor" : lum < 0.15 ? lighten(hex, 0.45) : `#${hex}`,
  }
}

const brand = (name: string, icon: { path: string; hex: string }, hex = icon.hex) => tag(name, icon.path, hex)

// Neutral glyphs for things without a brand logo.
const GENERIC = {
  bolt: "M11 15H6l7-14v8h5l-7 14z",
  database:
    "M12 3C7.58 3 4 4.79 4 7s3.58 4 8 4 8-1.79 8-4-3.58-4-8-4M4 9v3c0 2.21 3.58 4 8 4s8-1.79 8-4V9c0 2.21-3.58 4-8 4s-8-1.79-8-4m0 5v3c0 2.21 3.58 4 8 4s8-1.79 8-4v-3c0 2.21-3.58 4-8 4s-8-1.79-8-4z",
  key: "M7 14a2 2 0 1 1 0-4 2 2 0 0 1 0 4m5.65-4A6 6 0 1 0 12.65 14H17v4h4v-4h2v-4z",
  cloud: "M6.5 19a4.5 4.5 0 0 1-.42-8.98A6 6 0 0 1 17.7 8.6 5 5 0 0 1 17.5 19z",
  sparkles:
    "M19 1l-1.26 2.75L15 5l2.74 1.26L19 9l1.25-2.74L23 5l-2.75-1.25M9 4L6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5M19 15l-1.26 2.74L15 19l2.74 1.25L19 23l1.25-2.75L23 19l-2.75-1.26",
}

export const TAGS = {
  NEXT: brand("Next.js", siNextdotjs),
  TAILWIND: brand("Tailwind CSS", siTailwindcss),
  REACT: brand("React", siReact, "149ECA"),
  PYTHON: brand("Python", siPython),
  NODE: brand("Node.js", siNodedotjs),
  JAVASCRIPT: brand("JavaScript", siJavascript, "E5C100"),
  TYPESCRIPT: brand("TypeScript", siTypescript),
  SVELTE: brand("Svelte", siSvelte),
  UNITY: brand("Unity", siUnity),
  FASTAPI: brand("FastAPI", siFastapi),
  POSTGRES: brand("PostgreSQL", siPostgresql),
  POSTGIS: brand("PostgreSQL + PostGIS", siPostgresql),
  SQLALCHEMY: brand("SQLAlchemy", siSqlalchemy),
  STRIPE: brand("Stripe", siStripe),
  DOCKER: brand("Docker", siDocker),
  OLLAMA: brand("Ollama + Gemma", siOllama),
  MONGODB: brand("MongoDB Atlas", siMongodb),
  EXPRESS: brand("Express", siExpress),
  SWIFT: brand("SwiftUI", siSwift),
  DOTNET: brand(".NET 10", siDotnet),
  ANGULAR: brand("Angular", siAngular, "DD0031"),
  CLAUDE: brand("Claude API", siClaude),
  GEMINI: brand("Gemini API", siGooglegemini),
  FLASK: brand("Flask", siFlask),
  JAVA: brand("Java", siOpenjdk, "ED8B00"),
  KOTLIN: brand("Kotlin", siKotlin),
  SWIFT_LANG: brand("Swift", siSwift),
  CSHARP: brand("C#", siDotnet),
  CPP: brand("C++", siCplusplus),
  SQL: brand("SQL", siPostgresql),
  SPRING: brand("Spring Boot", siSpringboot),
  DJANGO: brand("Django", siDjango),
  GRAPHQL: brand("GraphQL", siGraphql),
  POSTMAN: brand("Postman", siPostman),
  HTML: brand("HTML5", siHtml5),
  CSS: brand("CSS", siCss),
  REACT_NATIVE: brand("React Native", siReact, "149ECA"),
  ANDROID: brand("Android", siAndroid),
  MYSQL: brand("MySQL", siMysql),
  REDIS: brand("Redis", siRedis),
  SQLITE: brand("SQLite", siSqlite),
  AWS: tag("AWS", GENERIC.cloud),
  GCP: brand("Google Cloud", siGooglecloud),
  KUBERNETES: brand("Kubernetes", siKubernetes),
  GITHUB_ACTIONS: brand("GitHub Actions", siGithubactions),
  VERCEL: brand("Vercel", siVercel),
  NETLIFY: brand("Netlify", siNetlify),
  OPENAI: brand("OpenAI-compatible APIs", siOpenai),
  LANGCHAIN: brand("LangChain", siLangchain),
  LITELLM: tag("LiteLLM", GENERIC.sparkles),
  MASTRA: tag("Mastra", GENERIC.sparkles),
  MCP: brand("MCP", siModelcontextprotocol),
  HUGGINGFACE: brand("Hugging Face", siHuggingface),
  RAG: tag("RAG & vector search", GENERIC.database),
  PYDANTIC: brand("Pydantic", siPydantic),
  ZOD: brand("Zod", siZod),
  PYTORCH: brand("PyTorch", siPytorch),
  TENSORFLOW: brand("TensorFlow", siTensorflow),
  SKLEARN: brand("scikit-learn", siScikitlearn),
  PANDAS: brand("Pandas", siPandas),
  NUMPY: brand("NumPy", siNumpy),
  JUPYTER: brand("Jupyter", siJupyter),
  OPENCV: brand("OpenCV", siOpencv),
  SAGEMAKER: tag("AWS SageMaker", GENERIC.cloud),
  CUDA: brand("CUDA", siNvidia),
  SIGNALR: tag("SignalR", GENERIC.bolt),
  CHROMA: tag("ChromaDB", GENERIC.database),
  OAUTH: tag("OAuth 2.0", GENERIC.key),
  LLM: tag("LLMs", GENERIC.sparkles),
} satisfies Record<string, Tag>
