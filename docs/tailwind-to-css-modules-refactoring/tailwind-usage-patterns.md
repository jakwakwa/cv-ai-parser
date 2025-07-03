# Current Tailwind Usage Patterns

## Overview
This document catalogs the current usage of Tailwind CSS classes throughout the codebase to guide the conversion to CSS Modules.

## Usage Statistics

### Component Distribution
- **UI Components (src/components/ui/)**: Heavy usage - 30+ components
- **Page Components (app/)**: Moderate usage - 5 pages
- **Feature Components**: Moderate usage - Various components
- **Layout Components**: Light usage - Header, Navigation

### Common Tailwind Patterns

#### 1. Layout Classes
```
flex, flex-col, flex-row, grid, grid-cols-*
items-center, justify-center, justify-between
gap-*, space-y-*, space-x-*
```

#### 2. Spacing Classes
```
p-*, px-*, py-*, pt-*, pb-*, pl-*, pr-*
m-*, mx-*, my-*, mt-*, mb-*, ml-*, mr-*
```

#### 3. Sizing Classes
```
w-*, h-*, min-w-*, max-w-*, min-h-*, max-h-*
w-full, h-full
```

#### 4. Typography Classes
```
text-*, text-sm, text-lg, text-xl, text-2xl, text-3xl
font-*, font-semibold, font-bold
text-center, text-left
```

#### 5. Color Classes
```
bg-*, text-*, border-*
bg-white, bg-gray-*, bg-black, bg-muted
text-white, text-gray-*, text-foreground, text-muted-foreground
```

#### 6. Border & Radius Classes
```
border, border-*, border-t, border-b
rounded-*, rounded-md, rounded-lg, rounded-full
```

#### 7. Position Classes
```
relative, absolute, fixed, sticky
top-*, bottom-*, left-*, right-*
z-*
```

#### 8. State & Interaction Classes
```
hover:*, focus:*, disabled:*
transition-*, duration-*
animate-*
```

## Component-Specific Patterns

### UI Components (src/components/ui/)
These components make extensive use of Tailwind with complex utility combinations:

1. **Sheet Component**
   - Complex positioning: `absolute right-4 top-4`
   - State variants: `hover:opacity-100`
   - Focus states: `focus:ring-2 focus:ring-ring`

2. **Dialog/Modal Components**
   - Backdrop: `fixed inset-0 z-50 bg-black/80`
   - Content positioning: `max-w-4xl max-h-[90vh]`

3. **Form Components (Input, Select, etc.)**
   - Consistent spacing and sizing patterns
   - Focus and disabled states

4. **Navigation Components**
   - Responsive patterns: `hidden md:block`
   - Flex layouts for alignment

### Page Components

1. **Layout (app/layout.tsx)**
   - Footer styling: `py-8 w-full shrink-0 items-center px-4 md:px-6`
   - Responsive breakpoints: `sm:flex-row`

2. **Terms & Privacy Pages**
   - Typography hierarchy: `text-3xl font-bold mb-4`
   - Container patterns: `container mx-auto p-4`

3. **Library Page**
   - Card patterns: `bg-white rounded-lg shadow-sm border`
   - Centering patterns: `max-w-md mx-auto`

### Feature Components

1. **Resume Display**
   - Grid layouts: `grid grid-cols-1 md:grid-cols-3`
   - Responsive columns: `md:col-span-1`

2. **Color Picker Dialog**
   - Modal patterns similar to UI dialogs
   - Footer styling: `bg-gray-50 flex justify-end`

## Conversion Priorities

### High Priority (Most Used)
1. Layout utilities (flex, grid, spacing)
2. Typography utilities
3. Color utilities
4. Responsive utilities

### Medium Priority
1. Border and radius utilities
2. Position utilities
3. State variants

### Low Priority
1. Animation utilities
2. Complex compound utilities

## Challenges to Address

1. **Dynamic Classes**: Some components use dynamic class construction
2. **Responsive Design**: Many `md:`, `sm:`, `lg:` breakpoint classes
3. **State Variants**: Hover, focus, disabled states
4. **Color System**: Uses both Tailwind colors and custom CSS variables
5. **Utility Combinations**: Complex combinations like `flex items-center justify-between`

## CSS Module Patterns to Establish

1. **Layout Modules**: Common layout patterns
2. **Typography Module**: Text styles and sizes
3. **Spacing Module**: Consistent spacing scale
4. **Color Module**: Color variables and themes
5. **Component-Specific Modules**: Per-component styles

## Notes
- The UI components directory has the heaviest Tailwind usage
- Many components use the `cn()` utility for conditional classes
- Some components already have partial CSS modules (e.g., page.module.css)
- Color system uses CSS variables (e.g., `text-foreground`, `bg-muted`)