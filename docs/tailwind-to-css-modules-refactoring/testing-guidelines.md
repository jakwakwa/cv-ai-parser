# Testing Guidelines for Tailwind to CSS Modules Refactoring

## Overview
This document outlines testing procedures to ensure no regressions during the conversion from Tailwind to CSS Modules.

## Testing Requirements

### Visual Testing
Every converted component must pass visual testing to ensure:
- No layout changes
- Correct spacing and alignment
- Proper colors and typography
- Maintained responsive behavior
- Preserved animations and transitions

### Functional Testing
Verify all interactive functionality:
- Click handlers work correctly
- Form inputs behave as expected
- State changes reflect visually
- Keyboard navigation works
- Accessibility features maintained

### Cross-browser Testing
Test on major browsers:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Testing Workflow

### 1. Pre-conversion Testing
```bash
# Take screenshots before conversion
npm run dev

# Document current behavior
# - Take screenshots at different viewport sizes
# - Record any animations
# - Note interactive states
```

### 2. During Conversion Testing

#### Component-Level Testing
```bash
# After converting each component
npm run dev

# Checklist:
# [ ] Component renders without errors
# [ ] All props work correctly
# [ ] Conditional rendering works
# [ ] Event handlers function
# [ ] No console errors/warnings
```

#### Visual Comparison
1. Open original and converted versions side-by-side
2. Check at multiple viewport widths:
   - Mobile: 375px
   - Tablet: 768px
   - Desktop: 1280px
   - Wide: 1920px

### 3. Post-conversion Testing

#### Automated Checks
```bash
# Run build
npm run build

# Run type checking
npm run type-check

# Check for unused CSS
npx purgecss --css src/**/*.module.css --content src/**/*.tsx
```

## Component Testing Checklist

### For Every Component

#### Visual Checks
- [ ] Layout matches original exactly
- [ ] Spacing (padding/margin) is correct
- [ ] Colors match (including opacity)
- [ ] Typography (size, weight, line-height) matches
- [ ] Borders and shadows are correct
- [ ] Border radius matches

#### Responsive Checks
- [ ] Mobile layout works
- [ ] Tablet layout works
- [ ] Desktop layout works
- [ ] No horizontal scroll at any size
- [ ] Text doesn't overflow containers

#### Interactive States
- [ ] Default state correct
- [ ] Hover state works
- [ ] Focus state visible
- [ ] Active state works
- [ ] Disabled state styled correctly
- [ ] Loading states (if applicable)

#### Dynamic Behavior
- [ ] Conditional classes apply correctly
- [ ] Animations/transitions work
- [ ] Theme switching works (if applicable)
- [ ] Dark mode works (if applicable)

### Special Component Considerations

#### Form Components
- [ ] Input focus states
- [ ] Validation error states
- [ ] Disabled field styling
- [ ] Label associations
- [ ] Placeholder text visibility

#### Navigation Components
- [ ] Active route highlighting
- [ ] Dropdown menus work
- [ ] Mobile menu behavior
- [ ] Keyboard navigation

#### Modal/Dialog Components
- [ ] Backdrop rendering
- [ ] Centering and positioning
- [ ] Scroll behavior
- [ ] Close functionality
- [ ] Focus trapping

## Manual Testing Scripts

### Basic Visual Test
```javascript
// Run in browser console to test responsive behavior
const sizes = [375, 768, 1024, 1280, 1920];
sizes.forEach(width => {
  window.resizeTo(width, 800);
  console.log(`Testing at ${width}px`);
  // Manually verify layout
});
```

### State Testing Helper
```javascript
// Test different states quickly
const button = document.querySelector('.button');

// Test hover
button.dispatchEvent(new MouseEvent('mouseenter'));
// Check visually

// Test focus
button.focus();
// Check focus styles

// Test active
button.dispatchEvent(new MouseEvent('mousedown'));
// Check active state
```

## Visual Regression Testing

### Screenshot Comparison
```bash
# Before conversion
mkdir -p testing/screenshots/before
# Take screenshots manually or with a tool

# After conversion
mkdir -p testing/screenshots/after
# Take matching screenshots

# Compare using image diff tools
```

### Using Browser DevTools
1. Open DevTools
2. Toggle device emulation
3. Test each breakpoint
4. Use "Capture screenshot" feature
5. Compare before/after

## Common Issues and Solutions

### Issue 1: Spacing Differences
**Symptoms**: Elements too close/far apart
**Check**:
- CSS Module has correct padding/margin values
- Box-sizing is set correctly
- No conflicting global styles

### Issue 2: Color Mismatches
**Symptoms**: Colors look different
**Check**:
- Using CSS variables correctly
- No hardcoded color values
- Opacity values included where needed

### Issue 3: Responsive Breakpoint Issues
**Symptoms**: Layout breaks at certain widths
**Check**:
- Media queries match Tailwind breakpoints
- Mobile-first approach maintained
- No missing responsive styles

### Issue 4: State Styles Not Applied
**Symptoms**: Hover/focus/active states missing
**Check**:
- Pseudo-class selectors in CSS
- No JavaScript preventing states
- Specificity issues

## Performance Testing

### CSS File Size
```bash
# Check CSS module sizes
find . -name "*.module.css" -exec wc -l {} \; | sort -n

# Ensure no bloated files
# CSS modules should generally be < 500 lines
```

### Build Performance
```bash
# Time the build
time npm run build

# Compare before/after refactoring
# Build time should not increase significantly
```

### Runtime Performance
1. Open DevTools Performance tab
2. Record page load
3. Check for:
   - No increase in paint time
   - No layout thrashing
   - Smooth animations (60fps)

## Acceptance Criteria

A component is considered successfully converted when:

### Must Pass
- [x] No visual differences from original
- [x] All interactive features work
- [x] Responsive design maintained
- [x] No console errors
- [x] Build passes
- [x] No TypeScript errors

### Should Pass
- [x] CSS file size reasonable
- [x] Performance unchanged or improved
- [x] Code is clean and maintainable
- [x] CSS follows project conventions

### Nice to Have
- [x] Improved accessibility
- [x] Reduced CSS specificity
- [x] Better organization
- [x] Performance improvements

## Testing Tools

### Recommended Browser Extensions
1. **Responsive Viewer** - Test multiple viewports
2. **ColorZilla** - Verify exact colors
3. **Pixel Perfect** - Overlay comparisons
4. **WAVE** - Accessibility testing

### Command Line Tools
```bash
# Install helpful tools
npm install -g purgecss
npm install -g css-validator

# Validate CSS syntax
css-validator src/**/*.module.css

# Check for unused styles
purgecss --css src/**/*.module.css --content src/**/*.tsx
```

## Reporting Issues

When finding issues during testing:

### Issue Template
```markdown
## Component: [Component Name]
## Issue Type: [Visual/Functional/Performance]

### Description
Brief description of the issue

### Expected Behavior
How it should look/work (reference original)

### Actual Behavior
How it currently looks/works

### Steps to Reproduce
1. Step one
2. Step two

### Screenshots
[Before] [After]

### Environment
- Browser: 
- Viewport size:
- Component props/state:
```

## Sign-off Process

Before marking a component as complete:

### Developer Checklist
- [ ] Self-tested all states
- [ ] Tested responsive behavior
- [ ] No console errors
- [ ] Code reviewed

### Reviewer Checklist
- [ ] Visual comparison done
- [ ] Interactive testing done
- [ ] Code quality acceptable
- [ ] Performance acceptable

### Final Approval
- [ ] Product owner/designer approval (if needed)
- [ ] Merged to main branch
- [ ] Tracking document updated