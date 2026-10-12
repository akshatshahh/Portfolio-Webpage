import { TAGS, type Tag } from "./tags"

export interface Decision {
  title: string
  body: string
}

export interface FeaturedProject {
  slug: string
  title: string
  tagline: string
  summary: string
  context: string
  period: string
  live?: string
  github?: string
  tags: Tag[]
  highlights: string[]
  problem: string
  architecture: string[]
  decisions: Decision[]
  outcomes: string[]
  next: string[]
}

export interface Project {
  title: string
  description: string
  context?: string
  image?: string
  live?: string
  github?: string
  private?: boolean
  tags: Tag[]
}

export const FEATURED_PROJECTS: FeaturedProject[] = [
  {
    slug: "poi-game",
    title: "POI Game",
    tagline: "A gamified labeling platform that turns GPS visits into ML training data.",
    summary:
      "Players see a GPS visit on a map and pick the point of interest the person most likely visited. Independent answers are aggregated into locked, consensus-labeled training data for POI attribution research at USC IMSC.",
    context: "USC Integrated Media Systems Center (IMSC), with Dr. John Krumm",
    period: "2025 - 2026",
    live: "https://poi-game.vercel.app",
    github: "https://github.com/akshatshahh/POI-game",
    tags: [TAGS.REACT, TAGS.TYPESCRIPT, TAGS.FASTAPI, TAGS.POSTGIS, TAGS.OAUTH, TAGS.DOCKER],
    highlights: [
      "Consensus engine locks each question as labeled (with confidence) or ambiguous, so exported datasets are reproducible",
      "PostGIS + H3 spatial queries over the Overture Maps places catalog, seeded straight from S3 Parquet with DuckDB",
      "Google OAuth with CSRF state, HttpOnly JWT sessions, rate limiting and a Sybil gate on vote counting",
    ],
    problem:
      "Location research needs ground truth for which place a GPS visit belongs to, and that label is expensive to collect. Raw crowd answers are noisy, and a dataset is only useful for training if every label is traceable and stable once it is exported.",
    architecture: [
      "React 19 + Vite + Leaflet (Vercel)",
      "FastAPI, async SQLAlchemy, JWT in HttpOnly cookies (Render)",
      "PostgreSQL 16 + PostGIS on Neon, Overture Maps places",
      "Admin exports: raw annotations and consensus dataset (CSV / JSON)",
    ],
    decisions: [
      {
        title: "Consensus as a state machine",
        body: "Each question collects a base number of independent answers, escalates to a higher target when it is dense or contested, then locks as consensus_reached or no_consensus. Locked questions are immutable so exports never drift.",
      },
      {
        title: "Never leak the answer key",
        body: "Candidate POIs sent to the browser omit true distances. Only the server sees them, and they are kept as an ML covariate rather than used for scoring.",
      },
      {
        title: "Scoring that rewards quality",
        body: "Players earn base participation points plus a retroactive bonus when their pick matches the final consensus, and a difficulty bonus on dense questions.",
      },
      {
        title: "Safe account linking",
        body: "The Google callback requires a verified email and refuses to auto-link onto an existing password account, which closes an account takeover path.",
      },
    ],
    outcomes: [
      "Live in production on Vercel, Render and Neon",
      "H3 dedup stops players from re-labeling cells they already answered",
      "Pytest suite, Alembic migrations and a documented dev log",
    ],
    next: [
      "Active learning: route ambiguous questions to the most reliable players first",
      "Inter-annotator agreement metrics in the admin dashboard",
    ],
  },
  {
    slug: "local-events",
    title: "Local Events",
    tagline: "Find live events near you and reserve a spot with Stripe, without overselling.",
    summary:
      "A FastAPI service that searches live music events through the JamBase API, adds decision signals like distance, showtime and venue size, and handles paid reservations with Stripe Checkout and signed webhooks.",
    context: "Personal project",
    period: "Aug 2026",
    github: "https://github.com/akshatshahh/local-events",
    tags: [TAGS.PYTHON, TAGS.FASTAPI, TAGS.SQLALCHEMY, TAGS.POSTGRES, TAGS.STRIPE, TAGS.JAVASCRIPT],
    highlights: [
      "Capacity enforced in one conditional UPDATE, so two parallel holds can never both pass a count-then-insert check",
      "Stripe idempotency keys plus a unique webhook-event table make duplicate deliveries harmless",
      "Provider layer isolates failures: one dead upstream degrades results instead of failing the request",
    ],
    problem:
      "Event listings show a title and a date, which is not enough to decide whether to go. Reservations add a harder problem: payments arrive asynchronously, webhooks are retried, and concurrent buyers race for the last spots.",
    architecture: [
      "Vanilla JS client (no build step)",
      "FastAPI routes: parse, delegate, serialize",
      "Discovery service: fan-out, dedupe, rank, TTL cache",
      "Provider interface with JamBase client, mapper and retries",
      "Reservations: Postgres + Stripe Checkout + signed webhooks",
    ],
    decisions: [
      {
        title: "Provider seam",
        body: "Nothing above the providers package knows JamBase exists. Adding a second source is one line in the registry, and each provider's failure is reported per source instead of becoming a 500.",
      },
      {
        title: "Retries only where they help",
        body: "429s, 5xx and timeouts get exponential backoff. Other 4xx responses fail fast, and auth errors raise a distinct error because they are an operator problem.",
      },
      {
        title: "A small reservation state machine",
        body: "Only pending moves: to confirmed on checkout completion, to expired or canceled with capacity released. A late expiry on a confirmed row changes nothing.",
      },
      {
        title: "A live key cannot charge cards",
        body: "The process refuses to start if the Stripe key is not a test key, so a misconfigured deploy cannot take real payments.",
      },
    ],
    outcomes: [
      "31 offline tests covering oversell under parallel holds, duplicate webhooks, bad signatures and retry policy",
      "Interactive OpenAPI docs generated from the same Pydantic models that validate requests",
    ],
    next: [
      "Shared cache with stale-while-revalidate for multi-instance deploys",
      "Map view and a real geocoder for postal codes and neighborhoods",
    ],
  },
  {
    slug: "offline-interrogator",
    title: "The Offline Interrogator",
    tagline: "A local-first AI mock interviewer running on open-weight Gemma.",
    summary:
      "Pick DSA, behavioral or system design, answer one question at a time, ask for hints, and get a strict rubric-based report card. Difficulty adapts to your answers and topic history surfaces weak spots across sessions. All reasoning runs locally.",
    context: "Hacktoberfest 2026 Weekend Challenge: Build for a Friend",
    period: "Oct 2026",
    github: "https://github.com/akshatshahh/offline-interrogator",
    tags: [TAGS.TYPESCRIPT, TAGS.REACT, TAGS.EXPRESS, TAGS.OLLAMA, TAGS.MONGODB, TAGS.DOCKER],
    highlights: [
      "Gemma 3 4B through Ollama is the only reasoning model: no hosted LLM calls anywhere in the scoring path",
      "Scores validated against a strict Zod schema, with one retry on malformed model output",
      "Agent tracing in Sentry with model, latency and token counts per inference",
    ],
    problem:
      "Interview practice tools usually depend on paid cloud models and send your answers to a third party. A friend preparing for interviews needed something private, free to run and honest about weak spots.",
    architecture: [
      "React + Vite client with timer, hints and report card",
      "Express API running a deterministic interview loop",
      "Mastra tools for question, hint, scoring and storage",
      "Ollama serving Gemma 3 4B locally",
      "MongoDB Atlas (optional) for sessions, turns and question bank",
    ],
    decisions: [
      {
        title: "Deterministic loop, model-executed tools",
        body: "Express controls the sequence of question, score, adapt and next question. Mastra executes the registered tools, so no second model is needed just to decide which tool to call.",
      },
      {
        title: "Never fabricate a score",
        body: "Overall scores are computed from five rubric scores. Malformed JSON is retried once, and failures return an actionable error instead of a made-up number.",
      },
      {
        title: "Graceful degradation",
        body: "Atlas, ElevenLabs voice and Sentry are all optional. With none configured the app still runs fully offline and keeps history in memory.",
      },
      {
        title: "Concurrency guard",
        body: "Overlapping answer, hint and end requests on a session are rejected with 409, which prevents duplicate turns from double clicks.",
      },
    ],
    outcomes: [
      "One-command Docker Compose setup that pulls the model and starts the app",
      "Integration tests against a local Ollama protocol fixture plus a DOM test for the report card",
    ],
    next: [
      "Resume interrupted sessions",
      "Auth so it can be safely hosted for more than one person",
    ],
  },
]

export const MORE_PROJECTS: Project[] = [
  {
    title: "BudgetBoard",
    description:
      "Personal finance dashboard with portfolio intelligence: import holdings from CSV or Excel, track net worth, budgets and Splitwise-style shared expenses, and get real-time SignalR alerts when news hits stocks you own. ASP.NET Identity with refresh-token rotation, EF Core and a Quartz background job.",
    private: true,
    tags: [TAGS.DOTNET, TAGS.ANGULAR, TAGS.SIGNALR, TAGS.TYPESCRIPT, TAGS.DOCKER],
  },
  {
    title: "Secure Decentralized Audit System",
    description:
      "Audit-log system for electronic health records. Records are authenticated with JWT, integrity-tagged with HMAC-SHA256 and committed across three permissioned blockchain nodes by a BFT vote (2 of 3). Runs as a Docker Compose cluster with a design doc mapped to PBFT, Tendermint and HotStuff.",
    context: "USC CSCI 531, team of 2",
    private: true,
    tags: [TAGS.PYTHON, TAGS.FLASK, TAGS.DOCKER],
  },
  {
    title: "Deep Research Agent",
    description:
      "Research agent that decomposes complex questions into sub-queries and runs a Claude tool-use loop over web search and vector memory, all under a self-enforced $0.05 per-session budget and a 2,000-token context cap per sub-query. Degrades gracefully as the budget runs out.",
    private: true,
    tags: [TAGS.PYTHON, TAGS.FASTAPI, TAGS.CLAUDE, TAGS.CHROMA],
  },
  {
    title: "Trail Whisperer",
    description:
      "Offline trail companion: identify birds by sound with BirdNET and plants by photo with local Gemma, then revisit a timeline and lifelist at home. Optional basecamp adds MongoDB Atlas vector search over local embeddings.",
    context: "Hacktoberfest 2026",
    github: "https://github.com/akshatshahh/trail-whisperer",
    tags: [TAGS.PYTHON, TAGS.OLLAMA, TAGS.MONGODB, TAGS.DOCKER],
  },
  {
    title: "Northeast Corridor vs Fly Decider",
    description:
      "Tells you the smartest way to travel between two US cities (train, fly, drive or bus) with a confidence score and plain-English reasons. Gemini is called from a server-side API route so the key never reaches the client.",
    live: "https://northeast-corridor-vs-fly-decider.vercel.app",
    github: "https://github.com/akshatshahh/northeast-corridor-vs-fly-decider",
    tags: [TAGS.NEXT, TAGS.TYPESCRIPT, TAGS.TAILWIND, TAGS.GEMINI],
  },
  {
    title: "Clipboard Manager for macOS",
    description:
      "Lightweight native menu bar clipboard manager. It monitors the clipboard, keeps a searchable history and lets you pin frequently used items. Prebuilt app artifacts come from GitHub Actions.",
    image: "/projects/clipboard-manager.png",
    github: "https://github.com/akshatshahh/ClipboardManager",
    live: "https://github.com/akshatshahh/ClipboardManager/actions",
    tags: [TAGS.SWIFT],
  },
  {
    title: "Multilingual Self-Debugging Framework",
    description:
      "LLM self-debugging for Python and JavaScript inspired by LDB. Combines static control flow graph analysis with dynamic execution tracing for block-wise feedback, improving accuracy by 7% over baseline prompting on MBPP and MdEval.",
    image: "/projects/self-debugging-framework.png",
    live: "https://drive.google.com/file/d/1nxcaamAEiuMYY_BZTixaCZxWn5AIymnG/view?usp=share_link",
    tags: [TAGS.PYTHON, TAGS.JAVASCRIPT, TAGS.LLM],
  },
  {
    title: "Artist Search App",
    description:
      "Full stack app on the Artsy API: search artists, explore their artworks and view detailed profiles. Deployed on Google App Engine.",
    context: "USC CSCI 571",
    image: "/projects/artist-search-app.png",
    live: "https://artist-search-app.wl.r.appspot.com/",
    tags: [TAGS.NODE, TAGS.REACT, TAGS.TAILWIND],
  },
  {
    title: "Chase",
    description:
      "Browser-playable Unity WebGL game with physics-based interactions, enemy AI and dynamic level design.",
    context: "USC CSCI 526, team of 5",
    image: "/projects/chase-game.png",
    live: "https://davidzhang0710.github.io/CS526/Gold/index.html",
    tags: [TAGS.UNITY],
  },
  {
    title: "Brief Bytes",
    description:
      "News platform that scrapes articles and summarizes them with ML, with the option to open the full story.",
    context: "Team project",
    image: "/projects/briefbytes.png",
    live: "https://brief-bytes2.vercel.app",
    github: "https://github.com/Suthar-Naresh/brief-bytes",
    tags: [TAGS.SVELTE, TAGS.NODE, TAGS.TAILWIND],
  },
]
