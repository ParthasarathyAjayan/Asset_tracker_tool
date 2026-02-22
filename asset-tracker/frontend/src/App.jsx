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
    { label: "QUICK CHECK", path: "/quick-check", icon: "🔍", color: "from-cyan-500 to-blue-600" },
    { label: "ADD ASSET", path: "/add", icon: "➕", color: "from-blue-500 to-blue-600" },
    { label: "ASSIGN", path: "/assign", icon: "👤", color: "from-purple-500 to-purple-600" },
    { label: "MANAGE ASSET", path: "/out", icon: "📤", color: "from-orange-500 to-orange-600" },
    { label: "EMPLOYEES", path: "/employees", icon: "👥", color: "from-green-500 to-green-600" },
    { label: "ASSETS", path: "/assets", icon: "📦", color: "from-indigo-500 to-indigo-600" },
    { label: "REPAIR LIST", path: "/repair", icon: "🔧", color: "from-red-500 to-red-600" },
    { label: "EXIT CLEARANCE", path: "/clearance", icon: "✅", color: "from-teal-500 to-teal-600" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 py-12 px-4">
      {/* Header Section */}
      <div className="text-center mb-12">
        <div className="inline-block mb-6 p-0 bg-white rounded-full shadow-lg overflow-hidden">
          <img src="/company_icon.png" alt="Company Logo" className="w-24 h-24 object-cover rounded-full scale-105" />
        </div>
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-2">
          IT Asset Tracker
        </h1>
        <p className="text-xl text-blue-200">Manage your company's assets efficiently</p>
      </div>

      {/* Menu Grid */}
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {menuItems.map((item) => (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`group relative overflow-hidden rounded-2xl p-8 bg-gradient-to-br ${item.color} text-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 active:scale-95`}
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
              
              {/* Content */}
              <div className="relative z-10 text-center">
                <div className="text-5xl mb-4 transform group-hover:scale-110 group-hover:-rotate-12 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-lg font-bold tracking-wide">{item.label}</h3>
                <div className="mt-3 h-1 w-0 group-hover:w-12 mx-auto bg-white transition-all duration-300 rounded-full"></div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-16 text-blue-300 text-sm">
        <p>Version 1.0 • Asset Management System</p>
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
