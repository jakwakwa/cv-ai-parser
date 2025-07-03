# Git Workflow for Tailwind to CSS Modules Refactoring

## Overview
This document provides a complete git workflow guide for the Tailwind to CSS Modules refactoring project.

## Initial Setup

### 1. Clone and Setup
```bash
# Clone the repository
git clone <repository-url>
cd <project-name>

# Install dependencies
npm install

# Switch to refactoring branch
git checkout feature/tailwind-to-css-modules

# Set up git hooks
bash setup-hooks.sh
```

### 2. Configure Git
```bash
# Set up your identity
git config user.name "Your Name"
git config user.email "your.email@example.com"

# Enable helpful settings
git config pull.rebase true
git config fetch.prune true
```

## Daily Workflow

### Morning Routine
```bash
# 1. Sync with latest changes
git checkout main
git pull origin main

# 2. Update your refactoring branch
git checkout feature/tailwind-to-css-modules
git merge main

# 3. Check component status
cat docs/tailwind-to-css-modules-refactoring/components-in-progress.md
```

### Starting Work on a Component

#### 1. Claim Your Component
```bash
# Update the tracking file
echo "- [ ] @yourname: src/components/ui/button.tsx (Started: $(date +%Y-%m-%d))" >> docs/tailwind-to-css-modules-refactoring/components-in-progress.md

git add docs/tailwind-to-css-modules-refactoring/components-in-progress.md
git commit -m "docs(refactor): claim button component for conversion"
git push
```

#### 2. Create Feature Branch (Optional)
```bash
# For complex components
git checkout -b refactor/button-component

# For simple components, work directly on feature/tailwind-to-css-modules
```

#### 3. Conversion Process
```bash
# 1. Check current Tailwind usage
grep -n "className" src/components/ui/button.tsx

# 2. Create CSS module
touch src/components/ui/button.module.css

# 3. Convert component
# - Replace Tailwind classes with CSS module classes
# - Import styles
# - Test thoroughly

# 4. Stage changes
git add src/components/ui/button.tsx
git add src/components/ui/button.module.css

# 5. Verify no Tailwind remains
bash check-tailwind-usage.sh src/components/ui/button.tsx
```

### Committing Work

#### Standard Commit
```bash
# Check what you're committing
git status
git diff --staged

# Commit with proper message
git commit -m "refactor(ui/button): convert button component to CSS modules

- Converted all Tailwind utility classes to CSS module classes
- Created button.module.css with complete styles
- Maintained all variants (primary, secondary, ghost)
- Preserved hover, focus, and disabled states
- No visual changes"
```

#### Amending a Commit
```bash
# If you forgot something
git add src/components/ui/button.module.css
git commit --amend --no-edit

# Or to change the message
git commit --amend
```

### Pushing Changes

```bash
# First push of a new branch
git push -u origin refactor/button-component

# Subsequent pushes
git push

# If you amended a commit already pushed
git push --force-with-lease
```

## Handling Common Scenarios

### Scenario 1: Mid-work Interruption
```bash
# Need to switch to another task
git stash save "WIP: converting dialog component"

# Do other work...

# Return to your work
git stash pop
```

### Scenario 2: Accidental Changes
```bash
# Discard changes to a file
git checkout -- src/components/ui/button.tsx

# Discard all changes
git reset --hard HEAD

# Undo last commit but keep changes
git reset --soft HEAD~1
```

### Scenario 3: Conflict Resolution
```bash
# After merge conflict
git status

# Open conflicted files and resolve
# Always favor CSS module version

# After resolving
git add <resolved-files>
git commit
```

### Scenario 4: Finding Issues
```bash
# Find when a bug was introduced
git bisect start
git bisect bad HEAD
git bisect good <last-known-good-commit>

# Test and mark commits
git bisect good  # or bad

# When done
git bisect reset
```

## Working with Phases

### Starting a New Phase
```bash
# Create phase branch
git checkout -b feature/tailwind-to-css-modules-phase-2

# Update documentation
vim docs/tailwind-to-css-modules-refactoring/conversion-tracker.md

# Commit phase start
git commit -m "docs(refactor): start Phase 2 - Core Components"
```

### Completing a Phase
```bash
# Ensure all tests pass
npm test
npm run build

# Update tracking document
vim docs/tailwind-to-css-modules-refactoring/conversion-tracker.md

# Merge to main refactoring branch
git checkout feature/tailwind-to-css-modules
git merge --no-ff feature/tailwind-to-css-modules-phase-2

# Tag the phase completion
git tag -a phase-2-complete -m "Phase 2: Core Components completed"
git push --tags
```

## Code Review Process

### Creating a Pull Request
```bash
# Push your branch
git push origin feature/tailwind-to-css-modules-phase-1

# Create PR via GitHub/GitLab with template:
```

```markdown
## Refactoring: Phase 1 - Foundation Components

### Summary
Converted all foundation components from Tailwind to CSS Modules.

### Components Modified
- [x] Layout (app/layout.tsx)
- [x] Button (src/components/ui/button.tsx)
- [x] Card (src/components/ui/card.tsx)

### CSS Modules Created
- layout.module.css (new)
- button.module.css (new)
- card.module.css (new)

### Testing Completed
- [x] Visual regression testing
- [x] Responsive design (mobile, tablet, desktop)
- [x] Interactive states (hover, focus, active, disabled)
- [x] Theme switching
- [x] Build passes

### Screenshots
[Before/After comparisons]

### Notes
- No visual changes
- All functionality preserved
- Performance slightly improved
```

### Reviewing Code
```bash
# Check out PR branch
git fetch origin
git checkout -b review/pr-123 origin/feature/tailwind-to-css-modules-phase-1

# Run tests
npm test
npm run build

# Visual testing
npm run dev

# Check for Tailwind remnants
bash check-tailwind-usage.sh
```

## Advanced Git Commands

### Useful Aliases
```bash
# Add to ~/.gitconfig
[alias]
    st = status -sb
    co = checkout
    br = branch
    cm = commit -m
    unstage = reset HEAD --
    last = log -1 HEAD
    visual = !gitk
    refactor-log = log --oneline --grep="refactor"
```

### Searching History
```bash
# Find all refactoring commits
git log --grep="refactor" --oneline

# Find who changed a line
git blame src/components/ui/button.tsx

# Find when a file was modified
git log --follow src/components/ui/button.module.css

# Search for removed Tailwind classes
git log -S"className=\"flex" --source --all
```

### Cleaning Up
```bash
# Remove merged branches
git branch --merged | grep -v "\*\|main\|feature/tailwind-to-css-modules" | xargs -n 1 git branch -d

# Clean up remote tracking
git remote prune origin

# Remove old reflog entries
git reflog expire --expire=30.days --all
```

## Emergency Procedures

### Disaster Recovery
```bash
# Lost commits? Check reflog
git reflog
git checkout <lost-commit-hash>

# Accidentally deleted branch
git checkout -b recovered-branch <commit-hash>

# Complete mess? Start fresh
git fetch origin
git reset --hard origin/feature/tailwind-to-css-modules
```

### Creating Backup
```bash
# Before risky operations
git branch backup/before-merge

# Create a patch
git format-patch -1 HEAD

# Apply patch later
git apply 0001-your-patch.patch
```

## Best Practices Checklist

### Before Starting Work
- [ ] Pull latest changes
- [ ] Check components-in-progress.md
- [ ] Run the project locally
- [ ] Ensure git hooks are installed

### While Working
- [ ] Commit frequently with clear messages
- [ ] Test after each component conversion
- [ ] Keep commits focused (one component per commit)
- [ ] Update documentation as you go

### Before Pushing
- [ ] Run all tests
- [ ] Check for console.log statements
- [ ] Verify no Tailwind classes remain
- [ ] Update conversion tracker

### After Merging
- [ ] Delete feature branches
- [ ] Update team on progress
- [ ] Check for any regressions
- [ ] Plan next components

## Quick Reference

### Status Commands
```bash
git status                    # Current status
git log --oneline -10        # Recent commits
git diff                     # Unstaged changes
git diff --staged            # Staged changes
git branch -vv               # Branch info
```

### Navigation Commands
```bash
git checkout main            # Switch branch
git checkout -               # Previous branch
git checkout HEAD~2          # Go back 2 commits
git checkout -- file.tsx     # Discard changes
```

### Saving Work Commands
```bash
git add -p                   # Stage selectively
git commit                   # Commit staged
git stash                    # Save work temporarily
git stash pop               # Restore saved work
```

## Resources
- [Commit Conventions](./commit-conventions.md)
- [Merge Strategies](./merge-strategies.md)
- [Git Hooks Templates](./git-hooks-templates.md)
- [Project CSS Rules](./project-css-rules.md)