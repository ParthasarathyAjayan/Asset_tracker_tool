import { BrowserRouter, Routes, Route, useNavigate, useLocation } from "react-router-dom";

import Add from "./pages/Add";
import Assign from "./pages/Assign";
import Out from "./pages/Out";
import Assets from "./pages/Assets";
import Employees from "./pages/Employees";
import Repair from "./pages/Repair";
import Clearance from "./pages/Clearance";
import QuickCheck from "./pages/QuickCheck";
import { Button } from "./components";
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
    { label: "Exit Clearance", path: "/clearance", icon: "✅", desc: "Employee exit", color: "bg-gradient-to-br from-orange-700 to-red-800" },
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
      <header className="bg-gradient-to-r from-slate-900 via-red-900 to-amber-900 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-full shadow-lg p-2 flex items-center justify-center overflow-hidden">
                <img src="/company_icon.png" alt="JobWorld" className="w-full h-full object-cover rounded-full" />
              </div>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold">IT Asset Tracker</h1>
                <p className="text-orange-200 text-sm mt-1">Manage company assets efficiently</p>
              </div>
            </div>
          </div>
          <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-amber-500 rounded-full"></div>
        </div>
      </header>

      <JobWorld3DLogo />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-16 relative z-10">
        {/* Menu Grid */}
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {menuItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className="group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 active:translate-y-0"
              >
                {/* Card Background */}
                <div className={`${item.color} h-full p-8 text-white relative overflow-hidden`}>
                  {/* Shine effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" style={{animation: 'shimmer 0.6s ease-in-out'}}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 text-center h-full flex flex-col items-center justify-center">
                    <div className="text-6xl mb-4 transform group-hover:scale-125 group-hover:rotate-6 transition-transform duration-300">
                      {item.icon}
                    </div>
                    <h3 className="text-lg font-bold mb-2 leading-tight">{item.label}</h3>
                    <p className="text-sm text-white/80 mb-4">{item.desc}</p>
                    <div className="mt-auto pt-4 border-t border-white/30 w-full">
                      <span className="text-xs font-semibold uppercase tracking-wider text-white/90">Access →</span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-6 py-8 text-center">
          <p className="text-gray-600 text-sm">
            <span className="font-semibold">IT Asset Tracker</span> • Premium Asset Management System
          </p>
          <p className="text-gray-500 text-xs mt-2">Version 1.0 • All rights reserved</p>
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
        <Route path="/quick-check" element={<><div className="page"><BackButton /></div><QuickCheck /></>} />
        <Route path="/add" element={<><div className="page"><BackButton /></div><Add /></>} />
        <Route path="/assign" element={<><div className="page"><BackButton /></div><Assign /></>} />
        <Route path="/out" element={<><div className="page"><BackButton /></div><Out /></>} />
        <Route path="/assets" element={<><div className="page"><BackButton /></div><Assets /></>} />
        <Route path="/employees" element={<><div className="page"><BackButton /></div><Employees /></>} />
        <Route path="/repair" element={<><div className="page"><BackButton /></div><Repair /></>} />
        <Route path="/clearance" element={<><div className="page"><BackButton /></div><Clearance /></>} />
      </Routes>
    </BrowserRouter>
  );
}
