// Text of public/Akshat-Shah-Resume.pdf, rendered on /resume so search engines and AI
// assistants can read it (the page itself shows an image of the PDF).
// Keep in sync when the PDF changes. The phone number is intentionally omitted.

export interface ResumeEntry {
  title: string
  meta?: string
  date?: string
  points: string[]
}

export const RESUME = {
  name: "Akshat Shah",
  contact: "akshatdi@usc.edu · linkedin.com/in/akshatshahh · github.com/akshatshahh · akshatshah.netlify.app",
  tagline: "Software Engineer · Open to Relocation",
  sections: [
    {
      heading: "Education",
      entries: [
        {
          title: "University of Southern California",
          meta: "Master of Science in Computer Science (GPA: 3.66/4.00)",
          date: "Aug 2024 - May 2026",
          points: ["Relevant Coursework: Analysis of Algorithms, Database Management Systems, Applied NLP, Web Development"],
        },
        {
          title: "Indus University",
          meta: "Bachelor of Technology in Computer Science (GPA: 3.86/4.00)",
          date: "Sep 2020 - May 2024",
          points: ["Relevant Coursework: Machine Learning, Operating Systems, Computer Networks, Object-Oriented Programming"],
        },
      ],
    },
    {
      heading: "Experience",
      entries: [
        {
          title: "Software Engineer, Integrated Media Systems Center (USC)",
          date: "Mar 2025 - Present",
          points: [
            "Design and deploy async Python FastAPI microservices powering a scalable real-time geospatial platform for 500+ daily active users, reducing average endpoint response latency by 35% through async programming over a synchronous baseline",
            "Integrate Google OAuth 2.0 and JWT authentication into a distributed microservices architecture with structured error handling, securing all RESTful service endpoints with high availability and zero reported authentication failures",
            "Optimize PostgreSQL 16 PostGIS spatial indexes and H3 geospatial indexing to reduce query latency by 40%, supporting reliable ingestion of 10k+ daily user submissions into partitioned PostgreSQL tables without dropped writes",
          ],
        },
        {
          title: "Software Engineer Intern, Microsoft",
          date: "Jun 2023 - Jul 2023",
          points: [
            "Built KQL and Azure Data Explorer dashboards tracking end-to-end latency for Word, Excel, and PowerPoint across browser and Teams surfaces, enabling production observability and system design insights for a platform serving 85M+ MAU",
            "Reduced manual performance monitoring overhead by 60% by building automated monitoring pipelines integrated into CI/CD workflows that evaluated latency thresholds and flagged regressions across production environments daily",
            "Delivered 8 dashboards with P50/P75/P95 percentile views, component-level latency breakdowns, and farm comparisons, enabling engineers to identify concurrency bottlenecks and scalability regressions toward a sub-5-second document load target",
          ],
        },
      ],
    },
    {
      heading: "Projects",
      entries: [
        {
          title: "SmartInventory: AI-Based Demand Forecasting Platform",
          meta: "Python, AWS SageMaker, Node.js, React.js, PostgreSQL, Docker",
          points: [
            "Created a functional demand forecasting prototype with AWS SageMaker models and a Node.js REST API, delivering dynamic inventory predictions for 5k+ products across categories",
            "Devised React-based admin dashboards and PostgreSQL-backed data pipelines for monitoring forecast accuracy and sales trends, achieving a 28% improvement in restocking efficiency through automated alerts and demand insights",
          ],
        },
        {
          title: "Brief Bytes: AI News Summary",
          meta: "Node.js, TensorFlow, Svelte, REST APIs, Vercel",
          points: [
            "Built a functional AI news prototype using TensorFlow summarization, a Node.js REST API and Svelte, serving real-time articles across 5 categories with summary and full-read modes on Vercel",
            "Integrated a TensorFlow NLP summarization pipeline with the Node.js backend and Svelte frontend on Vercel, surfacing key article takeaways in seconds across feeds and reducing reader time-to-insight through an AI workflow",
          ],
        },
        {
          title: "VisionVault: Intelligent Document Parser",
          meta: "PyTorch, OCR, OpenCV, Flask, Docker, MongoDB",
          points: [
            "Built a scalable document-understanding platform combining OCR and a fine-tuned LayoutLM transformer model to extract structured fields from unformatted PDFs and images with 94% accuracy, validated through unit testing across 10k+ samples",
            "Developed REST APIs and containerized deployment using Flask and Docker for enterprise integration, enabling parallel batch processing of 10k+ files and reducing manual data-entry time by 70%",
          ],
        },
        {
          title: "Personalized Video Recommendation Platform",
          meta: "React Native, Node.js, TensorFlow, AWS S3, CloudFront, PostgreSQL",
          points: [
            "Engineered a personalized video recommendation workflow integrating a TensorFlow collaborative filtering model with a Node.js backend and PostgreSQL, delivering real-time suggestions that improved simulated watch-time by 35%",
            "Developed a cross-platform React Native interface and integrated AWS S3 and CloudFront for secure, low-latency video streaming, packaging the prototype as an end-to-end application and optimizing content delivery performance.",
          ],
        },
      ],
    },
    {
      heading: "Leadership",
      entries: [
        {
          title: "Lead Teaching Assistant, USC Viterbi K-12 STEM Center",
          date: "Apr 2025 - Jul 2025",
          points: [
            "Directed a team of 8 teaching assistants to deliver a month-long 3-unit engineering course covering algorithms, data structures, and software engineering principles for 60+ students, resulting in a 95% positive feedback rating",
          ],
        },
      ],
    },
    {
      heading: "Technical Skills",
      entries: [
        {
          title: "",
          points: [
            "AI/ML & Data Systems: PyTorch, TensorFlow, AWS SageMaker, CUDA",
            "Languages: Python, Java, TypeScript, JavaScript, C++, SQL",
            "Backend & APIs: Spring Boot, Node.js, Express, FastAPI, Flask, REST APIs, GraphQL",
            "Cloud, DevOps & Databases: AWS (EC2, S3, Lambda), Docker, Kubernetes, GitHub Actions, PostgreSQL, MongoDB, Redis",
            "Frontend: React.js, React Native, Next.js, Redux, Tailwind CSS, HTML, CSS",
          ],
        },
      ],
    },
  ] as { heading: string; entries: ResumeEntry[] }[],
}
