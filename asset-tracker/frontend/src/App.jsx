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
    { label: "QUICK CHECK", path: "/quick-check", icon: "🔍", color: "from-amber-700 via-orange-600 to-white" },
    { label: "ADD ASSET", path: "/add", icon: "➕", color: "from-orange-700 via-amber-600 to-white" },
    { label: "ASSIGN", path: "/assign", icon: "👤", color: "from-amber-800 via-orange-700 to-white" },
    { label: "MANAGE ASSET", path: "/out", icon: "📤", color: "from-orange-800 via-amber-700 to-white" },
    { label: "EMPLOYEES", path: "/employees", icon: "👥", color: "from-amber-700 via-orange-600 to-white" },
    { label: "ASSETS", path: "/assets", icon: "📦", color: "from-orange-700 via-amber-600 to-white" },
    { label: "REPAIR LIST", path: "/repair", icon: "🔧", color: "from-amber-800 via-orange-700 to-white" },
    { label: "EXIT CLEARANCE", path: "/clearance", icon: "✅", color: "from-orange-700 via-amber-600 to-white" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-amber-950 to-orange-950 py-12 px-4 overflow-hidden relative">
      {/* Animated glowing bubbles background */}
      <div className="fixed inset-0">
        <div className="absolute top-20 left-20 w-96 h-96 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob opacity-100" style={{filter: 'blur(80px)', opacity: 0.95}}></div>
        <div className="absolute top-32 left-32 w-80 h-80 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000" style={{filter: 'blur(80px)', opacity: 0.85, animationDelay: '1s'}}></div>
        <div className="absolute top-40 -right-40 w-96 h-96 bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" style={{filter: 'blur(80px)', opacity: 0.85, animationDelay: '2s'}}></div>
        <div className="absolute top-48 -right-32 w-72 h-72 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2500" style={{filter: 'blur(80px)', opacity: 0.8, animationDelay: '2.5s'}}></div>
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-amber-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" style={{filter: 'blur(80px)', opacity: 0.8, animationDelay: '4s'}}></div>
        <div className="absolute -bottom-24 left-2/5 w-80 h-80 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3500" style={{filter: 'blur(80px)', opacity: 0.75, animationDelay: '3.5s'}}></div>
        <div className="absolute top-1/2 right-20 w-80 h-80 bg-orange-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1000" style={{filter: 'blur(80px)', opacity: 0.9, animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 right-32 w-64 h-64 bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1500" style={{filter: 'blur(80px)', opacity: 0.8, animationDelay: '1.5s'}}></div>
        <div className="absolute bottom-40 -left-40 w-80 h-80 bg-amber-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000" style={{filter: 'blur(80px)', opacity: 0.85, animationDelay: '3s'}}></div>
        <div className="absolute bottom-32 -left-32 w-72 h-72 bg-amber-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3500" style={{filter: 'blur(80px)', opacity: 0.8, animationDelay: '3.5s'}}></div>
        <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2500" style={{filter: 'blur(80px)', opacity: 0.8, animationDelay: '2.5s'}}></div>
        <div className="absolute top-1/3 right-1/3 w-60 h-60 bg-orange-600 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" style={{filter: 'blur(80px)', opacity: 0.75, animationDelay: '2s'}}></div>
        <div className="absolute top-2/3 left-1/4 w-68 h-68 bg-amber-800 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-3000" style={{filter: 'blur(80px)', opacity: 0.8, animationDelay: '3s'}}></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-orange-700 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-1500" style={{filter: 'blur(80px)', opacity: 0.75, animationDelay: '1.5s'}}></div>
        
        {/* White gradient overlay 30% */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-transparent to-white mix-blend-overlay" style={{opacity: 0.3}}></div>
      </div>

      {/* Header Section */}
      <div className="relative z-10 text-center mb-16">
        <div className="inline-block mb-8 p-2 bg-gradient-to-br from-orange-700 via-amber-700 to-amber-800 rounded-full shadow-2xl overflow-hidden hover:shadow-amber-700/50 transition-all duration-300">
          <div className="bg-slate-950 rounded-full p-1">
            <img src="/company_icon.png" alt="Company Logo" className="w-28 h-28 object-cover rounded-full" />
          </div>
        </div>
        <h1 className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-white via-orange-100 to-white bg-clip-text text-transparent mb-4 drop-shadow-lg" style={{textShadow: '0 4px 20px rgba(255, 255, 255, 0.5), 0 8px 32px rgba(239, 68, 68, 0.3)'}}>
          IT Asset Tracker
        </h1>
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-orange-400 via-red-400 to-amber-400 rounded-full mb-6"></div>
        <p className="text-xl text-orange-200 font-light tracking-wide">Manage your company's assets efficiently</p>
      </div>

      {/* Menu Grid */}
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative overflow-hidden rounded-xl p-6 bg-gradient-to-br ${item.color} text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95 border border-white/20`}
            >
              {/* Shimmer effect with white gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 transform -translate-x-full group-hover:translate-x-full" style={{animation: 'shimmer 0.6s ease-in-out'}}></div>
              
              {/* Animated border with white */}
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.25), transparent)',
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
      <div className="relative z-10 text-center mt-20 text-orange-300/60 text-sm font-light">
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
