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

function Menu() {
  const navigate = useNavigate();

  const menuItems = [
    { label: "QUICK CHECK", path: "/quick-check", icon: "🔍", color: "from-red-600 via-orange-500 to-amber-500" },
    { label: "ADD ASSET", path: "/add", icon: "➕", color: "from-orange-600 via-red-500 to-red-600" },
    { label: "ASSIGN", path: "/assign", icon: "👤", color: "from-amber-600 via-orange-500 to-red-500" },
    { label: "MANAGE ASSET", path: "/out", icon: "📤", color: "from-red-700 via-orange-600 to-amber-600" },
    { label: "EMPLOYEES", path: "/employees", icon: "👥", color: "from-orange-700 via-red-600 to-orange-600" },
    { label: "ASSETS", path: "/assets", icon: "📦", color: "from-red-600 via-orange-600 to-yellow-600" },
    { label: "REPAIR LIST", path: "/repair", icon: "🔧", color: "from-amber-600 via-orange-600 to-red-600" },
    { label: "EXIT CLEARANCE", path: "/clearance", icon: "✅", color: "from-orange-600 via-red-600 to-amber-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 py-12 px-4">
      {/* Animated background elements */}
      <div className="fixed inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-orange-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-amber-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center mb-16">
        <div className="inline-block mb-8 p-2 bg-gradient-to-br from-red-500 to-orange-600 rounded-full shadow-2xl overflow-hidden hover:shadow-red-500/50 transition-all duration-300">
          <div className="bg-slate-950 rounded-full p-1">
            <img src="/company_icon.png" alt="Company Logo" className="w-28 h-28 object-cover rounded-full" />
          </div>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent mb-4">
          IT Asset Tracker
        </h1>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-red-500 via-orange-500 to-amber-500 rounded-full mb-6"></div>
        <p className="text-xl text-orange-300 font-light tracking-wide">Manage your company's assets efficiently</p>
      </div>

      {/* Menu Grid */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${item.color} text-white shadow-xl hover:shadow-2xl transform hover:scale-110 transition-all duration-300 active:scale-95 border border-white/10`}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" style={{animation: 'shimmer 0.6s ease-in-out'}}></div>
              
              {/* Animated border */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.1), transparent)',
                animation: 'borderFlow 2s infinite'
              }}></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-3 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-sm font-bold tracking-widest uppercase leading-tight">{item.label}</h3>
                <div className="mt-3 h-0.5 w-0 group-hover:w-8 mx-auto bg-white transition-all duration-300 rounded-full"></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 text-center mt-20 text-orange-400/60 text-sm font-light">
        <p>Version 1.0 • Premium Asset Management System</p>
      </div>
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
