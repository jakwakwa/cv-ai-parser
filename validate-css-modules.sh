#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}🔍 Validating CSS Modules${NC}"
echo "========================"

MISSING_MODULES=""
UNUSED_MODULES=""
STYLE_IMPORT_MISSING=""
TOTAL_ISSUES=0

# Find all TSX files with className
echo "Checking for components with className but no CSS module..."
FILES_WITH_CLASSNAME=$(grep -r "className=" --include="*.tsx" src/ app/ 2>/dev/null | cut -d: -f1 | sort | uniq)

for FILE in $FILES_WITH_CLASSNAME; do
    # Skip test files
    if [[ "$FILE" == *".test.tsx" ]] || [[ "$FILE" == *".spec.tsx" ]]; then
        continue
    fi
    
    # Get the base name for CSS module
    CSS_MODULE="${FILE%.tsx}.module.css"
    MODULE_NAME=$(basename "${FILE%.tsx}")
    
    # Check if CSS module exists
    if [ ! -f "$CSS_MODULE" ]; then
        # Check if it imports styles from another CSS module
        if ! grep -q "import.*styles.*from.*\.module\.css" "$FILE"; then
            # Check if it only uses global classes or inline styles
            if grep -q "className={styles\." "$FILE" 2>/dev/null; then
                MISSING_MODULES="$MISSING_MODULES\n  ❌ $FILE (references styles but no module found)"
                ((TOTAL_ISSUES++))
            elif grep -q "className=['\"][^{]" "$FILE" 2>/dev/null; then
                # Has hardcoded className, might be using Tailwind
                if grep -E "className=.*['\"].*\b(flex|grid|p-|m-|w-|h-|text-|bg-)" "$FILE" > /dev/null 2>&1; then
                    # Skip, will be caught by Tailwind checker
                    continue
                fi
            fi
        fi
    else
        # CSS module exists, check if it's imported
        if ! grep -q "import.*from.*['\"].*$(basename "$CSS_MODULE")['\"]" "$FILE"; then
            STYLE_IMPORT_MISSING="$STYLE_IMPORT_MISSING\n  ⚠️  $FILE (has module but doesn't import it)"
            ((TOTAL_ISSUES++))
        fi
    fi
done

# Find orphaned CSS modules
echo -e "\nChecking for orphaned CSS modules..."
CSS_MODULES=$(find src/ app/ -name "*.module.css" 2>/dev/null)

for MODULE in $CSS_MODULES; do
    # Get corresponding TSX file
    TSX_FILE="${MODULE%.module.css}.tsx"
    
    if [ ! -f "$TSX_FILE" ]; then
        # Check if any file imports this module
        MODULE_NAME=$(basename "$MODULE")
        if ! grep -r "from.*['\"].*$MODULE_NAME['\"]" --include="*.tsx" --include="*.ts" src/ app/ > /dev/null 2>&1; then
            UNUSED_MODULES="$UNUSED_MODULES\n  ⚠️  $MODULE (no corresponding component)"
            ((TOTAL_ISSUES++))
        fi
    fi
done

# Check CSS module quality
echo -e "\nChecking CSS module quality..."
QUALITY_ISSUES=""

for MODULE in $CSS_MODULES; do
    # Check for empty modules
    if [ ! -s "$MODULE" ]; then
        QUALITY_ISSUES="$QUALITY_ISSUES\n  ⚠️  $MODULE is empty"
        ((TOTAL_ISSUES++))
        continue
    fi
    
    # Check for extremely large modules
    LINE_COUNT=$(wc -l < "$MODULE")
    if [ $LINE_COUNT -gt 500 ]; then
        QUALITY_ISSUES="$QUALITY_ISSUES\n  ⚠️  $MODULE is very large ($LINE_COUNT lines)"
        ((TOTAL_ISSUES++))
    fi
    
    # Check for hardcoded colors (should use CSS variables)
    if grep -E "#[0-9a-fA-F]{3,6}|rgb\(|rgba\(" "$MODULE" > /dev/null 2>&1; then
        HARDCODED_COLORS=$(grep -n -E "#[0-9a-fA-F]{3,6}|rgb\(|rgba\(" "$MODULE" | head -3)
        QUALITY_ISSUES="$QUALITY_ISSUES\n  ⚠️  $MODULE has hardcoded colors (use CSS variables)"
        ((TOTAL_ISSUES++))
    fi
done

# Report results
echo -e "\n${BLUE}=== Validation Results ===${NC}\n"

if [ -n "$MISSING_MODULES" ]; then
    echo -e "${RED}Components missing CSS modules:${NC}"
    echo -e "$MISSING_MODULES"
    echo ""
fi

if [ -n "$STYLE_IMPORT_MISSING" ]; then
    echo -e "${YELLOW}Components not importing their CSS modules:${NC}"
    echo -e "$STYLE_IMPORT_MISSING"
    echo ""
fi

if [ -n "$UNUSED_MODULES" ]; then
    echo -e "${YELLOW}Orphaned CSS modules:${NC}"
    echo -e "$UNUSED_MODULES"
    echo ""
fi

if [ -n "$QUALITY_ISSUES" ]; then
    echo -e "${YELLOW}CSS module quality issues:${NC}"
    echo -e "$QUALITY_ISSUES"
    echo ""
fi

# Summary
echo -e "${BLUE}Summary:${NC}"
echo "Total TSX files with className: $(echo "$FILES_WITH_CLASSNAME" | wc -l)"
echo "Total CSS modules: $(echo "$CSS_MODULES" | wc -l)"
echo "Issues found: $TOTAL_ISSUES"

if [ $TOTAL_ISSUES -eq 0 ]; then
    echo -e "\n${GREEN}✅ All CSS modules are properly set up!${NC}"
    exit 0
else
    echo -e "\n${RED}❌ Found $TOTAL_ISSUES issue(s) that need attention${NC}"
    
    # Provide helpful commands
    echo -e "\n${BLUE}Helpful commands:${NC}"
    echo "# Create a CSS module for a component:"
    echo "touch src/components/example.module.css"
    echo ""
    echo "# Import CSS module in component:"
    echo "import styles from './example.module.css';"
    echo ""
    echo "# Check specific component:"
    echo "grep -n \"className\" src/components/example.tsx"
    
    exit 1
fi