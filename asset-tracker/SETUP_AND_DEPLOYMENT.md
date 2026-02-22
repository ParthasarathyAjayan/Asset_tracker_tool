# Setup & Deployment Guide

## Prerequisites

### System Requirements
- **Node.js**: 20.19.0 or higher (or 22.12.0+)
- **npm**: 10.0.0 or higher
- **Modern Browser**: Chrome, Firefox, Safari, or Edge

### Check Your Node Version
```bash
node --version
npm --version
```

If your Node version is too old, upgrade it:
```bash
# Using Homebrew (macOS)
brew install node@20
brew link node@20 --overwrite

# Or download from https://nodejs.org/
```

---

## Installation

### 1. Clone/Navigate to Project
```bash
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker
```

### 2. Install Frontend Dependencies
```bash
cd frontend
npm install
```

This will install:
- React 19.2.0
- React Router DOM 7.13.0
- Tailwind CSS 4.2.0
- PostCSS 8.5.6
- And other development dependencies

### 3. Verify Installation
```bash
npm list react react-dom react-router-dom tailwindcss
```

---

## Running the Application

### Development Server

Start the frontend development server:
```bash
cd frontend
npm run dev
```

You should see output like:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

### Backend Server

In a new terminal, start the backend:
```bash
cd backend
uvicorn app.main:app --reload
```

You should see:
```
INFO:     Application startup complete
```

### Access the App

Open your browser to: **http://localhost:5173**

---

## Development Workflow

### File Structure
```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── index.js
│   ├── pages/               # Page components
│   │   ├── Add.jsx
│   │   ├── Assign.jsx
│   │   ├── Assets.jsx
│   │   ├── Clearance.jsx
│   │   ├── Employees.jsx
│   │   ├── Out.jsx
│   │   └── Repair.jsx
│   ├── api/
│   │   └── api.js          # API calls
│   ├── App.jsx             # Main app component
│   ├── index.css           # Global styles (Tailwind)
│   └── main.jsx            # Entry point
├── index.html
├── tailwind.config.js      # Tailwind config
├── postcss.config.js       # PostCSS config
└── package.json
```

### Adding New Features

1. **Create a New Page**
```jsx
// src/pages/NewPage.jsx
import { Card, Button } from "../components";

export default function NewPage() {
  return (
    <div className="page">
      <h2 className="text-4xl font-bold text-gray-800">New Page</h2>
      {/* Your content */}
    </div>
  );
}
```

2. **Add Route**
```jsx
// In App.jsx
import NewPage from "./pages/NewPage";

// In Routes
<Route path="/new-page" element={<><BackButton /><NewPage /></>} />
```

3. **Add Menu Item**
```jsx
// In Menu component
const menuItems = [
  // ... existing items
  { label: "NEW PAGE", path: "/new-page", icon: "📄", color: "from-cyan-500 to-cyan-600" },
];
```

### Customizing Tailwind

Edit `tailwind.config.js` to change colors, fonts, animations:

```javascript
export default {
  theme: {
    extend: {
      colors: {
        primary: {
          500: '#your-color',
        },
      },
    },
  },
}
```

Then use in your components:
```jsx
<div className="bg-primary-500">Custom color</div>
```

---

## Building for Production

### 1. Build the Frontend
```bash
cd frontend
npm run build
```

This creates a `dist/` folder with optimized production files.

### 2. Preview the Build
```bash
npm run preview
```

### 3. Serve in Production
Use any static file server to serve the `dist/` folder:

```bash
# Using Python
python -m http.server 8080 --directory dist

# Using Node
npx serve dist

# Using nginx (production)
# Configure nginx to serve dist/ folder
```

---

## Environment Setup

### Frontend Environment Variables
Create `.env` file in `frontend/` directory:

```
VITE_API_URL=http://127.0.0.1:8000
VITE_APP_NAME=IT Asset Tracker
```

Update `api.js`:
```javascript
const BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
```

### Backend Environment Variables
Create `.env` file in `backend/` directory:

```
DATABASE_URL=postgresql://user:password@localhost/asset_tracker
SECRET_KEY=your-secret-key
DEBUG=False
```

---

## Deployment Options

### Option 1: Vercel (Recommended for Frontend)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd frontend
vercel
```

### Option 2: Netlify
```bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
cd frontend
netlify deploy --prod --dir=dist
```

### Option 3: AWS S3 + CloudFront
```bash
# Build the app
npm run build

# Upload dist/ to S3
aws s3 sync dist/ s3://your-bucket-name

# Invalidate CloudFront cache
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/*"
```

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

Build and run:
```bash
docker build -t asset-tracker-frontend .
docker run -p 3000:3000 asset-tracker-frontend
```

---

## Troubleshooting

### Issue: "ENOENT: no such file or directory"
**Solution**: Make sure you're in the correct directory (`frontend/`)

```bash
cd /Users/parthan/Desktop/JobAssetTracker/asset-tracker/frontend
```

### Issue: "Vite requires Node.js version 20.19+"
**Solution**: Upgrade Node.js
```bash
brew install node@20
brew link node@20 --overwrite
```

### Issue: Module not found errors
**Solution**: Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Issue: Port 5173 already in use
**Solution**: Use a different port
```bash
npm run dev -- --port 3000
```

### Issue: API connection errors
**Solution**: 
1. Check backend is running: `http://localhost:8000`
2. Verify CORS settings in backend
3. Check network tab in browser DevTools

### Issue: Tailwind styles not showing
**Solution**:
1. Clear browser cache (Ctrl+Shift+Delete)
2. Rebuild: `npm run dev`
3. Check `tailwind.config.js` paths are correct

---

## Performance Optimization

### Build Optimization
```bash
npm run build

# Analyze bundle size
npm install -D webpack-bundle-analyzer
```

### Code Splitting
Lazy load routes:
```jsx
import { lazy, Suspense } from "react";

const Add = lazy(() => import("./pages/Add"));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Route path="/add" element={<Add />} />
    </Suspense>
  );
}
```

### Image Optimization
Use modern formats:
```jsx
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.png" alt="Description" />
</picture>
```

---

## Testing

### Unit Tests (Optional Setup)
```bash
npm install -D vitest @testing-library/react

# Create test file
# src/components/__tests__/Button.test.jsx

import { render, screen } from "@testing-library/react";
import { Button } from "../index";

describe("Button", () => {
  it("renders button with text", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });
});
```

Run tests:
```bash
npm run test
```

---

## Version Updates

### Update Dependencies
```bash
# Check for outdated packages
npm outdated

# Update all packages
npm update

# Update specific package
npm install react@latest

# Major version update (careful!)
npm install react@19
```

---

## Helpful Commands

```bash
# Start dev server with debug
npm run dev -- --debug

# Build and check output
npm run build && du -sh dist/

# Lint code
npm run lint
npm run lint -- --fix

# Clean installation
rm -rf node_modules && npm install

# Check Node/npm versions
node -v && npm -v

# View installed packages
npm list

# Check package vulnerabilities
npm audit
npm audit fix
```

---

## Git Workflow (Optional)

```bash
# Initialize git (if not already done)
git init

# Create .gitignore
cat > .gitignore << EOF
node_modules/
dist/
.env
.env.local
*.log
EOF

# Commit changes
git add .
git commit -m "refactor: redesign UI with Tailwind CSS"

# Create a remote repository on GitHub
# Then push:
git remote add origin https://github.com/username/asset-tracker.git
git branch -M main
git push -u origin main
```

---

## Support & Resources

### Documentation
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [React Docs](https://react.dev)
- [Vite Guide](https://vitejs.dev/guide/)
- [React Router](https://reactrouter.com/)

### Useful Tools
- [Tailwind Color Generator](https://uicolors.app/)
- [Icon Library](https://unicode-table.com/en/)
- [CSS Tricks](https://css-tricks.com/)
- [MDN Web Docs](https://developer.mozilla.org/)

### Community Help
- Stack Overflow: Tag with `react`, `tailwindcss`, `vite`
- GitHub Issues
- React Forum
- Tailwind Discord Community

---

## Contact & Support

For issues or questions about this redesign:

1. Check the `UI_REDESIGN_SUMMARY.md` file
2. Review the `UI_DESIGN_GUIDE.md` for design patterns
3. Check browser console for error messages
4. Ensure backend is running and accessible

---

Happy coding! 🚀
