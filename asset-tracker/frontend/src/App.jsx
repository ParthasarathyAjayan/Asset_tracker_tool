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
    { label: "Quick Check", path: "/quick-check", icon: "🔍", desc: "Fast asset lookup", size: "lg", color: "bg-gradient-to-br from-orange-600 to-red-600" },
    { label: "Add Asset", path: "/add", icon: "➕", desc: "Register new asset", size: "sm", color: "bg-gradient-to-br from-orange-500 to-amber-600" },
    { label: "Assets", path: "/assets", icon: "📦", desc: "View all assets", size: "sm", color: "bg-gradient-to-br from-red-500 to-orange-600" },
    { label: "Assign Asset", path: "/assign", icon: "👤", desc: "Assign to employee", size: "sm", color: "bg-gradient-to-br from-amber-600 to-yellow-700" },
    { label: "Manage Asset", path: "/out", icon: "📤", desc: "Return/Repair/Retire", size: "sm", color: "bg-gradient-to-br from-orange-600 to-red-700" },
    { label: "Employees", path: "/employees", icon: "👥", desc: "Employee management", size: "sm", color: "bg-gradient-to-br from-amber-600 to-orange-700" },
    { label: "Repair List", path: "/repair", icon: "🔧", desc: "Track repairs", size: "lg", color: "bg-gradient-to-br from-red-600 to-orange-600" },
    { label: "Exit Clearance", path: "/clearance", icon: "🔐", desc: "Employee exit", size: "sm", color: "bg-gradient-to-br from-amber-700 to-yellow-800" },
  ];

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Frosted Glass White Background */}
      <div className="fixed inset-0 -z-20" style={{
        background: `linear-gradient(135deg, #ffffff 0%, #f5f5f5 50%, #ebebeb 100%)`,
        backgroundSize: '100% 100%'
      }}></div>

      {/* Subtle white glass overlay with frosted effect */}
      <div className="fixed inset-0 pointer-events-none -z-10" style={{
        backgroundImage: `
          radial-gradient(circle at 20% 50%, rgba(255, 255, 255, 0.8) 0%, transparent 50%),
          radial-gradient(circle at 80% 80%, rgba(200, 200, 200, 0.1) 0%, transparent 50%),
          linear-gradient(135deg, rgba(255, 255, 255, 0.5) 0%, rgba(255, 255, 255, 0.3) 100%)
        `,
        backdropFilter: 'blur(10px)',
        zIndex: 0
      }}></div>

      {/* Header - Frosted Glass White with Skeuomorphic Depth */}
      <header className="backdrop-blur-2xl bg-white/40 shadow-lg relative overflow-hidden border border-white/60" style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.8),
          inset 0 -1px 1px rgba(0,0,0,0.05),
          0 10px 30px rgba(0,0,0,0.08),
          0 1px 3px rgba(0,0,0,0.1)
        `
      }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(45deg, rgba(0,0,0,0.03) 25%, transparent 25%, transparent 50%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.03) 75%, transparent 75%, transparent)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <h1 className="text-2xl sm:text-4xl font-bold text-gray-800 tracking-tight">JobWorld</h1>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-orange-600" style={{
                fontFamily: '"Arial Black", sans-serif',
                letterSpacing: '0.08em'
              }}>
                INVENTORY PRO
              </h2>
              <p className="text-gray-600 text-xs mt-2 sm:mt-3 font-semibold uppercase tracking-widest hidden sm:block">Premium Asset & Inventory Management Platform</p>
            </div>
          </div>
          <div className="h-1 w-24 sm:w-32 bg-gradient-to-r from-orange-500 via-red-500 to-orange-500 rounded-full" style={{
            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
          }}></div>
        </div>
        <JobWorld3DLogo />
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10 flex flex-col">
        {/* Bento Grid - 3D Effect */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-max" style={{
          perspective: '1200px'
        }}>
          {menuItems.map((item) => {
            const sizeClass = item.size === 'lg' 
              ? 'col-span-2 sm:col-span-2 lg:col-span-2 row-span-2' 
              : 'col-span-1 row-span-1';
            
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`${sizeClass} group relative overflow-visible transition-all duration-500`}
                style={{
                  transformStyle: 'preserve-3d',
                  transform: 'translateZ(0)'
                }}
                onMouseMove={(e) => {
                  const rect = e.currentTarget.getBoundingClientRect();
                  const x = (e.clientX - rect.left) / rect.width - 0.5;
                  const y = (e.clientY - rect.top) / rect.height - 0.5;
                  e.currentTarget.style.transform = `rotateX(${y * 20}deg) rotateY(${x * 20}deg) translateZ(20px)`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'rotateX(0) rotateY(0) translateZ(0)';
                }}
              >
                {/* Card Container with 3D depth */}
                <div className="h-full relative" style={{
                  transformStyle: 'preserve-3d',
                }}
                >
                  {/* Back shadow layer - Skeuomorphic depth */}
                  <div className="absolute inset-0 rounded-3xl" style={{
                    background: `radial-gradient(ellipse at center, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.1) 70%, transparent 100%)`,
                    transform: 'translateZ(-40px)',
                    zIndex: -1,
                    filter: 'blur(20px)'
                  }}></div>
                  
                  {/* Main card with skeuomorphic bevel and inset */}
                  <div className={`${item.color} h-full p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[120px] sm:min-h-[140px] rounded-3xl transition-all duration-300`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(0px)',
                      boxShadow: `
                        inset 0 1px 0 rgba(255,255,255,0.3),
                        inset 0 -1px 0 rgba(0,0,0,0.2),
                        0 15px 35px rgba(0,0,0,0.15),
                        0 5px 15px rgba(0,0,0,0.2)
                      `
                    }}
                  >
                    {/* Top highlight bevel */}
                    <div className="absolute inset-x-0 top-0 h-0.5 rounded-t-3xl opacity-50" style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.2), rgba(255,255,255,0.05))',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(1px)'
                    }}></div>

                    {/* Shine effect - Enhanced skeuomorphic */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl pointer-events-none" style={{
                      animation: 'shimmer 0.8s ease-in-out',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(5px)'
                    }}></div>
                    
                    {/* Content */}
                    <div className="relative z-10 flex flex-col h-full" style={{
                      transformStyle: 'preserve-3d',
                    }}>
                      <div className={item.size === 'lg' ? 'text-5xl sm:text-7xl mb-4' : 'text-3xl sm:text-4xl mb-2'}>
                        {item.icon}
                      </div>
                      <div className="flex-1 flex flex-col justify-end">
                        <h3 className={item.size === 'lg' ? 'text-lg sm:text-2xl font-bold leading-tight' : 'text-base sm:text-lg font-bold leading-tight'}>
                          {item.label}
                        </h3>
                        {item.size === 'lg' && (
                          <p className="text-sm sm:text-base text-white/80 mt-2">{item.desc}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </main>

      {/* Footer - Frosted Glass White with Skeuomorphic Depth */}
      <footer className="backdrop-blur-2xl bg-white/40 border-t border-white/60" style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.8),
          inset 0 -1px 1px rgba(0,0,0,0.05),
          0 -10px 30px rgba(0,0,0,0.08)
        `
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-r from-orange-500 to-transparent"></div>
            <p className="text-gray-700 text-xs font-bold uppercase tracking-widest">JobWorld Inventory Pro</p>
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-l from-orange-500 to-transparent"></div>
          </div>
          <p className="text-gray-600 text-xs">Premium Asset Management System • Version 1.0</p>
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
