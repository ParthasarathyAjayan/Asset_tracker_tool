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
    { label: "Quick Check", path: "/quick-check", icon: "💻", desc: "Fast asset lookup", size: "lg", color: "bg-gradient-to-br from-orange-600 to-red-600" },
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
      {/* Neobrutalist Background - Bold geometric design */}
      <div className="fixed inset-0 -z-20" style={{
        background: `
          linear-gradient(135deg, #1a1a1a 0%, #0f0f0f 50%, #1a1a1a 100%),
          repeating-linear-gradient(
            45deg,
            transparent,
            transparent 35px,
            rgba(255, 255, 255, 0.02) 35px,
            rgba(255, 255, 255, 0.02) 70px
          ),
          repeating-linear-gradient(
            -45deg,
            transparent,
            transparent 35px,
            rgba(255, 255, 255, 0.01) 35px,
            rgba(255, 255, 255, 0.01) 70px
          )
        `,
        backgroundSize: '100% 100%, 100% 100%, 100% 100%'
      }}></div>

      {/* Neobrutalist geometric overlay with bold shapes */}
      <div className="fixed inset-0 pointer-events-none -z-10" style={{
        backgroundImage: `
          /* Large geometric blocks */
          linear-gradient(90deg, rgba(255,107,53,0.08) 0%, transparent 5%, transparent 95%, rgba(211,47,47,0.08) 100%),
          linear-gradient(180deg, rgba(255,107,53,0.05) 0%, transparent 20%, transparent 80%, rgba(211,47,47,0.05) 100%),
          /* Accent lines */
          repeating-linear-gradient(0deg, transparent, transparent 199px, rgba(255,107,53,0.15) 199px, rgba(255,107,53,0.15) 200px),
          repeating-linear-gradient(90deg, transparent, transparent 199px, rgba(255,107,53,0.1) 199px, rgba(255,107,53,0.1) 200px)
        `,
        zIndex: 0
      }}></div>

      {/* Header - Neobrutalist Dark with Bold Border */}
      <header className="backdrop-blur-md bg-black/60 shadow-2xl relative overflow-hidden border-b-4 border-orange-500" style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 1px rgba(0,0,0,0.5),
          0 10px 30px rgba(0,0,0,0.5),
          0 0 0 1px rgba(255,107,53,0.3)
        `
      }}>
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `linear-gradient(45deg, rgba(255,107,53,0.1) 25%, transparent 25%, transparent 50%, rgba(255,107,53,0.1) 50%, rgba(255,107,53,0.1) 75%, transparent 75%, transparent)`,
          backgroundSize: '20px 20px'
        }}></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-12 relative z-10">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <div className="flex-1">
              <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                <div className="h-1 w-8 sm:w-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                <h1 className="text-2xl sm:text-4xl font-bold text-white tracking-tight">JobWorld</h1>
              </div>
              <h2 className="text-xl sm:text-3xl font-black text-orange-400" style={{
                fontFamily: '"Arial Black", sans-serif',
                letterSpacing: '0.08em'
              }}>
                INVENTORY PRO
              </h2>
              <p className="text-gray-400 text-xs mt-2 sm:mt-3 font-semibold uppercase tracking-widest hidden sm:block">Premium Asset & Inventory Management Platform</p>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 sm:gap-8 auto-rows-max" style={{
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
                  e.currentTarget.style.transform = `rotateX(${y * 26}deg) rotateY(${x * 26}deg) translateZ(50px)`;
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
                  {/* Outer shadow layer - Strong depth */}
                  <div className="absolute inset-0 -m-1" style={{
                    background: `
                      radial-gradient(ellipse 80% 50% at 50% 120%, rgba(0,0,0,0.5), transparent 70%),
                      linear-gradient(to bottom, rgba(0,0,0,0.1), rgba(0,0,0,0.05))
                    `,
                    transform: 'translateZ(-50px)',
                    zIndex: -2,
                    filter: 'blur(25px)',
                    borderRadius: '32px'
                  }}></div>

                  {/* Inner depth shadow */}
                  <div className="absolute inset-0" style={{
                    boxShadow: `
                      0 20px 40px rgba(0,0,0,0.25),
                      0 10px 20px rgba(0,0,0,0.15)
                    `,
                    transform: 'translateZ(-15px)',
                    zIndex: -1,
                    borderRadius: '32px'
                  }}></div>
                  
                  {/* Main card with pronounced skeuomorphic effects */}
                  <div className={`${item.color} h-full p-4 sm:p-6 lg:p-8 text-white relative overflow-hidden flex flex-col justify-between min-h-[120px] sm:min-h-[140px] transition-all duration-300`}
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(0px)',
                      borderRadius: '32px',
                      boxShadow: `
                        /* Top edge highlight */
                        inset 0 2px 4px rgba(255,255,255,0.4),
                        /* Bottom edge shadow */
                        inset 0 -3px 8px rgba(0,0,0,0.3),
                        /* Outer glow */
                        0 0 0 1px rgba(255,255,255,0.2),
                        0 8px 20px rgba(0,0,0,0.2)
                      `
                    }}
                  >
                    {/* Top glossy bevel - Prominent light reflection */}
                    <div className="absolute inset-x-0 top-0 h-2 opacity-60" style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,0.4), rgba(255,255,255,0.1), transparent)',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(2px)',
                      borderRadius: '32px 32px 0 0'
                    }}></div>

                    {/* Bottom shadow edge */}
                    <div className="absolute inset-x-0 bottom-0 h-1 opacity-40" style={{
                      background: 'linear-gradient(to right, rgba(0,0,0,0.3), rgba(0,0,0,0.1))',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(2px)',
                      borderRadius: '0 0 32px 32px'
                    }}></div>

                    {/* Shimmer effect - Enhanced skeuomorphic */}
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
                      animation: 'shimmer 1s ease-in-out',
                      transformStyle: 'preserve-3d',
                      transform: 'translateZ(10px)',
                      borderRadius: '32px'
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

      {/* Footer - Neobrutalist Dark with Bold Border */}
      <footer className="backdrop-blur-md bg-black/60 border-t-4 border-orange-500" style={{
        boxShadow: `
          inset 0 1px 0 rgba(255,255,255,0.1),
          inset 0 -1px 1px rgba(0,0,0,0.5),
          0 -10px 30px rgba(0,0,0,0.5)
        `
      }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-1 sm:mb-2">
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-r from-orange-500 to-transparent"></div>
            <p className="text-gray-400 text-xs font-bold uppercase tracking-widest">JobWorld Inventory Pro</p>
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-l from-orange-500 to-transparent"></div>
          </div>
          <p className="text-gray-500 text-xs">Premium Asset Management System • Version 1.0</p>
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
    <div className="flex justify-between items-center pb-4 border-b border-gray-700">
      <h1 className="text-3xl font-bold text-white"></h1>
      <Button 
        variant="primary"
        onClick={() => navigate("/")}
        size="sm"
        icon="←"
        className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50"
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
