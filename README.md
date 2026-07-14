# 🚀 Docs-First AI Boilerplate

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

_(🇻🇳 [Đọc bản tiếng Việt](README.vi.md))_

Welcome to the **Docs-First AI Boilerplate**! This is a Template Repository
specifically designed following the **"Documentation-First, Code Later"**
philosophy, optimized for workflows combining AI Agents and Domain-Driven Design
(DDD).

## 📸 Demo & Screenshots

> _Put your awesome screenshots or a quick GIF demo here showing what the
> project looks like or how it works!_
>
> ![Demo Placeholder](https://via.placeholder.com/800x400.png?text=Your+App+Screenshot+Here)

## 🌟 Features

- **Tech-Agnostic:** Completely independent of any specific technology stack.
  Can be used as a foundation for Web (React/Node), Mobile, AI, or Desktop app
  projects.
- **AI-Ready:** Includes built-in `.agents/` and `.ai/` directories containing
  rules and standard workflows for AI to understand context and program within
  your framework.
- **Bilingual Documentation:** All documentation files come with Bilingual
  (EN/VI) placeholders.
- **Strict Quality Control:** Automatically enforces text and code formatting
  with `Husky`, `Prettier`, and `Markdownlint` before every commit.

---

## 📂 System Directory Structure

```text
├── .agents/       # Global rules and skills specifically for AI Agents
├── .ai/           # Workflows and system prompts guiding the AI
├── docs/          # System-level documentation (BRD, PRD, Architecture)
├── modules/       # Detailed analysis and design for individual Features/Domains
├── graph/         # Project structure visualization (Document relationship network)
├── src/           # Source code directory (Created when you start coding)
├── package.json   # Linting & formatting configuration (Prettier, Husky, Lint)
└── branching-strategy.md # Git branching strategy and workflow for managing technology stacks
```

---

## 🔄 Standard Workflow

To ensure the system (and AI) coordinate most effectively, you **MUST** follow
this rule: **Do not write code without clear documentation.**

Below is the step-by-step workflow for every project:

### Step 1: Project Initialization

1. **Clone Repo:** Initialize a new project from this template.

   ```bash
   git clone https://github.com/your-username/your-project-name.git
   cd your-project-name
   ```

2. **Install Tools:** Activate the automatic error checking system (Husky,
   Prettier, Markdownlint).

   ```bash
   # Make sure you have Node.js installed (v18+)
   npm install
   ```

3. **Create Branch:** From the `main` branch (which contains documentation),
   branch out to the technology stack you intend to use.

   ```bash
   git checkout -b base-react
   # or
   git checkout -b base-nestjs
   ```

### Step 2: High-Level Requirements Specification (Project Level)

Before diving into details, go to the `docs/` directory to define the big
picture of your project. Ensure **NO FILE IS LEFT EMPTY** in the following
directories:

- **`docs/project/` (Project Foundation):**
  - `vision.md`: Defines the Vision, mission, and core values of the entire
    project.
  - `tech-stack.md`: Declares the list of Technologies, languages, and libraries
    to be used.
  - `project-structure.md`: A diagram explaining the actual source code
    directory structure.
  - `glossary.md`: A dictionary explaining specialized terminology used in the
    project.
  - `status.md`: Tracks current progress, versioning, and system status.
  - `metadata-schema.md`: Rules for identification (ID) and Metadata structure
    for all documents.

- **`docs/requirements/` (Business Requirements):**
  - `brd.md`: Business Requirements Document (Objectives, scope, target
    audience).
  - `prd.md`: Product Requirements Document (Detailed features, User Stories).
  - `rtm.md`: Requirements Traceability Matrix (Ensures code meets design).

- **`docs/architecture/` (System Architecture):**
  - `architecture.md`: Overall system architecture design (Frontend, Backend,
    Cloud).
  - `database.md`: Database structure and ERD.
  - `api.md`: Standards and list of system-level network protocols.

- **`docs/analysis/` (Detailed Analysis):**
  - `business-rules.md`: Declares strict Business Rules that must be followed.
  - `use-cases.md`: Lists the system's Use Cases.
  - `user-flows.md`: Lists the overall User Flows.
  - `srs.md`: Detailed Software Requirements Specification.

- **`docs/ui/` & `docs/changelog/`:**
  - `ui/ui-guidelines.md`: UI guidelines (colors, fonts, components). You should
    also place HTML/CSS Mockups/Templates in the `docs/ui/` directory for
    reference.
  - `changelog/changes.md`: Release Notes for every project update.

**Note on Code Support Directories (Do not leave empty):**

- **`mock-data/`**: Contains fake data JSON files. Crucial for Frontend or AI to
  render test UIs before real databases exist. Fill with data matching your API.
- **`tests/`**: Contains test scripts (Unit tests, E2E tests).
- **`graph/`**: Tools to auto-generate the document relationship network.

### Step 3: Module Analysis & Design (Feature Level)

When preparing to program a specific feature (e.g., Payment, Authentication),
work within the `modules/` directory:

1. Copy the `modules/sample-module` folder and rename it to your feature's name
   (e.g., `modules/payment`).
2. Fill out the information in these files completely:
   - `overview.md`: What is the purpose and scope of this module?
   - `requirements.md`: The specific functional requirements it must have.
   - `flow.md`: Draw the operational flowchart (using Mermaid JS).
   - `api.md`: Design the data flow (API Request/Response).
3. **Formatting Rule:** Every document must follow Markdown standards (or
   `Markdownlint` will throw errors). Specifically, document structure and
   metadata **MUST** comply with internal rules defined in
   `docs/project/metadata-schema.md` along with AI rules in `.agents/`.

### Step 4: Coding Phase

Only after Step 3 is complete (Module documentation is finalized and committed):

- You (or the AI Agent) are allowed to start writing Source Code.
- **For Frontend Development:** Developers or AI MUST strictly reference
  user-specified HTML/CSS mockups (placed in the `docs/ui/` folder) to ensure
  the code exactly matches the design.
- **Source Code Structure:** Code can be placed centrally in `src/`, or directly
  inside the module's folder (e.g., `modules/payment/controller.ts` if following
  a Modular Architecture).

### Step 5: Commit & Push

Run `git commit`. The Husky + Lint-staged system will pause to automatically
format code using Prettier and check markdown spelling/syntax before
successfully pushing to the Repository.

---

## 🤖 AI Integration Guide

This boilerplate comes with an `.agents/` directory containing default skills
and rules. Depending on the AI tool you use, follow these instructions so the AI
can "understand" these rules:

### 1. For IDE-integrated AI (Cursor, VSCode Copilot, etc.)

We recommend using the **Pointer File** method to ensure the AI always
references the latest rules from `.agents/` (Single Source of Truth).

- **Example with Cursor:** Create a file named `.cursorrules` in the root
  directory and paste this line:
  > _"Always read and strictly follow the global rules defined in
  > `.agents/AGENTS.md` and check `.agents/skills/` for specific task
  > instructions before writing any code."_

### 2. For Web Chat AI (ChatGPT, Claude, Gemini)

These AIs cannot automatically scan files on your computer. Use the **Manual
Copy** method:

- Before starting a new chat or project, open `.agents/AGENTS.md` or relevant
  `SKILL.md` files.
- **Copy** the content and **Paste** it into the AI's _System Prompt_ (or
  _Custom Instructions_), or directly into the first chat message.
- This allows you to feed the AI the exact skills needed for the task, saving
  context memory (Tokens) and keeping the AI focused.
