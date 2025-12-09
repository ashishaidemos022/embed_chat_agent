Here is a clean, professional README.md tailored exactly for the architecture you built: a React/Vite app that hosts an embeddable AI agent chat UI (/embed/agent/:public_id) and a standalone widget loader (bootstrapLoader.js).

You can copy-paste this into README.md at the project root.

⸻

AI Agent Embed App

A lightweight React + Vite application for embedding your Supabase-powered AI agent on any external website.
It provides:
	•	A full /embed/agent/:public_id chat experience (iframe-ready)
	•	A bootstrapLoader.js embeddable script for drop-in installation on any site
	•	A minimal widget mode (?widget=1)
	•	Persistent local session support
	•	Secure routing to your Supabase Edge Function (agent-chat)

⸻

🚀 Features

1. Embed Chat UI

Your AI agent can be rendered on any domain by loading the route:

/embed/agent/<public_id>

Example:

https://your-app.vercel.app/embed/agent/abc123?theme=dark&widget=1

This screens the agent metadata, loads history, persists sessions, and sends messages to your Edge Function.

⸻

2. Universal Bootstrap Loader

A simple <script> tag is all that external sites need:

<script
  src="https://your-app.vercel.app/bootstrapLoader.js"
  data-public-id="abc123"
  data-theme="dark"
  data-widget="1"
  async
></script>

The loader automatically:
	•	Detects your app origin
	•	Injects an iframe pointing to /embed/agent/<public_id>
	•	Applies theme + widget mode
	•	Works on any site (n8n, Webflow, WordPress, custom JS apps, etc.)

⸻

3. Supabase Integration

The embed app communicates with your agent-chat Supabase Edge Function using:
	•	VITE_SUPABASE_URL
	•	public_id
	•	Optional session persistence via localStorage

The Edge Function handles:
	•	Agent metadata loading
	•	Session creation
	•	Message logging
	•	OpenAI completions

⸻

🏗 Project Structure

src/
 ├─ embed/
 │   ├─ EmbedAgentApp.tsx     # Full embedded chat interface
 │   └─ useEmbedChat.ts       # Handles API calls + message persistence
 │
 ├─ widget/
 │   └─ WidgetApp.tsx         # Stub for future widget UI
 │
 ├─ components/
 │   └─ ui/Button.tsx         # Reusable UI button
 │
 ├─ lib/
 │   └─ utils.ts              # tiny `cn()` classname helper
 │
 ├─ App.tsx                   # Default homepage
 └─ main.tsx                  # Route detection (embed/widget/app)
 
public/
 └─ bootstrapLoader.js        # Embeddable script for external websites


⸻

📦 Installation

npm install


⸻

🔧 Environment Variables

Create .env.local:

VITE_SUPABASE_URL=https://your-project-ref.supabase.co

This is required for the embed to talk to your Supabase Edge Function:

/functions/v1/agent-chat


⸻

▶️ Development

npm run dev

Local URLs:
	•	Home:
http://localhost:5173/
	•	Embed Agent UI:
http://localhost:5173/embed/agent/<public_id>
	•	Widget mode:
http://localhost:5173/embed/agent/<public_id>?widget=1
	•	Bootstrap loader:
http://localhost:5173/bootstrapLoader.js

⸻

🏗 Build

npm run build

This outputs to dist/ and is fully deployable on Vercel.

⸻

🌐 Deploying to Vercel

Just push your repo or connect via the Vercel dashboard.

Make sure VITE_SUPABASE_URL is added under Project → Settings → Environment Variables.

Vercel will:
	•	Serve React app from /
	•	Serve bootstrapLoader.js statically from root
	•	Correctly handle iframe embed paths

⸻

🔌 Using the Bootstrap Loader (External Websites)

Add this snippet anywhere on a third-party site:

<script
  src="https://your-app.vercel.app/bootstrapLoader.js"
  data-public-id="YOUR_PUBLIC_ID"
  data-theme="dark"
  data-widget="1"
  async
></script>

The script automatically injects:

<iframe
  src="https://your-app.vercel.app/embed/agent/YOUR_PUBLIC_ID?widget=1&theme=dark"
  ...
></iframe>

No custom JS or hosting required.

⸻

🛠 Customization Options

Query Params (Embed App)

Param	Purpose
theme	light or dark
widget	1 enables compact widget mode

Example:

/embed/agent/abc123?theme=light&widget=1


⸻

🧪 Testing Checklist
	•	Visit /embed/agent/<public_id> → loads agent
	•	Visit /embed/agent/<public_id>?widget=1 → loads widget mode
	•	Visit /bootstrapLoader.js → loads script, not 404
	•	Embed script iframe renders properly on external site
	•	/functions/v1/agent-chat responds normally

⸻

🗂 License

MIT — free to use, modify, and embed in your own projects.

⸻

✨ Summary

This app allows you to:
	•	Host a clean, responsive AI agent UI
	•	Embed it anywhere via iframe or a <script> loader
	•	Keep agent configurations & state in Supabase
	•	Deploy instantly to Vercel