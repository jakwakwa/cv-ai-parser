#!/bin/bash

echo "🔧 Setting up git hooks for Tailwind to CSS Modules refactoring..."

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Function to create hook
create_hook() {
    HOOK_NAME=$1
    HOOK_FILE=".git/hooks/$HOOK_NAME"
    
    # Back up existing hook if it exists
    if [ -f "$HOOK_FILE" ]; then
        echo "⚠️  Backing up existing $HOOK_NAME hook to $HOOK_FILE.backup"
        cp "$HOOK_FILE" "$HOOK_FILE.backup"
    fi
    
    # Create the hook based on the name
    case $HOOK_NAME in
        "pre-commit")
            cat > "$HOOK_FILE" << 'EOF'
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
EOF
            ;;
            
        "commit-msg")
            cat > "$HOOK_FILE" << 'EOF'
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
EOF
            ;;
            
        "pre-push")
            cat > "$HOOK_FILE" << 'EOF'
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
if grep -r "from 'tailwindcss" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" src/ app/ 2>/dev/null; then
    echo -e "${RED}❌ Found Tailwind imports that should be removed${NC}"
    exit 1
fi

# Run build to ensure no compilation errors
echo "Running build check..."
if command -v npm &> /dev/null; then
    if ! npm run build > /dev/null 2>&1; then
        echo -e "${RED}❌ Build failed. Please fix errors before pushing${NC}"
        exit 1
    fi
fi

# Check for console.log statements
echo "Checking for console.log statements..."
if grep -r "console\.log" --include="*.ts" --include="*.tsx" src/ app/ 2>/dev/null; then
    echo -e "${YELLOW}⚠️  Warning: Found console.log statements${NC}"
fi

echo -e "${GREEN}✅ All pre-push checks passed${NC}"
exit 0
EOF
            ;;
    esac
    
    # Make the hook executable
    chmod +x "$HOOK_FILE"
    echo "✅ Created $HOOK_NAME hook"
}

# Create all hooks
create_hook "pre-commit"
create_hook "commit-msg"
create_hook "pre-push"

echo ""
echo "🎉 Git hooks setup complete!"
echo ""
echo "The following hooks have been installed:"
echo "  - pre-commit: Checks for Tailwind classes in staged files"
echo "  - commit-msg: Validates commit message format"
echo "  - pre-push: Runs final checks before pushing"
echo ""
echo "To bypass hooks when necessary (use sparingly):"
echo "  git commit --no-verify"
echo "  git push --no-verify"
echo ""
echo "To test the hooks:"
echo "  bash check-tailwind-usage.sh"
echo "  bash validate-css-modules.sh"