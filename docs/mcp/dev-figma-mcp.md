# Internal Developer Docs – Figma MCP Server Integration (Use-Case 1)

_Last updated: 2025-07-05_

## Overview
The Figma MCP server gives our engineering team & Cursor’s AI Agent **semantic access** to live design data so that code generation is pixel-accurate and design-system aware.  This document explains how the integration is wired up in the repo and how to use it day-to-day.

---

## Project Files
| Path | Purpose |
|------|---------|
| `.cursor/mcp.json` | Registers the server named `figma-dev` (stdio transport) |
| `package.json` – `mcp:figma` | Convenience script to start the server with `pnpm run mcp:figma` |
| `.env(.example)` | Holds `FIGMA_API_KEY` personal token |
| `docs/figma-mcp-workflow.md` | Step-by-step onboarding guide (public) |

---

## Local Setup
```bash
cp .env.example .env      # add FIGMA_API_KEY
pnpm run mcp:figma        # start stdio server (optional – Cursor will auto-spawn)
```

1. Update your Figma Personal Access Token (read-only scope).
2. In Cursor ➜ Settings ➜ MCP ➜ refresh – verify **figma-dev** is green.

---

## Daily Workflow
1. Select a frame/component in Figma → `⌘ + L`.
2. Paste the link in Cursor Composer with a prompt such as:
   ```
   Using CSS-Modules (no Tailwind), generate a React component called `pricing-card.tsx` that matches this design.
   ```
3. Cursor invokes `get_figma_data` (and friends) under the hood and writes the files directly into the repo.

### Command-Line Shortcut
For quick CLI pulls you can use:
```bash
pnpm run mcp:figma | tee figma.log
```
This prints raw server traffic – useful for debugging.

---

## Adding More Tools
The server currently exposes `get_figma_data` + `download_figma_images`.  If you need a new tool, fork `figma-developer-mcp` and register the binary in `.cursor/mcp.json`.

---

## Troubleshooting
| Symptom | Fix |
|---------|-----|
| `Cursor failed to fetch design` | 1. Confirm frame link not entire file. 2. Token has access to the file. |
| Timeouts / large frames | Break design into smaller parts or raise `depth` param in the prompt. |
| Duplicate component names | Rename the frame/layer in Figma; server uses names for filenames. |

---

## Maintenance Checklist
- Keep `figma-developer-mcp` version up-to-date (`pnpm update figma-developer-mcp`).
- Rotate personal tokens every 90 days.
- Ensure no Tailwind utilities slip into generated code (review code-review bot warnings).

---

## Figma Token Scopes
Only read-access is required for our current workflows.

| Scope | Why it’s needed |
|-------|-----------------|
| `file_read` | Download the JSON node tree for frames/components |
| `file_images` | Fetch rendered PNG/SVG previews when MCP needs screenshots |
| _(optional)_ `library_read` | Resolve shared design-system tokens/components |
| _(optional)_ `comment_read` | Future: surface annotations in code reviews |

No `*_write` scopes are necessary because we never modify Figma files.
Generate the Personal Access Token in **Figma → Settings → Personal access tokens** with the two required scopes and paste it into `.env` as `FIGMA_API_KEY=`.