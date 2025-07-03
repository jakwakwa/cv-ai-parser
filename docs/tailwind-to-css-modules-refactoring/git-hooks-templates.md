# Git Hooks Templates

## Overview
These git hooks help maintain code quality and consistency during the Tailwind to CSS Modules refactoring.

## Pre-commit Hook

### Purpose
Checks for Tailwind classes in modified files and ensures CSS modules are created.

### Installation
Save as `.git/hooks/pre-commit` and make executable with `chmod +x .git/hooks/pre-commit`

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🔍 Running Tailwind to CSS Modules pre-commit checks..."

# Get list of staged TSX files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E '\.(tsx)$')

if [ -z "$STAGED_FILES" ]; then
    echo "✅ No TSX files to check"
    exit 0
fi

# Check for Tailwind classes in staged files
TAILWIND_PATTERNS=(
    "className=.*['\"].*\b(flex|grid|block|inline|hidden)\b"
    "className=.*['\"].*\b(p|m|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr)-[0-9]"
    "className=.*['\"].*\b(w|h|min-w|max-w|min-h|max-h)-"
    "className=.*['\"].*\b(text|bg|border|rounded|shadow)-"
    "className=.*['\"].*\b(absolute|relative|fixed|sticky)\b"
    "className=.*['\"].*\b(hover:|focus:|active:|disabled:)"
)

FOUND_TAILWIND=0
FILES_WITH_TAILWIND=""

for FILE in $STAGED_FILES; do
    # Skip UI components that haven't been refactored yet
    if [[ "$FILE" == *"src/components/ui/"* ]]; then
        continue
    fi
    
    for PATTERN in "${TAILWIND_PATTERNS[@]}"; do
        if grep -E "$PATTERN" "$FILE" > /dev/null 2>&1; then
            FOUND_TAILWIND=1
            FILES_WITH_TAILWIND="$FILES_WITH_TAILWIND\n  - $FILE"
            break
        fi
    done
    
    # Check if component has a corresponding CSS module
    if [[ "$FILE" == *.tsx ]]; then
        CSS_MODULE="${FILE%.tsx}.module.css"
        if [ ! -f "$CSS_MODULE" ] && grep -q "className=" "$FILE"; then
            echo -e "${YELLOW}⚠️  Warning: $FILE uses className but has no CSS module${NC}"
        fi
    fi
done

if [ $FOUND_TAILWIND -eq 1 ]; then
    echo -e "${RED}❌ Found Tailwind classes in the following files:${NC}"
    echo -e "$FILES_WITH_TAILWIND"
    echo -e "\n${YELLOW}These files need to be converted to CSS Modules before committing.${NC}"
    echo -e "Run 'git diff --cached' to see the changes."
    exit 1
fi

echo -e "${GREEN}✅ No Tailwind classes found in staged files${NC}"
exit 0
```

## Commit Message Hook

### Purpose
Validates commit message format according to project conventions.

### Installation
Save as `.git/hooks/commit-msg` and make executable with `chmod +x .git/hooks/commit-msg`

```bash
#!/bin/bash

# Read the commit message
COMMIT_MSG_FILE=$1
COMMIT_MSG=$(cat $COMMIT_MSG_FILE)

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🔍 Validating commit message format..."

# Define valid types
VALID_TYPES="refactor|fix|docs|style|test|chore"

# Define valid scopes
VALID_SCOPES="ui\/[a-z-]+|page\/[a-z-]+|feature\/[a-z-]+|layout|docs|config"

# Regex pattern for commit message
PATTERN="^($VALID_TYPES)\(($VALID_SCOPES)\): .{1,50}$"

# Get first line of commit message
FIRST_LINE=$(echo "$COMMIT_MSG" | head -n1)

# Check if commit message matches pattern
if ! echo "$FIRST_LINE" | grep -qE "$PATTERN"; then
    echo -e "${RED}❌ Invalid commit message format${NC}"
    echo -e "\nExpected format: <type>(<scope>): <subject>"
    echo -e "\nValid types: refactor, fix, docs, style, test, chore"
    echo -e "Valid scopes: ui/*, page/*, feature/*, layout, docs, config"
    echo -e "\nExample: refactor(ui/button): convert button component to CSS modules"
    exit 1
fi

# Check subject line length
SUBJECT=$(echo "$FIRST_LINE" | sed -E "s/^[a-z]+\([a-z\/\-]+\): //")
if [ ${#SUBJECT} -gt 50 ]; then
    echo -e "${YELLOW}⚠️  Warning: Subject line is longer than 50 characters${NC}"
fi

# Special check for refactor commits
if echo "$FIRST_LINE" | grep -q "^refactor"; then
    # Check if body mentions CSS modules
    BODY=$(tail -n +3 "$COMMIT_MSG_FILE")
    if ! echo "$BODY" | grep -qi "css module\|module\.css"; then
        echo -e "${YELLOW}⚠️  Warning: Refactor commit doesn't mention CSS modules${NC}"
        echo -e "Consider adding details about the CSS module conversion"
    fi
fi

echo -e "${GREEN}✅ Commit message format is valid${NC}"
exit 0
```

## Pre-push Hook

### Purpose
Runs final checks before pushing to ensure no Tailwind remnants and all tests pass.

### Installation
Save as `.git/hooks/pre-push` and make executable with `chmod +x .git/hooks/pre-push`

```bash
#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo "🚀 Running pre-push checks for Tailwind refactoring..."

# Get the branch name
BRANCH=$(git rev-parse --abbrev-ref HEAD)

# Only run on feature/tailwind-to-css-modules branches
if [[ ! "$BRANCH" =~ ^feature/tailwind-to-css-modules ]]; then
    exit 0
fi

# Check for any remaining Tailwind config imports
echo "Checking for Tailwind imports..."
if grep -r "from 'tailwindcss" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ app/; then
    echo -e "${RED}❌ Found Tailwind imports that should be removed${NC}"
    exit 1
fi

# Run build to ensure no compilation errors
echo "Running build check..."
if ! npm run build > /dev/null 2>&1; then
    echo -e "${RED}❌ Build failed. Please fix errors before pushing${NC}"
    exit 1
fi

# Check for console.log statements
echo "Checking for console.log statements..."
if grep -r "console\.log" --include="*.ts" --include="*.tsx" src/ app/; then
    echo -e "${YELLOW}⚠️  Warning: Found console.log statements${NC}"
fi

echo -e "${GREEN}✅ All pre-push checks passed${NC}"
exit 0
```

## Setup Script

### Purpose
Installs all git hooks at once.

### Usage
Save as `setup-hooks.sh` in the project root and run with `bash setup-hooks.sh`

```bash
#!/bin/bash

echo "Setting up git hooks for Tailwind to CSS Modules refactoring..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Function to create hook
create_hook() {
    HOOK_NAME=$1
    HOOK_CONTENT=$2
    
    echo "$HOOK_CONTENT" > ".git/hooks/$HOOK_NAME"
    chmod +x ".git/hooks/$HOOK_NAME"
    echo "✅ Created $HOOK_NAME hook"
}

# Create pre-commit hook
create_hook "pre-commit" '#!/bin/bash
# [Insert pre-commit hook content here]
'

# Create commit-msg hook
create_hook "commit-msg" '#!/bin/bash
# [Insert commit-msg hook content here]
'

# Create pre-push hook
create_hook "pre-push" '#!/bin/bash
# [Insert pre-push hook content here]
'

echo "🎉 Git hooks setup complete!"
```

## Additional Utility Scripts

### Check Tailwind Usage

```bash
#!/bin/bash
# check-tailwind-usage.sh
# Run this to get a report of Tailwind usage in the codebase

echo "📊 Tailwind Usage Report"
echo "========================"

# Count files with Tailwind classes
TAILWIND_FILES=$(grep -r "className=.*['\"].*\b(flex|grid|p-|m-|w-|h-|text-|bg-)" --include="*.tsx" src/ app/ | cut -d: -f1 | sort | uniq)
TOTAL_FILES=$(find src/ app/ -name "*.tsx" | wc -l)
TAILWIND_COUNT=$(echo "$TAILWIND_FILES" | wc -l)

echo "Files with Tailwind: $TAILWIND_COUNT / $TOTAL_FILES"
echo ""

# Group by directory
echo "By Directory:"
for DIR in src/components/ui src/components app; do
    COUNT=$(echo "$TAILWIND_FILES" | grep "^$DIR" | wc -l)
    echo "  $DIR: $COUNT files"
done
```

### Validate CSS Modules

```bash
#!/bin/bash
# validate-css-modules.sh
# Ensures all TSX files with className have corresponding CSS modules

echo "🔍 Validating CSS Modules..."

MISSING_MODULES=""

# Find all TSX files with className
FILES_WITH_CLASSNAME=$(grep -r "className=" --include="*.tsx" src/ app/ | cut -d: -f1 | sort | uniq)

for FILE in $FILES_WITH_CLASSNAME; do
    # Skip test files
    if [[ "$FILE" == *".test.tsx" ]] || [[ "$FILE" == *".spec.tsx" ]]; then
        continue
    fi
    
    # Check for CSS module
    CSS_MODULE="${FILE%.tsx}.module.css"
    if [ ! -f "$CSS_MODULE" ]; then
        # Check if it uses styles import
        if ! grep -q "import.*styles.*from.*\.module\.css" "$FILE"; then
            MISSING_MODULES="$MISSING_MODULES\n  $FILE"
        fi
    fi
done

if [ -n "$MISSING_MODULES" ]; then
    echo -e "❌ Files missing CSS modules:"
    echo -e "$MISSING_MODULES"
else
    echo "✅ All files with className have CSS modules"
fi
```

## Usage Guidelines

1. **Install hooks before starting refactoring work**
   ```bash
   bash setup-hooks.sh
   ```

2. **Run utility scripts periodically**
   ```bash
   bash check-tailwind-usage.sh
   bash validate-css-modules.sh
   ```

3. **Customize hooks as needed**
   - Add directories to skip
   - Adjust patterns for your specific use case
   - Add additional checks

4. **Bypass hooks when necessary** (use sparingly)
   ```bash
   git commit --no-verify
   git push --no-verify
   ```

## Troubleshooting

### Hook not running
- Ensure hook file is executable: `chmod +x .git/hooks/hook-name`
- Check hook file exists in `.git/hooks/`

### False positives
- Update patterns in hooks to match your code style
- Add exceptions for specific files or directories

### Performance issues
- Limit checks to staged files only
- Use more specific file patterns