# IT Asset Tracker - Quick Startup Guide

## Daily Startup Steps

| Step | Action | Command | Location |
|------|--------|---------|----------|
| 1 | Open Terminal 1 | `⌘T` (or File → New Tab) | Any location |
| 2 | Navigate to Frontend | `cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend` | Terminal 1 |
| 3 | Start Frontend Server | `npm run dev` | `~/asset-tracker/frontend` |
| 4 | Open Terminal 2 | `⌘T` (or File → New Tab) | Any location |
| 5 | Navigate to Backend | `cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend` | Terminal 2 |
| 6 | Start Backend Server | `./venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000` | `~/asset-tracker/backend` |
| 7 | Open Browser | Visit `http://localhost:5173` | Web Browser |
| 8 | Access App | Click on menu items and use the app | Frontend UI |

---

## Terminal 1: Frontend (npm run dev)

```
┌─────────────────────────────────────────────────────────────┐
│ TERMINAL 1 - FRONTEND                                       │
├─────────────────────────────────────────────────────────────┤
│ $ cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend
│ $ npm run dev
│
│ Expected Output:
│   VITE v5.4.21  ready in 164 ms
│   ➜  Local:   http://localhost:5173/
│   ➜  Network: use --host to expose
│   ➜  press h + enter to show help
│
│ Status: ✅ Ready on http://localhost:5173
└─────────────────────────────────────────────────────────────┘
```

---

## Terminal 2: Backend (uvicorn)

```
┌─────────────────────────────────────────────────────────────┐
│ TERMINAL 2 - BACKEND                                        │
├─────────────────────────────────────────────────────────────┤
│ $ cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend
│ $ ./venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
│
│ Expected Output:
│   INFO:     Will watch for changes in these directories: ['/Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend']
│   INFO:     Uvicorn running on http://127.0.0.1:8000 (Press CTRL+C to quit)
│   INFO:     Started reloader process [53466] using StatReload
│   INFO:     Started server process [53468]
│   INFO:     Waiting for application startup.
│   INFO:     Application startup complete.
│
│ Status: ✅ Ready on http://127.0.0.1:8000
└─────────────────────────────────────────────────────────────┘
```

---

## Complete Copy-Paste Commands

### Frontend Setup & Start
```bash
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend && npm run dev
```

### Backend Setup & Start
```bash
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend && ./venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

---

## Access Points

| Component | URL | Status |
|-----------|-----|--------|
| **Frontend (React UI)** | http://localhost:5173 | ✅ Open in Browser |
| **Backend API** | http://127.0.0.1:8000 | ✅ Running (Used by Frontend) |
| **API Docs (Optional)** | http://127.0.0.1:8000/docs | 📚 Swagger UI |

---

## Stopping the Application

| Component | How to Stop |
|-----------|------------|
| **Frontend** | Press `Ctrl+C` in Terminal 1 |
| **Backend** | Press `Ctrl+C` in Terminal 2 |
| **Both** | Press `Ctrl+C` in both terminals |

---

## Troubleshooting

### Frontend Won't Start

| Problem | Solution |
|---------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| `Port 5173 in use` | `npm run dev -- --port 3000` |
| `node_modules missing` | Run `npm install` in frontend directory |
| `Styles look broken` | Hard refresh: `Cmd+Shift+Delete` |

### Backend Won't Start

| Problem | Solution | Command |
|---------|----------|---------|
| `Port 8000 in use` | Kill process using that port | `lsof -i :8000` then `kill -9 [PID]` |
| `ModuleNotFoundError` | Install dependencies | `cd backend && ./venv/bin/pip install -r requirements.txt` |
| `venv not found` | Activate venv manually | `source venv/bin/activate` |
| `Permission denied` | Make file executable | `chmod +x venv/bin/python` |

### Both Services Won't Talk

| Problem | Solution |
|---------|----------|
| Frontend can't reach backend | Check backend is running on port 8000 |
| API returns 404 | Verify backend has started successfully |
| CORS errors | Backend CORS is already configured |

---

## Performance Check

After starting, verify everything works:

1. **Frontend loads** - Should see gradient dashboard with 7 colorful cards
2. **Can navigate** - Click ADD, ASSIGN, ASSETS, etc.
3. **API responds** - Forms should submit and get data
4. **No console errors** - Open DevTools (F12) and check console

---

## Environment Details

| Item | Value |
|------|-------|
| **Frontend Root** | `/Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend` |
| **Backend Root** | `/Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend` |
| **Python venv** | `/Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend/venv` |
| **Node Version** | 18.20.8 (check with `node -v`) |
| **Frontend Port** | 5173 |
| **Backend Port** | 8000 |
| **Frontend Tech** | React 18 + Vite + Tailwind CSS |
| **Backend Tech** | FastAPI + SQLAlchemy + PostgreSQL |

---

## One-Liner Shortcuts

### Start Both (In sequence)
```bash
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend && npm run dev & cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend && ./venv/bin/python -m uvicorn app.main:app --reload
```

### Kill All Node Processes
```bash
killall node
```

### Kill All Python Processes on Port 8000
```bash
lsof -ti:8000 | xargs kill -9
```

### Check if Ports are Available
```bash
lsof -i :5173
lsof -i :8000
```

---

## Daily Checklist

- [ ] Open Terminal 1 (Frontend)
- [ ] Navigate: `cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend`
- [ ] Start: `npm run dev`
- [ ] Wait for: "Local: http://localhost:5173/"
- [ ] Open Terminal 2 (Backend)
- [ ] Navigate: `cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/backend`
- [ ] Start: `./venv/bin/python -m uvicorn app.main:app --reload --host 127.0.0.1 --port 8000`
- [ ] Wait for: "Application startup complete"
- [ ] Open Browser: http://localhost:5173
- [ ] Test: Click a menu item to verify API connection
- [ ] Done! ✅

---

## File Locations Reference

```
/Users/parthan/Desktop/JobAssetTracker/
└── asset-tracker/
    ├── frontend/                    ← Start: npm run dev
    │   ├── src/
    │   ├── package.json
    │   ├── vite.config.js
    │   └── tailwind.config.js
    ├── backend/                     ← Start: uvicorn app.main:app
    │   ├── app/
    │   │   ├── main.py
    │   │   ├── database.py
    │   │   ├── models/
    │   │   ├── routes/
    │   │   └── schemas/
    │   ├── venv/                    ← Your Python environment
    │   └── requirements.txt
    └── MEDIA/
```

---

## That's It! 🎉

Just follow the **3 simple steps**:

1. Terminal 1: `npm run dev`
2. Terminal 2: `uvicorn app.main:app...`
3. Open: http://localhost:5173

Everything else is automatic! The venv is already configured, dependencies are installed, and the database is ready.

**Happy tracking!** 📊
