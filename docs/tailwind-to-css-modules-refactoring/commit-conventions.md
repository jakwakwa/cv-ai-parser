# Commit Message Conventions

## Overview
This document defines the commit message conventions to be used throughout the Tailwind to CSS Modules refactoring project.

## Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Type
Must be one of the following:

- **refactor**: Converting Tailwind to CSS Modules (most common for this project)
- **fix**: Bug fixes introduced during refactoring
- **docs**: Documentation changes
- **style**: CSS-only changes that don't affect functionality
- **test**: Adding or updating tests
- **chore**: Build process or auxiliary tool changes

### Scope
The component or area being refactored:

- **ui/[component]**: For UI components (e.g., `ui/button`, `ui/dialog`)
- **page/[name]**: For page components (e.g., `page/library`, `page/terms`)
- **feature/[name]**: For feature components (e.g., `feature/resume-editor`)
- **layout**: For layout components
- **docs**: For documentation updates
- **config**: For configuration changes

### Subject
A brief description of the change:

- Use imperative mood ("convert" not "converted")
- Don't capitalize first letter
- No period at the end
- Max 50 characters

### Body (Optional)
Detailed explanation of the change:

- Explain what Tailwind classes were converted
- Note any challenges or special considerations
- List any visual changes (there should be none)
- Wrap at 72 characters

### Footer (Optional)
References to issues or tracking:

- Reference the phase or ticket number
- Note any breaking changes (there should be none)

## Examples

### Basic Refactoring
```
refactor(ui/button): convert button component to CSS modules

- Converted all Tailwind utility classes to CSS module classes
- Created button.module.css with all styles
- Maintained all hover, focus, and disabled states
- Preserved all size and variant props
```

### Multiple Components
```
refactor(ui/form): convert form input components to CSS modules

- Converted Input, Textarea, and Label components
- Created individual CSS modules for each component
- Maintained form validation styles
- Preserved accessibility features
```

### Page Component
```
refactor(page/library): convert library page to CSS modules

- Replaced Tailwind classes with CSS module classes
- Created library.module.css
- Maintained responsive grid layout
- Preserved card styling and shadows
```

### Bug Fix During Refactoring
```
fix(ui/dialog): restore backdrop opacity after CSS module conversion

- Fixed backdrop opacity not applying correctly
- Adjusted z-index stacking for proper layering
```

### Documentation Update
```
docs(refactor): update conversion tracker for Phase 1 completion

- Marked layout components as completed
- Updated component count statistics
- Added notes about color variable usage
```

## Commit Message Templates

### Standard Refactoring Template
```
refactor(<scope>): convert <component> to CSS modules

- Converted Tailwind classes: <list main class patterns>
- Created/Updated: <filename>.module.css
- Maintained: <list preserved functionality>
- No visual changes
```

### Complex Component Template
```
refactor(<scope>): convert <component> with responsive design

- Converted responsive breakpoints (sm, md, lg)
- Maintained mobile-first approach
- Preserved all interactive states
- Created comprehensive media queries
- No visual regressions on any screen size
```

## Best Practices

### Do's ✅
- Be specific about what was converted
- Mention the CSS module file created/updated
- Note any responsive design considerations
- Confirm no visual changes
- Reference the tracking document when updating it

### Don'ts ❌
- Don't combine unrelated changes
- Don't commit partially converted components
- Don't include formatting changes with conversions
- Don't forget to test before committing

## Git Commands

### Staging Changes
```bash
# Stage specific files
git add src/components/ui/button.tsx
git add src/components/ui/button.module.css

# Review changes
git diff --staged
```

### Committing
```bash
# Commit with message
git commit -m "refactor(ui/button): convert button component to CSS modules

- Converted all Tailwind utility classes to CSS module classes
- Created button.module.css with all styles
- Maintained all hover, focus, and disabled states"
```

### Amending Commits
```bash
# If you need to update the last commit
git commit --amend
```

## Branch Naming

For sub-branches during the refactoring:

```
feature/tailwind-to-css-modules-<component>
feature/tailwind-to-css-modules-phase-<number>
```

Examples:
- `feature/tailwind-to-css-modules-ui-components`
- `feature/tailwind-to-css-modules-phase-1`

## Pull Request Guidelines

### PR Title
Follow the same format as commit messages:
```
refactor(ui): convert UI components to CSS modules (Phase 1)
```

### PR Description Template
```markdown
## Overview
Converting [component/area] from Tailwind CSS to CSS Modules as part of the refactoring project.

## Changes
- [ ] Converted component: [name]
- [ ] Created CSS module: [filename]
- [ ] Tested all states (hover, focus, disabled)
- [ ] Verified responsive behavior
- [ ] No visual regressions

## Components Affected
- Component 1
- Component 2

## Testing
- [ ] Visual testing completed
- [ ] Responsive design verified
- [ ] Interactive states tested
- [ ] Theme switching tested (if applicable)

## Screenshots
[Include before/after screenshots if helpful]

## References
- Tracking document: [link]
- Phase: [number]
```