#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${YELLOW}🔄 Starting Fresh Restart...${NC}"

# 1. Kill all Node/npm/vite processes
echo -e "${RED}⛔ Killing frontend processes...${NC}"
pkill -9 node 2>/dev/null
pkill -9 npm 2>/dev/null
pkill -9 vite 2>/dev/null

# 2. Kill all Python/uvicorn processes
echo -e "${RED}⛔ Killing backend processes...${NC}"
pkill -9 -f "uvicorn" 2>/dev/null
pkill -9 -f "python" 2>/dev/null

# 3. Clear ports
echo -e "${RED}🚫 Clearing ports 5173 and 8000...${NC}"
lsof -i :5173 -t 2>/dev/null | xargs kill -9 2>/dev/null
lsof -i :8000 -t 2>/dev/null | xargs kill -9 2>/dev/null

sleep 3

# 4. Start Backend
echo -e "${YELLOW}⚙️  Starting Backend (port 8000)...${NC}"
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend
nohup /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend/venv/bin/python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
echo -e "${GREEN}✅ Backend started (PID: $BACKEND_PID)${NC}"

sleep 3

# 5. Start Frontend
echo -e "${YELLOW}⚙️  Starting Frontend (port 5173)...${NC}"
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend
nohup npm run dev > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
echo -e "${GREEN}✅ Frontend started (PID: $FRONTEND_PID)${NC}"

sleep 4

# 6. Verify both are running
echo -e "${YELLOW}📋 Verifying servers...${NC}"
BACKEND_CHECK=$(curl -s http://127.0.0.1:8000/ 2>&1 | grep -q "Asset Tracker" && echo "✅" || echo "❌")
FRONTEND_CHECK=$(lsof -i :5173 2>&1 | grep -q node && echo "✅" || echo "❌")

echo -e "${GREEN}Backend: $BACKEND_CHECK${NC}"
echo -e "${GREEN}Frontend: $FRONTEND_CHECK${NC}"

echo -e "${GREEN}🚀 Application Ready!${NC}"
echo -e "${YELLOW}Backend: http://127.0.0.1:8000${NC}"
echo -e "${YELLOW}Frontend: http://localhost:5173${NC}"
