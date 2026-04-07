#!/bin/bash
# ============================================================
#  PAUSEnPAY — Install & Launch
#  Run: chmod +x install.sh && ./install.sh
# ============================================================
set -e
GREEN='\033[0;32m'; YELLOW='\033[1;33m'; NC='\033[0m'; BOLD='\033[1m'

echo ""
echo -e "${BOLD}  pauseNpay${NC} · Behavioral AI Spending Guard"
echo -e "  ─────────────────────────────────────────"
echo ""

if ! command -v node &>/dev/null; then echo "❌ Node.js not found → https://nodejs.org"; exit 1; fi
echo -e "${GREEN}✓ Node $(node -v)${NC}"

echo -e "${YELLOW}→ Installing dependencies...${NC}"
npm install

echo ""
echo -e "${GREEN}✓ Ready!${NC}"
echo ""
echo -e "  ${BOLD}To run locally:${NC}        npm run start"
echo -e "  ${BOLD}Open on your phone:${NC}    Find your IP with 'ipconfig'/'ifconfig'"
echo -e "                         Then open  http://YOUR_IP:5173  on phone"
echo ""
echo -e "  ${BOLD}Deploy to web (free):${NC}"
echo -e "  Netlify → drag & drop the 'dist' folder after: npm run build"
echo -e "  Vercel  → run: npx vercel --prod"
echo ""
npm run start
