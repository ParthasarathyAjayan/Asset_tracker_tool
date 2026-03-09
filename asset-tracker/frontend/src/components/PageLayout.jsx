import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./index";
import JobWorld3DLogo from "./JobWorld3DLogo";

export default function PageLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen relative flex flex-col overflow-hidden">
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
              <p className="text-orange-400 text-xs mt-2 sm:mt-3 font-bold uppercase tracking-widest hidden sm:block">Premium Asset & Inventory Management Platform</p>
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
        <div className="flex justify-between items-center pb-4 mb-6 border-b border-gray-700 px-4">
          <h1 className="text-3xl font-bold text-white"></h1>
          <Button 
            variant="primary"
            onClick={() => navigate("/")}
            size="sm"
            icon="←"
            className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50 px-6"
          >
            Back to Menu
          </Button>
        </div>

        {/* Page Content */}
        <div className="relative z-10">
          {children}
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
            <p className="text-orange-400 text-xs font-bold uppercase tracking-widest">JobWorld Inventory Pro</p>
            <div className="h-0.5 w-6 sm:w-8 bg-gradient-to-l from-orange-500 to-transparent"></div>
          </div>
          <p className="text-white text-xs font-medium">Premium Asset Management System • Version 1.0</p>
        </div>
      </footer>
    </div>
  );
}
