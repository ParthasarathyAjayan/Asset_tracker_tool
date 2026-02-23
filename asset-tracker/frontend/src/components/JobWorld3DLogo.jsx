export default function JobWorld3DLogo() {
  return (
    <div style={{
      position: "fixed",
      top: "10px",
      right: "20px",
      zIndex: 30,
      width: "150px",
      height: "150px",
      perspective: "1200px"
    }}>
      <style>{`
        @keyframes coin-spin {
          0% {
            transform: rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: rotateY(90deg) rotateX(5deg);
          }
          50% {
            transform: rotateY(180deg) rotateX(0deg);
          }
          75% {
            transform: rotateY(270deg) rotateX(-5deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(0deg);
          }
        }
        
        @keyframes bounce-spin {
          0%, 100% {
            transform: translateY(0px) rotateY(0deg) rotateX(0deg);
          }
          25% {
            transform: translateY(-8px) rotateY(90deg) rotateX(8deg);
          }
          50% {
            transform: translateY(0px) rotateY(180deg) rotateX(0deg);
          }
          75% {
            transform: translateY(-8px) rotateY(270deg) rotateX(-8deg);
          }
        }
        
        @keyframes shadow-pulse {
          0%, 100% {
            opacity: 0.3;
            transform: scaleX(1);
          }
          50% {
            opacity: 0.6;
            transform: scaleX(1.1);
          }
        }
        
        @keyframes glow-spin {
          0%, 100% {
            opacity: 0.4;
            filter: blur(8px);
          }
          50% {
            opacity: 0.8;
            filter: blur(4px);
          }
        }
        
        .coin-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          perspective: 1200px;
          position: relative;
        }
        
        /* Shadow under coin */
        .coin-shadow {
          position: absolute;
          bottom: 8px;
          width: 120px;
          height: 18px;
          background: radial-gradient(ellipse at center, rgba(0, 0, 0, 0.4), transparent);
          border-radius: 50%;
          animation: shadow-pulse 3.3275s ease-in-out infinite;
          filter: blur(2px);
        }
        
        /* Glow effect */
        .coin-glow {
          position: absolute;
          width: 140px;
          height: 140px;
          background: radial-gradient(circle, rgba(255, 106, 0, 0.3), transparent 70%);
          border-radius: 50%;
          animation: glow-spin 3.3275s ease-in-out infinite;
          box-shadow: inset 0 0 40px rgba(255, 106, 0, 0.2);
        }
        
        /* Main coin wrapper */
        .coin-wrapper {
          position: relative;
          width: 120px;
          height: 120px;
          transform-style: preserve-3d;
          animation: bounce-spin 3.3275s ease-in-out infinite;
        }
        
        /* Coin face */
        .coin-face {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          backface-visibility: hidden;
          display: flex;
          align-items: center;
          justify-content: center;
          transform-style: preserve-3d;
          box-shadow: 
            0 20px 50px rgba(0, 0, 0, 0.3),
            inset -2px -2px 8px rgba(0, 0, 0, 0.2),
            inset 2px 2px 8px rgba(255, 255, 255, 0.3);
        }
        
        /* Front face */
        .coin-front {
          background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 50%, #e0e0e0 100%);
          z-index: 2;
          border: 2px solid rgba(255, 106, 0, 0.4);
        }
        
        /* Back face */
        .coin-back {
          background: linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 50%, #d8d8d8 100%);
          transform: rotateY(180deg);
          z-index: 1;
          border: 2px solid rgba(179, 0, 0, 0.3);
        }
        
        /* Coin edge (rim) */
        .coin-edge {
          position: absolute;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: linear-gradient(90deg, 
            #d4a574 0%, 
            #f4c570 25%, 
            #d4a574 50%, 
            #c9924d 75%, 
            #d4a574 100%);
          box-shadow: 
            inset 0 1px 3px rgba(255, 255, 255, 0.4),
            inset 0 -1px 3px rgba(0, 0, 0, 0.3);
        }
        
        /* Logo image container */
        .coin-logo {
          position: relative;
          width: 130px;
          height: 130px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 3;
          overflow: hidden;
          border-radius: 50%;
        }
        
        .coin-logo img {
          width: 93%;
          height: 93%;
          object-fit: cover;
          filter: drop-shadow(0 2px 8px rgba(0, 0, 0, 0.2));
          padding: 0px;
          box-sizing: border-box;
        }
        
        /* Highlight/shine effect */
        .coin-shine {
          position: absolute;
          top: 10%;
          left: 15%;
          width: 50px;
          height: 50px;
          background: radial-gradient(circle, rgba(255, 255, 255, 0.6), transparent);
          border-radius: 50%;
          filter: blur(8px);
          pointer-events: none;
          z-index: 4;
        }
        
        /* Sparkling particles */
        @keyframes sparkle-twinkle {
          0%, 100% { opacity: 0; transform: scale(0); }
          50% { opacity: 1; transform: scale(1); }
        }
        
        @keyframes sparkle-burst-1 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(65px, -35px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-2 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(50px, 55px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-3 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-60px, 45px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-4 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-55px, -50px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-5 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(70px, 20px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-6 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-65px, -25px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-7 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(45px, -60px) scale(0); opacity: 0; }
        }
        
        @keyframes sparkle-burst-8 {
          0% { transform: translate(0, 0) scale(1); opacity: 1; }
          100% { transform: translate(-70px, 30px) scale(0); opacity: 0; }
        }
        
        .sparkle {
          position: absolute;
          top: 50%;
          left: 50%;
          pointer-events: none;
          width: 6px;
          height: 6px;
        }
        
        .sparkle::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(255, 215, 0, 0.9), rgba(255, 106, 0, 0));
          border-radius: 50%;
          box-shadow: 
            0 0 3px rgba(255, 215, 0, 0.8),
            0 0 6px rgba(255, 106, 0, 0.6);
        }
        
        .sparkle:nth-child(3) {
          animation: sparkle-burst-1 1.5s ease-out infinite;
        }
        
        .sparkle:nth-child(4) {
          animation: sparkle-burst-2 1.6s ease-out infinite 0.2s;
        }
        
        .sparkle:nth-child(5) {
          animation: sparkle-burst-3 1.7s ease-out infinite 0.4s;
        }
        
        .sparkle:nth-child(6) {
          animation: sparkle-burst-4 1.5s ease-out infinite 0.6s;
        }
        
        .sparkle:nth-child(7) {
          animation: sparkle-burst-5 1.6s ease-out infinite 0.8s;
        }
        
        .sparkle:nth-child(8) {
          animation: sparkle-burst-6 1.7s ease-out infinite 1s;
        }
      `}</style>
      
      <div className="coin-container">
        {/* Shadow beneath coin */}
        <div className="coin-shadow"></div>
        
        {/* Glow aura */}
        <div className="coin-glow"></div>
        
        {/* Sparkling particles */}
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        <div className="sparkle"></div>
        
        {/* Main coin */}
        <div className="coin-wrapper">
          {/* Coin edge/rim */}
          <div className="coin-edge"></div>
          
          {/* Front face */}
          <div className="coin-face coin-front">
            {/* Shine effect */}
            <div className="coin-shine"></div>
            
            {/* Logo */}
            <div className="coin-logo">
              <img src="/3dlogojobworld.png" alt="JobWorld Coin" />
            </div>
          </div>
          
          {/* Back face */}
          <div className="coin-face coin-back">
            <div className="coin-shine" style={{opacity: 0.3}}></div>
            <div className="coin-logo">
              <img src="/3dlogojobworld.png" alt="JobWorld Coin Back" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
