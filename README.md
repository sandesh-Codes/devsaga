# Elva
### *"Learning from mistakes never been so easy."*

Elva is an AI-powered debugging companion that doesn't just fix your errors — it learns your patterns, identifies your weak spots, and helps you grow as a developer over time.

![Elva Banner](https://placehold.co/1200x400?text=Elva+Banner)

---

## ✨ Features

- **AI Debugging** — Paste your error, code, and context. Get a structured response with a simple explanation, root cause, step-by-step fix, and common related mistakes.
- **Debugging History** — Every debug session is saved. Revisit past errors anytime.
- **Pattern Recognition** — Elva learns from your debugging history and identifies recurring weak spots in your code.
- **Personalized Insights** — Get summaries like *"You tend to struggle with state management"* based on your actual history.
- **Resource Suggestions** — Elva suggests free learning resources targeted at your specific weak areas.
- **Structured Output** — Responses are clean, organized, and easy to act on. No walls of text.

---

## 📸 Screenshots

> Coming soon

| Dashboard | Debug Session | History | Insights |
|-----------|--------------|---------|----------|
| ![Dashboard](https://placehold.co/600x400?text=Dashboard) | ![Debug](https://placehold.co/600x400?text=Debug+Session) | ![History](https://placehold.co/600x400?text=History) | ![Insights](https://placehold.co/600x400?text=Insights) |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | [Next.js](https://nextjs.org/) |
| Database | [Neon Postgres](https://neon.tech/) |
| ORM | [Prisma](https://www.prisma.io/) |
| AI | [Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) via `@google/genai` |
| Auth | JWT + Bcrypt |
| Styling | [Tailwind CSS](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech/) database (free tier works)
- A [Google AI Studio](https://aistudio.google.com/) API key (free tier works)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/sandesh-Codes/elva.git
cd elva
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory. Use `.env.example` as a reference:
```bash
cp .env.example .env.local
```

Fill in your values:
```env
GEMINI_API_KEY=your_gemini_api_key
DATABASE_URL=your_neon_database_url
JWT_SECRET=your_jwt_secret
```

4. **Set up the database**
```bash
npx prisma migrate dev
```

5. **Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌐 Live Demo

> Coming soon

---

## 📁 Project Structure

```
elva/src/
├── app/
│   ├── api/          # API routes
│   ├── (auth)/       # Auth pages
│   └── (dashboard)/  # Main app pages
├── components/       # Reusable UI components
├── lib/              # Utilities, Prisma client, helpers
├── prisma/           # Schema and migrations
└── public/           # Static assets
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to open an issue or submit a pull request.

1. Fork the repository
2. Create your feature branch `git checkout -b feature/your-feature`
3. Commit your changes `git commit -m 'Add your feature'`
4. Push to the branch `git push origin feature/your-feature`
5. Open a Pull Request

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**sandesh-Codes**
- GitHub: [@sandesh-Codes](https://github.com/sandesh-Codes)

---

<p align="center">Built with ❤️ to make debugging less painful and learning more personal.</p>
