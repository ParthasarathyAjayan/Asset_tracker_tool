import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./index";
import JobWorld3DLogo from "./JobWorld3DLogo";

export default function PageLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 relative z-10 w-full flex-1">
        {/* Back Button */}
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-200">
          <h1 className="text-3xl font-bold text-gray-800"></h1>
          <Button 
            variant="secondary"
            onClick={() => navigate("/")}
            size="sm"
            icon="←"
            className="backdrop-blur-md bg-white/60 border border-white/80 hover:bg-white/80 hover:border-white text-gray-800"
          >
            Back to Menu
          </Button>
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          {children}
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
