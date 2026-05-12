# ELYS

Connect any AI (Claude, ChatGPT, Gemini, Mistral) to any web software — even without an official API. Type a software name, connect, get an MCP URL to paste into your AI.

## Structure

| File | Role |
|---|---|
| `index.html` | Marketing landing page (FR / EN) |
| `app.html` | Product prototype (served at `/app` thanks to `cleanUrls`) |
| `elys-app.jsx` | App root + routing |
| `elys-pages.jsx` | Page-level compositions |
| `elys-screens.jsx` | Screen views (dashboard, connectors, billing…) |
| `elys-components.jsx` | Reusable UI components |
| `elys-data.jsx` | Mock data + fixtures |
| `vercel.json` | Vercel config: clean URLs + correct MIME for `.jsx` |

## Local preview

Any static server works, e.g.:

```bash
npx serve .
# then open http://localhost:3000
```

The `.jsx` files are transpiled in-browser by Babel Standalone — no build step needed.

## Deploy on Vercel

1. Push this repo to GitHub.
2. On Vercel: **New Project** → import `sachalbs/ELYS`.
3. Framework preset: **Other** (no build).
4. Build command: *(leave empty)*.
5. Output directory: *(leave empty — root)*.
6. Deploy.

URLs:
- `/` → landing
- `/app` → product prototype
