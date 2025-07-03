# Components In Progress

## Purpose
This file tracks which components are currently being worked on to prevent conflicts and duplicate work.

## Currently Being Refactored (DO NOT MODIFY)
_Add your name and component when you start working on it_

<!-- Example:
- [ ] @developer1: src/components/ui/button.tsx (Started: 2024-01-15)
- [ ] @developer2: src/components/ui/dialog.tsx (Started: 2024-01-15)
-->

## Completed Today
_Move items here when done, will be cleared daily_

<!-- Example:
- [x] @developer1: src/components/ui/card.tsx (Completed: 2024-01-15)
-->

## Blocked/Need Help
_List components that have issues or need assistance_

<!-- Example:
- ⚠️ @developer3: src/components/ui/table.tsx - Complex responsive layout needs review
-->

---

## Instructions

### Claiming a Component
1. Add your entry to "Currently Being Refactored"
2. Format: `- [ ] @yourname: path/to/component.tsx (Started: YYYY-MM-DD)`
3. Commit and push immediately

### Completing a Component
1. Check the box: `- [x]`
2. Move to "Completed Today" section
3. Update the conversion tracker
4. Commit and push

### Daily Cleanup
At the start of each day:
1. Clear the "Completed Today" section
2. Check for stale entries (>2 days old)
3. Move any blocked items to team discussion

### Example Workflow
```bash
# Before starting work
git pull
cat docs/tailwind-to-css-modules-refactoring/components-in-progress.md

# Claim your component
echo "- [ ] @yourname: src/components/ui/button.tsx (Started: $(date +%Y-%m-%d))" >> docs/tailwind-to-css-modules-refactoring/components-in-progress.md
git add docs/tailwind-to-css-modules-refactoring/components-in-progress.md
git commit -m "docs(refactor): claim button component"
git push

# After completing
# Edit the file to mark complete and move to completed section
git add docs/tailwind-to-css-modules-refactoring/components-in-progress.md
git commit -m "docs(refactor): complete button component"
git push
```