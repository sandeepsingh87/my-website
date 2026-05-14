// ─────────────────────────────────────────────
//  LIBRARY CATALOG  —  library-data.js
//  Add a new entry object to the array below
//  every time you host a new HTML file.
// ─────────────────────────────────────────────

const LIBRARY = [
  {
    id: "atlassian-infrastructure-deep-dive",
    title: "Atlassian Infrastructure Deep Dive",
    category: "Session",
    date: "2026-05-14",
    duration: "40 min read",
    description: "How Atlassian built platform infrastructure for Jira, Confluence & Bitbucket at scale — Envoy proxies, self-service APIs, centralised auth, IaC, and platform engineering lessons from 8 years of real work.",
    tags: ["Platform Engineering", "Atlassian", "Cloud Infrastructure", "Envoy", "AWS"],
    file: "sessions/atlassian-training.html",
    featured: true
  },
  {
    id: "playwright-getting-started-2026",
    title: "Getting Started with Playwright in 2026",
    category: "Training",          // Training | Course | Session | Project | Workshop
    date: "2026-05-08",
    duration: "45 min read",
    description: "A practical intro to Playwright — covering installation, first test, selectors, assertions, and running tests in headed vs headless mode. Built for QE teams new to Playwright.",
    tags: ["Playwright", "Test Automation", "JavaScript", "E2E Testing"],
    file: "sessions/getting-started-with-playwright-2026.html",
    featured: true
  },
  {
    id: "ai-in-testing-overview",
    title: "AI in Testing — What QEs Need to Know",
    category: "Session",
    date: "2026-04-22",
    duration: "30 min read",
    description: "Session notes from an internal knowledge-sharing talk covering AI-assisted test generation, self-healing locators, and how LLMs are changing quality engineering workflows.",
    tags: ["AI", "Quality Engineering", "Automation", "GenAI"],
    file: "sessions/ai-in-testing-overview.html",
    featured: true
  },
  {
    id: "safe-agile-qe-role",
    title: "QE's Role in a SAFe Agile Program",
    category: "Course",
    date: "2026-03-10",
    duration: "1 hr read",
    description: "Deep dive into how quality engineering fits into SAFe — PI Planning, built-in quality, System Demo, and how QEs collaborate across ARTs. Based on SAFe 5 Practitioner coursework.",
    tags: ["SAFe", "Agile", "Quality Engineering", "PI Planning"],
    file: "sessions/safe-agile-qe-role.html",
    featured: false
  },
  {
    id: "api-testing-postman-restassured",
    title: "API Testing with Postman & RestAssured",
    category: "Workshop",
    date: "2026-02-14",
    duration: "50 min read",
    description: "Hands-on workshop material covering REST API fundamentals, Postman collections, environment variables, and Java-based RestAssured automation with assertion strategies.",
    tags: ["API Testing", "Postman", "RestAssured", "Java"],
    file: "sessions/api-testing-postman-restassured.html",
    featured: false
  },
  {
    id: "playwright-mcp-agentic-testing",
    title: "Playwright MCP — Agentic Test Automation",
    category: "Training",
    date: "2026-05-12",
    duration: "35 min read",
    description: "Exploring the Playwright MCP (Model Context Protocol) integration — how AI agents can drive browser automation, what it means for test maintenance, and live demo walkthrough.",
    tags: ["Playwright", "MCP", "AI", "Agentic Testing"],
    file: "sessions/playwright-mcp-agentic-testing.html",
    featured: true
  },
  {
    id: "test-strategy-fintech",
    title: "Building a Test Strategy for Fintech Products",
    category: "Project",
    date: "2026-01-20",
    duration: "40 min read",
    description: "Project learnings from building a QE strategy for a global payments platform — risk-based testing, regression pyramid, shift-left approach, and governance reporting.",
    tags: ["Test Strategy", "Fintech", "Risk-Based Testing", "QA Governance"],
    file: "sessions/test-strategy-fintech.html",
    featured: false
  },
  {
  id: "qe-is-not-just-testing",
  title: "Why Quality Engineering is Not Just Testing",
  category: "Session",   // Training | Course | Session | Project | Workshop
  date: "2026-05-14",
  duration: "30 min read",
  description: "Why Quality Engineering is Not Just Testing",
  tags: ["QE", "Testing", "Quality Assurance", "Quality Engineering"],
  file: "sessions/why-qe-is-not-just-testing.html",
  featured: true
  }
];
