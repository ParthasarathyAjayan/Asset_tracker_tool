import { useState, useRef, useEffect } from "react";
import { fetchAsset, fetchAssets } from "../api/api";
import { Button, Card, Alert, Badge } from "../components";

export default function QuickCheck() {
  const [search, setSearch] = useState("");
  const [asset, setAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [owner, setOwner] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const [showList, setShowList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    fetchAssets().then(setAssets);
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  async function startBarcodeScanner() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: "environment",
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      streamRef.current = stream;
      setShowBarcodeScanner(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play().catch(err => console.error("Play error:", err));
        }
      }, 100);
    } catch (error) {
      console.error("Camera error:", error);
      if (error.name === 'NotAllowedError') {
        setMessage("Camera permission denied. Please allow camera access in your browser settings.");
      } else if (error.name === 'NotFoundError') {
        setMessage("No camera found on this device.");
      } else {
        setMessage("Camera permission denied or not available: " + error.message);
      }
      setMessageType("danger");
    }
  }

  function stopBarcodeScanner() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowBarcodeScanner(false);
  }

  function handleBarcodeScan(barcode) {
    setSearch(barcode);
    stopBarcodeScanner();
    setTimeout(() => loadAssetDetails(barcode), 100);
  }

  const filteredAssets = assets.filter(a =>
    `${a.asset_code} ${a.model}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  async function loadAssetDetails(code) {
    if (!code.trim()) {
      setMessage("Please enter an asset code");
      setMessageType("warning");
      return;
    }

    setIsLoading(true);
    setMessage(""); // Clear message immediately when searching
    try {
      const data = await fetchAsset(code);
      console.log("Asset data received:", data);
      setAsset(data);
      
      // Check for employee details
      if (data.employee_id && data.employee_id !== null) {
        console.log("Employee found:", data.employee_id, data.employee_name);
        setOwner({
          employee_id: data.employee_id,
          name: data.employee_name || "Unknown",
          email: data.employee_email || "N/A",
          location: data.employee_location || "N/A"
        });
      } else {
        console.log("No employee assigned");
        setOwner(null);
      }
    } catch (error) {
      console.error("Error fetching asset:", error);
      setAsset(null);
      setOwner(null);
      setMessage("Asset not found");
      setMessageType("danger");
    }
    setIsLoading(false);
  }

  const getStatusColor = (status) => {
    const colors = {
      "assigned": "bg-green-900/30 text-green-100 border-green-500/50 font-bold",
      "available": "bg-green-900/30 text-green-100 border-green-500/50 font-bold",
      "instock": "bg-green-900/30 text-green-100 border-green-500/50 font-bold",
      "inrepair": "bg-orange-900/30 text-orange-100 border-2 border-orange-500 font-bold",
      "missing": "bg-red-900/30 text-red-100 border-red-500/50 font-bold",
    };
    return colors[status?.toLowerCase()] || "bg-gray-700/30 text-white border-gray-600/50 font-bold";
  };

  return (
    <div className="page">
      <div className="mb-6 sm:mb-8">
        <h2 className="text-2xl sm:text-4xl font-bold text-white mb-2">💻 Quick Check</h2>
        <p className="text-sm sm:text-base text-white font-medium">Scan or search any asset to view details and owner information</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <Card className="mb-6 sm:mb-8">
          <h3 className="text-xl sm:text-2xl font-semibold text-white mb-4 sm:mb-6 flex items-center gap-2">
            <span>🔎</span> Search Asset
          </h3>

          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search asset code or model..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowList(true);
                }}
                onKeyPress={e => {
                  if (e.key === 'Enter') {
                    loadAssetDetails(search);
                    setShowList(false);
                  }
                }}
                onFocus={() => search && setShowList(true)}
                className="bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-3 sm:py-2 px-4 sm:px-3 text-base sm:text-sm w-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
                autoFocus
              />
              <span
                className="absolute right-4 top-3 sm:top-2 cursor-pointer text-orange-400 text-xl"
                onClick={() => setShowList(!showList)}
              >
                ▼
              </span>
            </div>
            <div className="flex gap-2 sm:gap-3">
              <Button
                variant="primary"
                onClick={() => loadAssetDetails(search)}
                isLoading={isLoading}
                className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50 px-3 sm:px-5 py-2 text-sm sm:text-base relative overflow-hidden group"
                icon="🎯 "
              >
                <span className="relative z-10">Search</span>
                <span className="absolute inset-0 bg-gradient-to-r from-yellow-300/0 via-yellow-300/30 to-yellow-300/0 opacity-0 group-hover:opacity-100 group-hover:animate-pulse"></span>
              </Button>
              <Button
                variant="primary"
                onClick={startBarcodeScanner}
                className="flex-1 sm:flex-none bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50 px-3 sm:px-5 py-2 text-sm sm:text-base"
                icon="📷 "
                title="Scan barcode"
              >
                Scan
              </Button>
            </div>
          </div>

          {/* Asset dropdown */}
          {showList && filteredAssets.length > 0 && (
            <div className="border-2 border-orange-500 rounded-lg overflow-hidden mb-4 bg-gray-900/80 backdrop-blur-sm shadow-2xl z-10">
              {filteredAssets.slice(0, 8).map(a => (
                <div
                  key={a.asset_code}
                  onClick={() => {
                    loadAssetDetails(a.asset_code);
                    setShowList(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-orange-500/10 border-b-2 border-orange-500 transition-colors"
                >
                  <div className="font-semibold text-orange-400">{a.asset_code}</div>
                  <div className="text-sm text-white font-medium">{a.brand} {a.model}</div>
                  <Badge variant="info">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Asset Details Section */}
        {asset && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Asset Card */}
            <Card className="bg-gradient-to-br from-gray-900 to-gray-800 relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-orange-500" style={{
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3)
              `
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span>📦</span> Asset Details
              </h3>

              <div className="space-y-4 relative z-10">
                <div>
                  <p className="text-sm text-white font-bold">Asset Code</p>
                  <p className="text-2xl font-bold text-orange-400">{asset.asset_code}</p>
                </div>

                <div>
                  <p className="text-sm text-white font-bold">Category</p>
                  <p className="text-lg text-white font-medium">{asset.category}</p>
                </div>

                <div>
                  <p className="text-sm text-white font-bold">Brand & Model</p>
                  <p className="text-lg text-white font-medium">{asset.brand} {asset.model}</p>
                </div>

                <div>
                  <p className="text-sm text-white font-bold">Serial Number</p>
                  <p className="text-lg text-white font-mono font-medium">{asset.serial_number || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-white font-bold">Location</p>
                  <p className="text-lg text-white font-medium">{asset.location || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-white font-bold">Type</p>
                  <p className="text-lg text-white font-medium">{asset.type}</p>
                </div>

                <div>
                  <p className="text-sm text-white font-bold">Status</p>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(asset.status)}`}>
                    {asset.status?.toUpperCase() || "UNKNOWN"}
                  </div>
                </div>
              </div>
            </Card>

            {/* Owner Card */}
            <Card className={`bg-gradient-to-br ${owner ? "from-gray-900 to-gray-800" : "from-gray-900 to-gray-800"} relative overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl border-2 border-orange-500`} style={{
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3)
              `
            }}>
              <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent pointer-events-none"></div>
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2 relative z-10">
                <span>{owner ? "👤" : "📭"}</span> {owner ? "Owner Information" : "No Assignment"}
              </h3>

              {owner ? (
                <div className="space-y-4 relative z-10">
                  <div>
                    <p className="text-sm text-white font-bold">Employee ID</p>
                    <p className="text-2xl font-bold text-orange-400">{owner.employee_id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white font-bold">Name</p>
                    <p className="text-lg font-bold text-white">{owner.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white font-bold">Email</p>
                    <p className="text-lg text-white font-medium">{owner.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-white font-bold">Location</p>
                    <p className="text-lg text-white font-medium">{owner.location}</p>
                  </div>

                  <div className="mt-6 p-4 bg-green-900/30 rounded-lg border-l-4 border-green-500">
                    <p className="text-sm text-green-300">
                      <strong>Status:</strong> This asset is assigned to the employee above
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4 relative z-10">
                  <div className="p-6 bg-yellow-900/30 rounded-lg border-2 border-yellow-600/50 text-center">
                    <p className="text-yellow-300 font-semibold">
                      This asset is not assigned to any employee
                    </p>
                    <p className="text-sm text-yellow-400 mt-2">
                      Status: {asset.status?.toUpperCase()}
                    </p>
                  </div>
                </div>
              )}
            </Card>
          </div>
        )}

        {/* No Results State */}
        {!asset && search && !isLoading && message && (
          <Card className="text-center py-12 bg-gray-900/50 border-2 border-orange-500">
            <p className="text-3xl mb-4">🤔</p>
            <p className="text-xl text-white">No asset found for "<strong className="text-orange-400">{search}</strong>"</p>
            <p className="text-sm text-white font-medium mt-2">Try scanning a barcode or entering a different asset code</p>
          </Card>
        )}

        {/* Message Alert */}
        {message && (
          <div className="mt-8">
            <Alert 
              variant={messageType}
              onClose={() => setMessage("")}
            >
              {message}
            </Alert>
          </div>
        )}
      </div>

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-85 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-lg w-full overflow-hidden border-2 border-orange-500">
            <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 text-white flex items-center justify-between border-b-2 border-orange-500">
              <h3 className="text-xl font-bold flex items-center gap-2 text-orange-400">
                <span className="text-3xl">📸</span> Scan Barcode
              </h3>
              <button
                onClick={stopBarcodeScanner}
                className="text-2xl cursor-pointer hover:scale-125 transition-transform"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative w-full bg-gray-950 rounded-lg overflow-hidden mb-6 border-2 border-orange-500" style={{ paddingBottom: "100%" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute top-0 left-0 w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-orange-500 w-40 h-32 rounded-lg opacity-70"></div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-bold text-white mb-2">Scanned Barcode or Manual Entry:</label>
                <input
                  type="text"
                  placeholder="Point camera at barcode or type here..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && search.trim()) {
                      handleBarcodeScan(search.trim());
                    }
                  }}
                  className="bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-2 px-3 text-sm w-full focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
                  autoFocus
                />
              </div>

              <p className="text-xs text-white font-medium text-center mb-4">
                💡 Tip: Use a barcode scanner device (reads directly to input field) or type manually and press Enter
              </p>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (search.trim()) {
                      handleBarcodeScan(search.trim());
                    }
                  }}
                  className="flex-1 bg-green-600/80 hover:bg-green-500 text-white border border-green-500/50"
                >
                  ✓ Confirm Barcode
                </Button>
                <Button
                  variant="secondary"
                  onClick={stopBarcodeScanner}
                  className="flex-1 bg-orange-600/80 hover:bg-orange-500 text-white border-2 border-orange-500 font-bold rounded-full"
                >
                  ✕ Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
