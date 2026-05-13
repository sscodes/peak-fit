# 🏋️ PeakFit

**PeakFit** is an AI-powered fitness and diet planning portal that combines conversational AI, smart chart management, and 3D muscle visualization to help users build and refine their personal fitness routines — all in one place.

---

## ✨ Overview

PeakFit is not just another fitness tracker. It's a feedback-driven fitness companion where your workout and diet plans evolve through natural conversation with AI — and every change is versioned, so you always have a full history of where you started and how you've grown.

---

## 🚀 Features

### 🤖 AI-Powered Plan Generation
- Chat naturally with the AI to create personalized workout and diet plans
- The AI is context-aware — it already knows your profile details such as:
  - Current weight, age, and fitness level
  - Where you exercise (home, gym, outdoors)
  - Any medical conditions or physical limitations
  - Dietary preferences and restrictions
- Simply say something like *"I'm planning to start exercising from tomorrow — give me a chart"* and the system generates a structured plan from that intent — the AI response is parsed and validated into typed chart entities before anything is persisted

### 📊 Smart Charts Module
- AI responses are not stored as raw text — they are **transformed into structured chart entities** and validated before being written to the database
- Each chart entry is a well-defined record with typed fields:
  - Exercise / food item name
  - Number of sets
  - Number of reps per set
  - Step-by-step directions to perform the exercise correctly
- Charts are **only updated when you explicitly ask** — the AI won't silently change your plan mid-conversation

### 🔄 Chart Versioning
- Every time your chart is updated, a new version is created (e.g., Chart v1 → Chart v2)
- Full **version history** is preserved so you can always look back at previous plans
- Updates happen through real chat feedback — for example:
  > *"Burpees are too exhausting and affecting my other exercises. Suggest less tiring alternatives with similar benefits."*
  
  The AI responds with alternatives and, on your instruction, updates the chart — creating a new version automatically

### 💬 Conversational Feedback Loop
- Feedback isn't a thumbs-up or thumbs-down button — it's a **real-world chat loop**
- Discuss what's working, what's hurting, what you want to change
- The AI uses that context to refine your plan, and the updated plan flows back into the Charts module seamlessly

### 🫀 3D Muscle Visualizer
- Search for any exercise and see a **3D model** highlighting exactly which muscles are targeted
- Built with **Three.js** to render interactive, rotatable anatomy views
- Designed to reinforce the **mind-muscle connection** — understand your body, not just your reps
- Great for both beginners learning form and advanced users optimizing their splits

### 🥗 Diet Charts
- The same AI-chat + versioned-chart system applies to **diet planning**
- Discuss your nutrition goals, restrictions, and preferences with the AI
- Diet charts are generated, saved, and versioned just like workout charts
- Update your diet plan anytime by telling the AI what's working or what needs to change

---

## 🛠️ Tech Stack

### Frontend

| Layer | Technology |
|---|---|
| Framework | React 19.1.0 |
| Build Tool | Vite |
| 3D Visualization | Three.js |
| Animations | Framer Motion |
| Form Handling | Formik + Yup |
| State Management | Zustand |
| Bundle Strategy | Manual chunking + component-level lazy loading |

### Backend

| Layer | Technology |
|---|---|
| Database | PostgreSQL (via Supabase) |
| Auth | Supabase Auth (JWT-based, row-level security) |
| Serverless Logic | Supabase Edge Functions (Deno) |
| Storage | Supabase Storage (for any media assets) |
| AI Integration | Handled via Edge Functions — responses are parsed, validated into structured entities, and written to Postgres |

### How the backend fits together
- **Supabase Auth** handles user sessions with JWTs. Row-Level Security (RLS) policies on Postgres ensure users can only ever read and write their own charts, versions, and chat history.
- **Edge Functions** sit between the AI and the database. When a plan generation or update is triggered, the Edge Function calls the AI, parses the response into a typed schema, validates the fields, and performs the Postgres insert/update — keeping that logic off the client entirely.
- **PostgreSQL** is the source of truth for all chart data, version history, and user profiles. Chart versioning is handled at the DB level, with each version stored as an immutable row.

### Frontend Bundle Architecture
PeakFit uses a deliberate chunking strategy to keep initial load fast:
- **Three.js** is isolated in its own vendor chunk (~1.2MB) and lazy-loaded only when the Muscle Visualizer is accessed
- All major route-level components are **lazy loaded** to minimize the initial bundle
- Core React runtime is kept lean on first paint

---

## 📁 Project Structure

```
peakfit/
├── src/
│   ├── components/        # Shared UI components
│   ├── modules/
│   │   ├── chat/          # AI chat interface
│   │   ├── charts/        # Chart management + version history
│   │   ├── visualizer/    # 3D muscle visualizer (Three.js)
│   │   └── diet/          # Diet chart module
│   ├── store/             # Zustand state management
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Helpers and constants
├── public/
├── vite.config.js
└── package.json
```

---

## ⚡ Getting Started

### Prerequisites
- Node.js ≥ 18
- pnpm

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/peakfit.git
cd peakfit

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

### Build for Production

```bash
pnpm build
pnpm preview
```

---

## 🗺️ Roadmap

- [ ] Wearable device integration (steps, heart rate)
- [ ] Progress photos with timeline view
- [ ] Social sharing of chart milestones
- [ ] Push notifications for workout reminders
- [ ] Export charts as PDF
- [ ] User tiers — Free and Premium plans, with more tiers added over time
- [ ] Human trainer layer — certified trainers working alongside the AI, reviewing plans and guiding users directly within the platform

---

## 🤝 Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change, then submit a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Built with React + Vite · Powered by AI · Visualized in 3D