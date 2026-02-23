#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}JobWorld Inventory Pro - WiFi Hosting${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Get the local IP address
LOCAL_IP=$(ifconfig | grep "inet " | grep -v 127.0.0.1 | awk '{print $2}' | head -n 1)

if [ -z "$LOCAL_IP" ]; then
    echo -e "${RED}❌ Could not detect local IP address${NC}"
    echo "Please make sure you are connected to WiFi"
    exit 1
fi

echo -e "${GREEN}✓ Local IP detected: ${LOCAL_IP}${NC}"
echo ""

# Navigate to the app directory
cd /Users/parthan/Desktop/JobAssetTracker || exit 1

# Kill any existing processes on ports 5173 (frontend) and 5000 (backend)
echo -e "${YELLOW}Stopping any existing processes...${NC}"
lsof -ti:5173 | xargs kill -9 2>/dev/null || true
lsof -ti:5000 | xargs kill -9 2>/dev/null || true
sleep 1

echo -e "${GREEN}✓ Cleaned up old processes${NC}"
echo ""

# Start backend in background
echo -e "${YELLOW}Starting backend server...${NC}"
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend || exit 1

# Activate virtual environment if it exists
if [ -d "venv/bin" ]; then
    source venv/bin/activate
fi

# Start the backend using uvicorn (localhost only, frontend will access via proxy)
python3 -m uvicorn app.main:app --host 127.0.0.1 --port 5000 > /tmp/backend.log 2>&1 &
BACKEND_PID=$!
sleep 3

if ps -p $BACKEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Backend running (PID: $BACKEND_PID)${NC}"
else
    echo -e "${RED}❌ Backend failed to start${NC}"
    cat /tmp/backend.log
    exit 1
fi
echo ""

# Start frontend in background
echo -e "${YELLOW}Starting frontend server...${NC}"
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend || exit 1

# Update vite config to listen on all interfaces
npm run dev -- --host 0.0.0.0 --port 5173 > /tmp/frontend.log 2>&1 &
FRONTEND_PID=$!
sleep 3

if ps -p $FRONTEND_PID > /dev/null; then
    echo -e "${GREEN}✓ Frontend running (PID: $FRONTEND_PID)${NC}"
else
    echo -e "${RED}❌ Frontend failed to start${NC}"
    cat /tmp/frontend.log
    kill $BACKEND_PID 2>/dev/null
    exit 1
fi

echo ""
echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}✓ App is now hosting on WiFi!${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""
echo -e "${YELLOW}Access from your phone:${NC}"
echo -e "${GREEN}http://${LOCAL_IP}:5173${NC}"
echo ""
echo -e "${YELLOW}Backend API (WiFi):${NC}"
echo -e "${GREEN}http://${LOCAL_IP}:5000${NC}"
echo ""
echo -e "${YELLOW}Make sure your phone is on the same WiFi network${NC}"
echo ""
echo -e "${YELLOW}Press Ctrl+C to stop the servers${NC}"
echo ""

# Keep the script running and show logs
trap "kill $BACKEND_PID $FRONTEND_PID 2>/dev/null; echo -e '\n${YELLOW}Servers stopped${NC}'; exit 0" SIGINT

# Tail the logs
while true; do
    sleep 1
done
