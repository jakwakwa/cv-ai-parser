# Figma MCP Integration – Developer Workflow

> **Scope**: Use-case 1 – giving developers & Cursor’s Agent semantic access to Figma designs.

This guide assumes you already run the repository with **pnpm** and Next 15.

---

## 1  Prerequisites

1. **Figma Personal Access Token** with _File Read_ permission
2. Local build tools (Node ≥ 18 / Bun optional)
3. Cursor IDE ≥ 0.30 (or any MCP-aware editor)

Create `FIGMA_API_KEY` in your Figma account → copy it into `.env` (see `.env.example`).

---

## 2  Install dependencies

Nothing to install globally – we rely on `npx` to fetch the server.

```bash
pnpm install           # ensure node_modules is present
```

---

## 3  Starting the Figma MCP server

We ship a convenience script:

```bash
pnpm run mcp:figma
```

This spawns the `figma-developer-mcp` server in **stdio** mode. Cursor will automatically connect on demand; you may keep it running in its own terminal tab if you want to inspect logs.

> The first invocation downloads the package – expect a short delay.

---

## 4  Using the workflow in Cursor

1. **Enable the server**
   * Cursor → Settings → MCP → Refresh – make sure `figma-dev` appears green.
2. **Copy a frame link** from Figma (`⌘ + L` on a selected frame/component).
3. **Open Composer** and paste the link with a prompt, e.g.:

   > _“Generate a React component named `feature-card.tsx` that reproduces this design. Use CSS Modules, no Tailwind.”_

4. Cursor will call `get_figma_data` automatically and write the TSX + `feature-card.module.css` into your project.
5. Review, polish, commit 🚀

---

## 5  Troubleshooting

| Symptom | Fix |
|---------|-----|
| `Cursor failed to fetch design` | 1) Make sure the link points to a **Frame** or **Component**.<br>2) Check that `FIGMA_API_KEY` has access to the file (shared or team). |
| `get_image timeout` | Try selecting smaller areas or increase model timeout (Cursor Settings → MCP). |
| Server not visible | Ensure `pnpm run mcp:figma` is running **or** that Cursor was restarted after adding `.cursor/mcp.json`. |

---

## 6  Cleaning up

The MCP process only runs when you invoke it. Stop it anytime with `Ctrl-C` in its terminal tab.

---

### References
* [figma-developer-mcp ‑ npm](https://npmjs.com/package/figma-developer-mcp)
* [Cursor MCP documentation](https://cursor.directory/mcp/figma)