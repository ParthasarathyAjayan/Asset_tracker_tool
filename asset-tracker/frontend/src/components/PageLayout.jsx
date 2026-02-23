import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "./index";
import JobWorld3DLogo from "./JobWorld3DLogo";

export default function PageLayout({ children }) {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white relative flex flex-col">
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
        <div className="max-w-7xl mx-auto px-6 py-12 relative z-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-1 w-12 bg-gradient-to-r from-orange-400 to-yellow-400 rounded-full"></div>
                <h1 className="text-4xl font-bold text-white tracking-tight">JobWorld</h1>
              </div>
              <h2 className="text-3xl font-black text-orange-300" style={{
                fontFamily: '"Arial Black", sans-serif',
                letterSpacing: '0.08em'
              }}>
                INVENTORY PRO
              </h2>
              <p className="text-orange-100 text-xs mt-3 font-semibold uppercase tracking-widest">Premium Asset & Inventory Management Platform</p>
            </div>
          </div>
          <div className="h-1 w-32 bg-gradient-to-r from-orange-400 via-yellow-400 to-orange-400 rounded-full shadow-lg"></div>
        </div>
        <JobWorld3DLogo />
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8 relative z-10 w-full flex-1">
        {/* Back Button */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
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

        {/* Page Content */}
        <div className="relative z-10">
          {children}
        </div>
      </main>

      {/* Footer - Option 2 */}
      <footer className="bg-gradient-to-r from-slate-900 via-red-900 to-amber-900 mt-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 text-center border-t border-orange-700">
          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="h-0.5 w-8 bg-gradient-to-r from-orange-400 to-transparent"></div>
            <p className="text-orange-200 text-xs font-bold uppercase tracking-widest">JobWorld Inventory Pro</p>
            <div className="h-0.5 w-8 bg-gradient-to-l from-orange-400 to-transparent"></div>
          </div>
          <p className="text-orange-100 text-xs">Premium Asset Management System • Version 1.0</p>
        </div>
      </footer>
    </div>
  );
}
