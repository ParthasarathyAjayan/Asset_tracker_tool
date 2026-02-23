import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Add from "./pages/Add";
import Assign from "./pages/Assign";
import Out from "./pages/Out";
import Assets from "./pages/Assets";
import Employees from "./pages/Employees";
import Repair from "./pages/Repair";
import Clearance from "./pages/Clearance";
import QuickCheck from "./pages/QuickCheck";
import { Button, PageLayout } from "./components";
import JobWorld3DLogo from "./components/JobWorld3DLogo";

function Menu() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "Quick Check", path: "/quick-check", icon: "🔍", desc: "Fast asset lookup", color: "bg-gradient-to-br from-amber-600 to-orange-700" },
    { label: "Add Asset", path: "/add", icon: "➕", desc: "Register new asset", color: "bg-gradient-to-br from-orange-600 to-red-700" },
    { label: "Assign Asset", path: "/assign", icon: "👤", desc: "Assign to employee", color: "bg-gradient-to-br from-amber-700 to-orange-800" },
    { label: "Manage Asset", path: "/out", icon: "📤", desc: "Return/Repair/Retire", color: "bg-gradient-to-br from-orange-700 to-red-800" },
    { label: "Employees", path: "/employees", icon: "👥", desc: "Employee management", color: "bg-gradient-to-br from-amber-600 to-orange-700" },
    { label: "Assets", path: "/assets", icon: "📦", desc: "View all assets", color: "bg-gradient-to-br from-orange-600 to-red-700" },
    { label: "Repair List", path: "/repair", icon: "🔧", desc: "Track repairs", color: "bg-gradient-to-br from-amber-700 to-orange-800" },
    { label: "Exit Clearance", path: "/clearance", icon: "🔐", desc: "Employee exit", color: "bg-gradient-to-br from-orange-700 to-red-800" },
  ];

  return (
    <div className="min-h-screen bg-white relative">
      {/* Subtle background pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(249, 115, 22, 0.05) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(217, 119, 6, 0.05) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0) 0%, rgba(249, 115, 22, 0.02) 100%)
        `,
        zIndex: 0
      }}></div>
      
      {/* Dot pattern */}
      <div className="fixed inset-0 pointer-events-none" style={{
        backgroundImage: `radial-gradient(circle, rgba(249, 115, 22, 0.08) 1px, transparent 1px)`,
        backgroundSize: '50px 50px',
        zIndex: 0
      }}></div>
      {/* Header */}
      <header className="bg-gradient-to-r from-slate-900 via-red-900 to-amber-900 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `linear-gradient(45deg, rgba(255,255,255,0.1) 25%, transparent 25%, transparent 50%, rgba(255,255,255,0.1) 50%, rgba(255,255,255,0.1) 75%, transparent 75%, transparent)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">JobWorld</h1>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-orange-300" style={{
                fontFamily: '"Arial Black", sans-serif',
                letterSpacing: '0.08em'
              }}>
                INVENTORY PRO
              </h2>
              <p className="text-orange-100 text-xs mt-2 sm:mt-3 font-semibold uppercase tracking-widest hidden sm:block">Premium Asset & Inventory Management Platform</p>
            </div>
          </div>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-full shadow-lg"></div>
        </div>
        <JobWorld3DLogo />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10 flex flex-col">
        {/* Menu Grid */}
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group relative overflow-hidden rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0"
              >
                {/* Card Background */}
                <div className={`${item.color} h-full p-6 sm:p-12 text-white relative overflow-hidden`}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" style={{animation: 'shimmer 0.6s ease-in-out'}}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center h-full flex flex-col items-center justify-center">
                    <div className="text-4xl sm:text-6xl mb-2 sm:mb-4 transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-base sm:text-lg font-bold mb-1 sm:mb-2 leading-tight">{item.label}</h3>
                    <p className="text-xs sm:text-sm text-white/80 hidden sm:block">{item.desc}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer - Option 2 */}
      <footer className="bg-gradient-to-r from-slate-900 via-red-900 to-amber-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center border-t border-orange-700">
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-r from-orange-400 to-transparent"></div>
            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">JobWorld Inventory Pro</p>
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-l from-orange-400 to-transparent"></div>
          </div>
          <p className="text-orange-100 text-xs">Premium Asset Management System • Version 1.0</p>
        </div>
      </footer>
    </div>
  );
}
function BackButton() {
  const navigate = useNavigate();
  const location = useLocation();

  if (location.pathname === "/") return null;

  return (
    <div className="flex justify-between items-center pb-4 border-b border-gray-200">
      <h1 className="text-3xl font-bold text-gray-800"></h1>
      <Button 
        variant="secondary"
        onClick={() => navigate("/")}
        size="sm"
        icon="←"
      >
        Back to Menu
      </Button>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />} />
        <Route path="/quick-check" element={<PageLayout><QuickCheck /></PageLayout>} />
        <Route path="/add" element={<PageLayout><Add /></PageLayout>} />
        <Route path="/assign" element={<PageLayout><Assign /></PageLayout>} />
        <Route path="/out" element={<PageLayout><Out /></PageLayout>} />
        <Route path="/assets" element={<PageLayout><Assets /></PageLayout>} />
        <Route path="/employees" element={<PageLayout><Employees /></PageLayout>} />
        <Route path="/repair" element={<PageLayout><Repair /></PageLayout>} />
        <Route path="/clearance" element={<PageLayout><Clearance /></PageLayout>} />
      </Routes>
    </BrowserRouter>
  );
}
