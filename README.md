<p align="center">
  <img src="./.github/lockup_900.png" alt="DevSaga" width="420">
</p>

<p align="center">
  <em>"Learning from mistakes never been so easy."</em>
</p>

<p align="center">
  <a href="https://devsaga-app.vercel.app"><img src="https://img.shields.io/badge/demo-live-success?style=flat-square" alt="Live Demo"></a>
  <a href="https://github.com/sandesh-Codes/devsaga-extension"><img src="https://img.shields.io/badge/VS%20Code-extension-007ACC?style=flat-square&logo=visualstudiocode&logoColor=white" alt="VS Code Extension"></a>
  <img src="https://img.shields.io/badge/Next.js-App%20Router-black?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Gemini-2.5%20Flash-4285F4?style=flat-square&logo=google&logoColor=white" alt="Gemini">
  <a href="./LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue?style=flat-square" alt="MIT License"></a>
</p>

<p align="center">
  <a href="https://devsaga-app.vercel.app"><strong>Live Demo</strong></a> ·
  <a href="https://github.com/sandesh-Codes/devsaga-extension">VS Code Extension</a> ·
  <a href="#getting-started">Getting Started</a> ·
  <a href="#tech-stack">Tech Stack</a>
</p>

---

Most debugging tools stop at "here's your fix." **DevSaga doesn't.**

It pastes your error, fixes it, and then — this is the part that actually matters — **tracks every mistake you've ever made, finds the pattern behind it, and builds you a personalised test to make sure it never happens again.** Debugging is the entry point. Closing your actual skill gaps is the product.

<p align="center">
  <img src="./screenshots/mypatterns.png" alt="IRT — weak spot detection and personalised test generation" width="800">
</p>

<p align="center"><sub>DevSaga analyses your debug history, finds your weak spot, hands you the right resource, then tests you on it.</sub></p>

---

## ✨ Features

### 🩹 AI Debugging
Paste your error, code, and context. Get back a plain-English explanation, root cause, step-by-step fix, corrected code, and a list of commonly related mistakes — structured, not a wall of text.

### 🗂️ Debug History
Every session is saved to your account. Browse and expand past errors anytime to revisit what went wrong and how it got fixed.

### 🧠 IRT — Insights, Resources & Tests *(the actual magic)*
This is what separates DevSaga from "ChatGPT but for errors." After enough sessions, DevSaga mines your debug history for **patterns** — not single mistakes, but the *recurring* ones — and builds a closed loop around each weak spot:

| Step | What happens |
|---|---|
| **Identify the gap** | Clear summary of what you're actually struggling with, and why |
| **Curate resources** | Hand-picked articles, videos, and docs targeted at that exact weak spot |
| **Generate a test** | A real-world broken-code problem + scenario-based MCQs, built around your weak area — not generic quiz questions |
| **Review your attempt** | Honest AI mentor feedback: score, MCQ breakdown, code review, and a concrete next step |

You don't just get told what you got wrong once. You get tested until the weak spot closes.

---

## 🖥️ Screenshots

<table>
<tr>
<td width="50%">

**Home**
<img src="./screenshots/home.png" alt="Home Page">

</td>
<td width="50%">

**Paste error & code**
<img src="./screenshots/codepaste.png" alt="Paste Code">

</td>
</tr>
<tr>
<td width="50%">

**Get fixed code & explanation**
<img src="./screenshots/debugresponse.png" alt="Fixed Code">

</td>
<td width="50%">

**Weak spot detection & personalised test**
<img src="./screenshots/mypatterns.png" alt="My Patterns">

</td>
</tr>
</table>

<p align="center">→ <a href="https://devsaga-app.vercel.app"><strong>Try the live demo</strong></a></p>

---

## 🧩 VS Code Extension

DevSaga also ships as a **published, live VS Code extension** that catches errors *while you're working* — including long-running dev servers that crash but never "exit."

- Detects errors in real time from terminal output (not just on command exit)
- Framework-agnostic pattern matching (`Uncaught Error`, `EADDRINUSE`, `5xx`, `panic`, `Traceback`, build failures, and more)
- Debounced + deduplicated, so the same recurring error doesn't spam you on every save
- One click from a caught error straight into a DevSaga debug session

📦 [Marketplace](https://github.com/sandesh-Codes/devsaga-extension) · 💻 [Source](https://github.com/sandesh-Codes/devsaga-extension)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js (App Router) |
| Database | Neon Postgres |
| ORM | Prisma |
| AI | Gemini 2.5 Flash (`@google/genai`) |
| Auth | NextAuth.js — Google & GitHub OAuth |
| Styling | Tailwind CSS + shadcn/ui |
| Deployment | Vercel |

---

## Getting Started

### Prerequisites
- Node.js 18+
- A [Neon](https://neon.tech) database (free tier works)
- A [Google AI Studio](https://aistudio.google.com) API key (free tier works)
- Google and/or GitHub OAuth app credentials (for auth)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/sandesh-Codes/devsaga.git
cd devsaga
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env` file in the root:

```env
# Database (Neon)
DATABASE_URL=your_pooled_connection_string
DATABASE_URL_UNPOOLED=your_unpooled_connection_string
SHADOW_DATABASE_URL=the_second_unpooled_branch_of_db_for_dev_migrations

# AI
GEMINI_API_KEY=your_gemini_api_key
GEMINI_MODEL=any_gemini_model

# Auth (NextAuth)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_ID=your_github_id
GITHUB_SECRET=your_github_secret
```

**4. Set up the database**
```bash
npx prisma migrate dev
```

**5. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
prisma/
└── schema.prisma            ← Postgres schema + migrations

src/
├── app/
│   ├── page.js               ← landing page
│   ├── debug/page.js         ← debug page
│   ├── login/page.js         ← auth page
│   ├── history/page.js       ← debug history
│   ├── irt/page.js           ← IRT dashboard
│   ├── settings/page.js      ← account / API token settings
│   └── api/
│       ├── debug/            ← open, saves if signed in
│       ├── extension/        ← VS Code extension endpoints (debug, token auth)
│       ├── history/          ← auth gated
│       └── irt/
│           ├── analyze/      ← pattern analysis across debug history
│           ├── resources/    ← curated free resources per weak spot
│           ├── weakspots/    ← weak spot detection
│           └── test/         ← generate/ + submit/ for personalised tests
│
├── components/
│   ├── landing/                ← HeroSection, HowItWorksSection, IrtFeature, etc.
│   ├── layout/                 ← Topbar, MobileMenu, Logo
│   ├── login/                  ← SignInButton, ProviderIcons
│   ├── debug/                  ← DebugInput, DebugOutput, CopyButton, etc.
│   ├── history/                ← SessionCard
│   ├── irt/                    ← WeakSpotCard, ResourcesSection, ConfidenceBar, test/
│   └── ui/                     ← shadcn/ui primitives
│
├── config/                     ← debugConstants, historyConstants, irtConstants
├── lib/                        ← db, ai, prompts, utils
├── styles/                     ← landingpage.css
├── utils/                      ← parser, timeago
└── middleware.js
```

---

## 👨‍💻 Author

**sandesh-Codes**

- GitHub: [@sandesh-Codes](https://github.com/sandesh-Codes)
- Live: [devsaga-app.vercel.app](https://devsaga-app.vercel.app)

---

<p align="center"><em>Built to make debugging less painful and learning more personal.</em></p>