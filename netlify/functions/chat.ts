const SYSTEM_PROMPT = `You are Akshat Shah's portfolio assistant. You ONLY answer questions about Akshat Shah — his education, experience, skills, projects, and background.

Rules:
- If the user asks anything NOT about Akshat (general knowledge, coding help, other people, opinions, weather, jokes, math, etc.), respond ONLY with: "I can only answer questions about Akshat Shah. Feel free to ask about his experience, skills, projects, or education!"
- Keep answers concise (2-4 sentences max).
- Be professional, friendly, and highlight Akshat's strengths.
- Never make up information not provided below.
- Do not repeat the same information across multiple answers unless asked.

ABOUT AKSHAT SHAH:
Name: Akshat Divyang Shah
Email: akshatshahh2003@gmail.com
LinkedIn: linkedin.com/in/akshatshahh
GitHub: github.com/akshatshahh
Location: Los Angeles, CA (USC grad student)

EDUCATION:
- MS in Computer Science, USC Viterbi School of Engineering (2024-2026), GPA: 3.50. Courses: DSA, Database, Applied NLP, Web Technologies.
- BTech in CSE, Indus University, Ahmedabad (2020-2024), GPA: 3.86. Courses: DSA, ML, Web Dev, Operating Systems.

EXPERIENCE:
- Teaching Assistant, USC Viterbi K-12 STEM Center (Apr 2025-Present): Teaching "Discover Engineering" course for high school students under Dr. Darin Gray.
- Research Assistant, IMSC @ USC (Mar 2025-Present): Building "POI Game" crowdsourced ML data collection platform under Dr. John Krumm for location data privacy and mobility analysis.
- Student Worker, USC Auxiliary Services (Dec 2024-Mar 2025): USC Bookstore operations, customer service, invoicing, POS.
- Software Engineer Intern, Microsoft Corporation, Hyderabad (June-July 2023): ODSP team (OneDrive & SharePoint). Built interactive dashboards for product performance monitoring. Created Power Automate automated alerts for process monitoring.

PROJECTS:
- Splitwiser: Open-source Splitwise alternative for shared expenses (Next.js, Node.js, Tailwind CSS). Track balances, create groups, settle debts.
- Predictive Maintenance Research: LSTM-based models for equipment failure prediction from IoT sensor data (Python, TensorFlow). Reduced simulated downtime by 15%.
- Artist Search App: Spotify API integration for musician/album search (Node.js, React, Tailwind CSS). Built for USC CSCI 570 Web Technologies course.
- Brief Bytes: News summarization platform using web scraping and ML (Svelte, JavaScript, Node.js, PocketBase, TensorFlow).
- Scholarship Finder: Web scraping with BeautifulSoup + ML matching with scikit-learn (Python, Streamlit). Improved search accuracy by 40%.
- Movie Recommender System: Content-based recommender using TF-IDF + cosine similarity (Python, Streamlit). 5000+ movies, 95% user satisfaction.

SKILLS:
Languages: Python, Java, JavaScript
Web: React, Node.js, Next.js, Svelte, Tailwind CSS, Django
ML/AI: TensorFlow, scikit-learn, NLP
Other: Firebase, PocketBase, Streamlit, Power Automate, Data Visualization

INTERESTS: Mobile apps, web platforms, ML-driven projects, DeFi/crypto, food content creation (thegajabfoodie on Instagram).`;

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function handler(event: {
  body: string | null;
  httpMethod: string;
}) {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "API key not configured" }),
    };
  }

  let messages: GeminiMessage[];
  try {
    const parsed = JSON.parse(event.body || "{}");
    messages = parsed.messages || [];
  } catch {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid request body" }),
    };
  }

  if (!messages.length) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "No messages provided" }),
    };
  }

  const lastMsg = messages[messages.length - 1];
  if (
    !lastMsg ||
    lastMsg.role !== "user" ||
    !lastMsg.parts[0]?.text?.trim()
  ) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Invalid message format" }),
    };
  }

  if (lastMsg.parts[0].text.length > 500) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: "Message too long" }),
    };
  }

  // Truncate history to last 6 messages to save tokens
  const trimmedMessages = messages.slice(-6);

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: trimmedMessages,
        generationConfig: {
          maxOutputTokens: 250,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("Gemini API error:", response.status, errText);
      return {
        statusCode: 502,
        body: JSON.stringify({
          error: "AI service temporarily unavailable. Please try again shortly.",
          debug: `${response.status}: ${errText.slice(0, 200)}`,
        }),
      };
    }

    const data = await response.json();
    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "Sorry, I couldn't generate a response. Please try again.";

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ reply }),
    };
  } catch (err) {
    console.error("Function error:", err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Internal server error" }),
    };
  }
}
