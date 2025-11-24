# Zypher Trip Planner - Setup Instructions

## Running the Application

This trip planner uses **two servers**:
1. **Deno Server** (Port 8000) - Runs the Zypher AI agent
2. **Next.js Server** (Port 3000) - Serves the web interface

### Prerequisites

- [Deno 2.0+](https://deno.land/manual/getting_started/installation) installed
- Node.js and npm installed
- API Keys:
  - Google Maps API
  - Anthropic API
  - Firecrawl API

### Step 1: Install Deno Dependencies and npm Dependencies

```bash
# Install Zypher and dependencies for Deno
deno install

# Install npm dependencies
npm install
```

### Step 2: Select your LLM model

Open `zypher-server.ts` and set your LLM model at line 116 eg. "claude-3-5-haiku-20241022", "claude-sonnet-4-20250514"

### Step 3: Start the Zypher Server

Open a **new terminal** and run:

```bash
deno run --allow-all zypher-server.ts
```

You should see:
```
🚀 Zypher server running on http://localhost:8000
📍 Trip planning API: http://localhost:8000/api/plan-trip
💚 Health check: http://localhost:8000/health
```

### Step 4: Start the Next.js Server

In your **original terminal**, the Next.js dev server should already be running:

```bash
npm run dev
```

If not, start it with the command above.

### Step 5: Use the App

1. Open http://localhost:3000 in your browser
2. Enter your API keys in the settings modal
3. Start planning trips!

## How It Works

```
User Browser (Port 3000)
    ↓
Next.js API Route (/api/plan-trip)
    ↓
Deno Zypher Server (Port 8000)
    ↓
Zypher AI Agent → Anthropic Claude + Firecrawl
    ↓
Trip Plan JSON
    ↓
Display with Google Maps
```


## TODOs
- [ ] Add Google Maps MCP to zypher-server.ts
- [ ] optizimize routes and calculate total distance and time with google maps mcp, instead of generating with LLM
- [ ] force json mode to fix not valid json response