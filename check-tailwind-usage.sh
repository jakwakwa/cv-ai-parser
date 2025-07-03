#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Tailwind Usage Report${NC}"
echo "========================"

# Function to check a specific file
check_file() {
    local file=$1
    local patterns=(
        "className=.*['\"].*\b(flex|grid|block|inline|hidden)\b"
        "className=.*['\"].*\b(p|m|px|py|mx|my|mt|mb|ml|mr|pt|pb|pl|pr)-[0-9]"
        "className=.*['\"].*\b(w|h|min-w|max-w|min-h|max-h)-"
        "className=.*['\"].*\b(text|bg|border|rounded|shadow)-"
        "className=.*['\"].*\b(absolute|relative|fixed|sticky)\b"
        "className=.*['\"].*\b(hover:|focus:|active:|disabled:)"
        "className=.*['\"].*\b(sm:|md:|lg:|xl:|2xl:)"
    )
    
    local found=0
    for pattern in "${patterns[@]}"; do
        if grep -E "$pattern" "$file" > /dev/null 2>&1; then
            found=1
            break
        fi
    done
    
    return $found
}

# If a specific file is provided, check only that file
if [ $# -eq 1 ]; then
    echo -e "\nChecking file: $1"
    if check_file "$1"; then
        echo -e "${RED}❌ Tailwind classes found${NC}"
        grep -n "className=" "$1" | grep -E "(flex|grid|p-|m-|w-|h-|text-|bg-|border-|rounded-|shadow-|absolute|relative|fixed|sticky|hover:|focus:|sm:|md:|lg:|xl:)"
        exit 1
    else
        echo -e "${GREEN}✅ No Tailwind classes found${NC}"
        exit 0
    fi
fi

# Count total TSX files
TOTAL_TSX_FILES=$(find src/ app/ -name "*.tsx" 2>/dev/null | wc -l)

# Find files with Tailwind classes
echo -e "\nScanning for Tailwind classes..."
TAILWIND_FILES=""
FILE_COUNT=0

while IFS= read -r file; do
    if check_file "$file"; then
        TAILWIND_FILES="$TAILWIND_FILES\n  $file"
        ((FILE_COUNT++))
    fi
done < <(find src/ app/ -name "*.tsx" 2>/dev/null)

echo -e "\n${BLUE}Summary:${NC}"
echo "Total TSX files: $TOTAL_TSX_FILES"
echo "Files with Tailwind: $FILE_COUNT"
echo "Conversion progress: $((TOTAL_TSX_FILES - FILE_COUNT))/$TOTAL_TSX_FILES ($(( (TOTAL_TSX_FILES - FILE_COUNT) * 100 / TOTAL_TSX_FILES ))%)"

# Group by directory
echo -e "\n${BLUE}By Directory:${NC}"
for dir in "src/components/ui" "src/components" "app"; do
    if [ -d "$dir" ]; then
        DIR_TOTAL=$(find "$dir" -name "*.tsx" 2>/dev/null | wc -l)
        DIR_TAILWIND=0
        
        while IFS= read -r file; do
            if check_file "$file"; then
                ((DIR_TAILWIND++))
            fi
        done < <(find "$dir" -name "*.tsx" 2>/dev/null)
        
        if [ $DIR_TOTAL -gt 0 ]; then
            PERCENTAGE=$(( (DIR_TOTAL - DIR_TAILWIND) * 100 / DIR_TOTAL ))
            echo "  $dir: $((DIR_TOTAL - DIR_TAILWIND))/$DIR_TOTAL converted ($PERCENTAGE%)"
        fi
    fi
done

# List files that still need conversion
if [ $FILE_COUNT -gt 0 ]; then
    echo -e "\n${YELLOW}Files still using Tailwind:${NC}"
    echo -e "$TAILWIND_FILES"
    
    # Show most common patterns
    echo -e "\n${BLUE}Most common Tailwind patterns:${NC}"
    
    # Collect all className attributes with Tailwind classes
    PATTERNS=$(find src/ app/ -name "*.tsx" -exec grep -h "className=" {} \; 2>/dev/null | \
        grep -E "(flex|grid|p-|m-|w-|h-|text-|bg-|border-|rounded-|shadow-)" | \
        sed -E 's/.*className=["'\'']\s*([^"'\'']*).*/\1/' | \
        tr ' ' '\n' | \
        grep -E "^(flex|grid|p-|m-|w-|h-|text-|bg-|border-|rounded-|shadow-)" | \
        sort | uniq -c | sort -rn | head -10)
    
    echo "$PATTERNS"
else
    echo -e "\n${GREEN}🎉 No Tailwind classes found! Refactoring complete!${NC}"
fi

# Check for Tailwind imports
echo -e "\n${BLUE}Checking for Tailwind imports:${NC}"
if grep -r "from ['\"]tailwindcss" --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" . 2>/dev/null | grep -v node_modules; then
    echo -e "${YELLOW}⚠️  Found Tailwind imports that may need to be removed${NC}"
else
    echo -e "${GREEN}✅ No Tailwind imports found${NC}"
fi

# Exit with error if Tailwind classes found
if [ $FILE_COUNT -gt 0 ]; then
    exit 1
else
    exit 0
fi