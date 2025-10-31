#!/bin/bash

# Super detailed script - shows exact code lines where packages are used
# Usage: ./check-packages-verbose.sh

echo "🔍 Verbose Package Usage Analysis"
echo "================================================"
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# List packages to check
packages=(
    # "@trivago/prettier-plugin-sort-imports"
    # "@types/jest"
    # "prettier"
    # "prettier-plugin-tailwindcss"
    # "react-dom"
    # "@testing-library/jest-dom"
    # "@testing-library/react"
    # "@testing-library/user-event"
    # "@types/node"
    # "@types/react-dom"
    # "autoprefixer"
    # "jest"
    # "jest-environment-jsdom"
    # "postcss"
    # "tailwindcss-animate"
    # "typescript"
)

# Config files to check
config_files=(
    ".eslintrc.js"
    ".eslintrc.json"
    ".prettierrc"
    ".prettierrc.js"
    "prettier.config.js"
    "jest.config.js"
    "jest.config.ts"
    "tsconfig.json"
    "tailwind.config.js"
    "tailwind.config.ts"
    "postcss.config.js"
    "next.config.js"
    "next.config.ts"
)

# Counters
total_found=0
total_not_found=0

# Search for each package
for package in "${packages[@]}"; do
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    echo -e "${CYAN}📦 Package: $package${NC}"
    echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
    
    found_anywhere=false
    
    # Search in source code with context
    echo -e "${BLUE}Searching in source code...${NC}"
    code_result=$(grep -rn "$package" . \
        --include="*.ts" \
        --include="*.tsx" \
        --include="*.js" \
        --include="*.jsx" \
        --exclude-dir=node_modules \
        --exclude-dir=.next \
        --exclude-dir=.git \
        --exclude-dir=dist \
        --exclude-dir=build \
        --exclude-dir=coverage \
        2>/dev/null)
    
    if [ ! -z "$code_result" ]; then
        echo -e "${GREEN}✅ Found in source code:${NC}"
        echo ""
        
        # Parse and display each match
        while IFS= read -r line; do
            # Extract filename, line number, and content
            file=$(echo "$line" | cut -d: -f1)
            linenum=$(echo "$line" | cut -d: -f2)
            content=$(echo "$line" | cut -d: -f3-)
            
            echo -e "   ${YELLOW}File:${NC} $file"
            echo -e "   ${YELLOW}Line:${NC} $linenum"
            echo -e "   ${YELLOW}Code:${NC}$content"
            echo ""
        done <<< "$code_result"
        
        found_anywhere=true
    else
        echo -e "${RED}   ❌ Not found in source code${NC}"
        echo ""
    fi
    
    # Search in config files
    echo -e "${BLUE}Searching in config files...${NC}"
    found_in_config=false
    
    for config in "${config_files[@]}"; do
        if [ -f "$config" ]; then
            config_matches=$(grep -n "$package" "$config" 2>/dev/null)
            if [ ! -z "$config_matches" ]; then
                if [ "$found_in_config" = false ]; then
                    echo -e "${GREEN}✅ Found in config files:${NC}"
                    echo ""
                    found_in_config=true
                fi
                
                echo -e "   ${YELLOW}File:${NC} $config"
                while IFS=: read -r linenum content; do
                    echo -e "   ${YELLOW}Line:${NC} $linenum"
                    echo -e "   ${YELLOW}Code:${NC}$content"
                done <<< "$config_matches"
                echo ""
                
                found_anywhere=true
            fi
        fi
    done
    
    if [ "$found_in_config" = false ]; then
        echo -e "${RED}   ❌ Not found in config files${NC}"
        echo ""
    fi
    
    # Overall status for this package
    if [ "$found_anywhere" = true ]; then
        echo -e "${GREEN}✅ VERDICT: Package IS being used${NC}"
        ((total_found++))
    else
        echo -e "${RED}❌ VERDICT: Package appears UNUSED - safe to remove${NC}"
        ((total_not_found++))
    fi
    
    echo ""
    echo ""
done

# Final Summary
echo "================================================"
echo "📊 FINAL SUMMARY"
echo "================================================"
echo ""
echo -e "${GREEN}Packages found in use: $total_found${NC}"
echo -e "${RED}Packages not found (safe to remove): $total_not_found${NC}"
echo ""

# List packages safe to remove
if [ $total_not_found -gt 0 ]; then
    echo -e "${RED}To remove unused packages, run:${NC}"
    echo ""
    unused_packages=()
    
    for package in "${packages[@]}"; do
        # Quick check if package was found
        if ! grep -rq "$package" . \
            --include="*.ts" --include="*.tsx" --include="*.js" --include="*.jsx" \
            --exclude-dir=node_modules --exclude-dir=.next --exclude-dir=.git \
            2>/dev/null; then
            
            # Check config files too
            found_in_config=false
            for config in "${config_files[@]}"; do
                if [ -f "$config" ] && grep -q "$package" "$config" 2>/dev/null; then
                    found_in_config=true
                    break
                fi
            done
            
            if [ "$found_in_config" = false ]; then
                unused_packages+=("$package")
            fi
        fi
    done
    
    if [ ${#unused_packages[@]} -gt 0 ]; then
        echo "yarn remove ${unused_packages[@]}"
        echo ""
    fi
fi

echo "================================================"
echo "✅ Analysis complete!"
echo "================================================"
