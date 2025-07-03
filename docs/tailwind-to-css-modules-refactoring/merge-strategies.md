# Merge Strategies for Tailwind to CSS Modules Refactoring

## Overview
This document outlines strategies to minimize merge conflicts and ensure smooth collaboration during the refactoring process.

## Branch Strategy

### Main Refactoring Branch
- **Branch**: `feature/tailwind-to-css-modules`
- **Purpose**: Main branch for all refactoring work
- **Merges from**: `main` (regularly)
- **Merges to**: `main` (at phase completions)

### Phase Branches
```
feature/tailwind-to-css-modules
├── feature/tailwind-to-css-modules-phase-1
├── feature/tailwind-to-css-modules-phase-2
├── feature/tailwind-to-css-modules-phase-3
└── feature/tailwind-to-css-modules-phase-4
```

### Component Branches (Optional)
For large component groups:
```
feature/tailwind-to-css-modules-ui-components
feature/tailwind-to-css-modules-page-components
```

## Merge Workflow

### 1. Daily Sync Pattern
```bash
# Start of day - sync with main
git checkout main
git pull origin main
git checkout feature/tailwind-to-css-modules
git merge main

# If conflicts exist, resolve favoring refactored code
git add .
git commit -m "chore(merge): sync with main branch"
```

### 2. Phase Completion Merge
```bash
# Complete testing on phase branch
git checkout feature/tailwind-to-css-modules
git merge feature/tailwind-to-css-modules-phase-1
git push origin feature/tailwind-to-css-modules

# Create PR to main only after full phase completion
```

### 3. Component-by-Component Strategy
```bash
# Work on isolated components
git checkout -b refactor/button-component
# ... make changes ...
git commit -m "refactor(ui/button): convert to CSS modules"

# Merge immediately to reduce conflicts
git checkout feature/tailwind-to-css-modules
git merge refactor/button-component --no-ff
```

## Conflict Prevention Strategies

### 1. File Locking Communication
Create a simple tracking file:

```markdown
# components-in-progress.md

## Currently Being Refactored (DO NOT MODIFY)
- [ ] @developer1: src/components/ui/button.tsx (Started: 2024-01-15)
- [ ] @developer2: src/components/ui/dialog.tsx (Started: 2024-01-15)

## Completed Today
- [x] @developer1: src/components/ui/card.tsx
```

### 2. CSS Module File Strategy
- **Always create new CSS module files** (never modify existing ones during refactor)
- **Append to existing CSS modules** rather than reorganizing
- **Use clear section comments**:

```css
/* ===== Original Styles (DO NOT MODIFY) ===== */
.existingClass { }

/* ===== Tailwind Conversion - Added 2024-01-15 ===== */
.newContainer { }
.newButton { }
```

### 3. Component Modification Rules
1. **One component per commit** - easier to resolve conflicts
2. **Complete conversion** - Don't leave components partially converted
3. **Test immediately** - Catch issues before merging

## Conflict Resolution Guide

### When Conflicts Occur

#### 1. Identify Conflict Type

**Type A: Tailwind vs CSS Module**
```jsx
<<<<<<< HEAD
<div className="flex items-center p-4">
=======
<div className={styles.container}>
>>>>>>> feature/tailwind-to-css-modules
```
**Resolution**: Always favor the CSS Module version

**Type B: Different CSS Module Classes**
```jsx
<<<<<<< HEAD
<div className={styles.oldContainer}>
=======
<div className={styles.container}>
>>>>>>> feature/tailwind-to-css-modules
```
**Resolution**: Review both, ensure no functionality is lost

**Type C: Structural Changes**
```jsx
<<<<<<< HEAD
<div className="p-4">
  <span>New feature added</span>
=======
<div className={styles.container}>
>>>>>>> feature/tailwind-to-css-modules
```
**Resolution**: Preserve structure, apply CSS modules

#### 2. Resolution Steps
```bash
# 1. See all conflicts
git status

# 2. For each conflicted file
git diff src/components/example.tsx

# 3. Open in editor and resolve
# - Keep CSS module approach
# - Preserve any new functionality
# - Ensure corresponding .module.css has all needed styles

# 4. Test the component
npm run dev
# Visually verify no regressions

# 5. Mark as resolved
git add src/components/example.tsx
git add src/components/example.module.css

# 6. Continue merge
git commit
```

### 3. Common Conflict Patterns

#### Pattern 1: New Props Added
```jsx
// Original
<Button className="px-4 py-2 bg-blue-500">

// Main added new prop
<Button className="px-4 py-2 bg-blue-500" disabled={isDisabled}>

// Refactored version
<Button className={styles.button}>

// Resolved version
<Button className={styles.button} disabled={isDisabled}>
```

#### Pattern 2: Conditional Classes
```jsx
// Original with Tailwind
<div className={`p-4 ${isActive ? 'bg-blue-500' : 'bg-gray-500'}`}>

// Refactored version might conflict
// Resolution:
<div className={isActive ? styles.active : styles.inactive}>
```

## Merge Checklist

### Before Merging
- [ ] All Tailwind classes removed from modified files
- [ ] CSS modules created/updated for all components
- [ ] Visual testing completed
- [ ] No console errors
- [ ] Responsive design verified
- [ ] Interactive states working

### During Merge
- [ ] Pull latest from target branch
- [ ] Resolve conflicts favoring CSS modules
- [ ] Test each resolved component
- [ ] Verify no visual regressions

### After Merge
- [ ] Update conversion tracker
- [ ] Run full test suite
- [ ] Check build process
- [ ] Update team on completed components

## Emergency Procedures

### Rollback Strategy
If major issues arise after merge:

```bash
# Find the last good commit
git log --oneline

# Create a rollback branch
git checkout -b rollback/emergency-fix <last-good-commit>

# Cherry-pick only the good changes
git cherry-pick <commit-hash>

# Force push if absolutely necessary (team communication required)
```

### Partial Reversion
If only specific components have issues:

```bash
# Revert just the problematic file
git checkout main -- src/components/problematic.tsx

# Re-apply refactoring more carefully
```

## Communication Protocols

### Daily Standup Topics
1. Components completed yesterday
2. Components planned for today
3. Any blockers or conflicts encountered

### Slack/Team Chat
```
🚧 Starting: Working on Button component
✅ Completed: Button component refactored
❌ Blocked: Need help with Dialog component conflicts
🔀 Merging: Phase 1 complete, merging to main branch
```

### Pull Request Template
```markdown
## Refactoring: [Component/Phase Name]

### Components Modified
- [ ] Component 1
- [ ] Component 2

### CSS Modules Added/Modified
- [ ] component1.module.css (new)
- [ ] component2.module.css (appended)

### Testing Completed
- [ ] Visual regression testing
- [ ] Responsive design check
- [ ] Interactive states verified
- [ ] Theme switching tested

### Conflicts Resolved
- None / Description of conflicts and resolution

### Notes
Any special considerations or changes made
```

## Best Practices Summary

1. **Communicate Early and Often**
   - Announce what you're working on
   - Ask before modifying shared components

2. **Merge Frequently**
   - Small, frequent merges are easier than large ones
   - Complete component conversions before merging

3. **Test Thoroughly**
   - Visual testing after every merge
   - Run the build process
   - Check responsive behavior

4. **Document Changes**
   - Update the conversion tracker
   - Add comments for complex conversions
   - Note any deviations from standard patterns

5. **Be Conservative**
   - When in doubt, preserve existing functionality
   - Don't refactor beyond the scope
   - Keep original behavior intact