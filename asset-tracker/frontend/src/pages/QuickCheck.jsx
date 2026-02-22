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
        video: { facingMode: "environment" },
        audio: false
      });
      streamRef.current = stream;
      setShowBarcodeScanner(true);
      
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      }, 0);
    } catch (error) {
      setMessage("Camera permission denied or not available");
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
      "assigned": "bg-blue-100 text-blue-800 border-blue-300",
      "available": "bg-green-100 text-green-800 border-green-300",
      "instock": "bg-green-100 text-green-800 border-green-300",
      "inrepair": "bg-orange-100 text-orange-800 border-orange-300",
      "missing": "bg-red-100 text-red-800 border-red-300",
    };
    return colors[status?.toLowerCase()] || "bg-gray-100 text-gray-800 border-gray-300";
  };

  return (
    <div className="page">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">🔍 Quick Check</h2>
        <p className="text-gray-600">Scan or search any asset to view details and owner information</p>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Search Section */}
        <Card className="mb-8">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span>🔎</span> Search Asset
          </h3>

          <div className="flex gap-3 mb-6">
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
                className="input-base py-2 px-3 text-sm w-full"
                autoFocus
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-400 text-xl"
                onClick={() => setShowList(!showList)}
              >
                ▼
              </span>
            </div>
            <Button
              variant="primary"
              onClick={() => loadAssetDetails(search)}
              isLoading={isLoading}
              className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2 text-base"
              icon="🔍 "
            >
              Search
            </Button>
            <Button
              variant="primary"
              onClick={startBarcodeScanner}
              className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2 text-base"
              icon="📷 "
              title="Scan barcode"
            >
              Scan
            </Button>
          </div>

          {/* Asset dropdown */}
          {showList && filteredAssets.length > 0 && (
            <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white shadow-lg z-10">
              {filteredAssets.slice(0, 8).map(a => (
                <div
                  key={a.asset_code}
                  onClick={() => {
                    loadAssetDetails(a.asset_code);
                    setShowList(false);
                  }}
                  className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition-colors"
                >
                  <div className="font-semibold text-blue-600">{a.asset_code}</div>
                  <div className="text-sm text-gray-600">{a.brand} {a.model}</div>
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
            <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>📦</span> Asset Details
              </h3>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 font-semibold">Asset Code</p>
                  <p className="text-2xl font-bold text-blue-600">{asset.asset_code}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Category</p>
                  <p className="text-lg text-gray-800">{asset.category}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Brand & Model</p>
                  <p className="text-lg text-gray-800">{asset.brand} {asset.model}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Serial Number</p>
                  <p className="text-lg text-gray-800 font-mono">{asset.serial_number || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Location</p>
                  <p className="text-lg text-gray-800">{asset.location || "N/A"}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Type</p>
                  <p className="text-lg text-gray-800">{asset.type}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600 font-semibold">Status</p>
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-bold border ${getStatusColor(asset.status)}`}>
                    {asset.status?.toUpperCase() || "UNKNOWN"}
                  </div>
                </div>
              </div>
            </Card>

            {/* Owner Card */}
            <Card className={`bg-gradient-to-br ${owner ? "from-purple-50 to-pink-50" : "from-gray-50 to-gray-100"}`}>
              <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <span>{owner ? "👤" : "📭"}</span> {owner ? "Owner Information" : "No Assignment"}
              </h3>

              {owner ? (
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Employee ID</p>
                    <p className="text-2xl font-bold text-green-600">{owner.employee_id}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Name</p>
                    <p className="text-lg font-bold text-gray-800">{owner.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Email</p>
                    <p className="text-lg text-gray-800">{owner.email}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-600 font-semibold">Location</p>
                    <p className="text-lg text-gray-800">{owner.location}</p>
                  </div>

                  <div className="mt-6 p-4 bg-green-100 rounded-lg border-l-4 border-green-600">
                    <p className="text-sm text-green-800">
                      <strong>Status:</strong> This asset is assigned to the employee above
                    </p>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-6 bg-yellow-50 rounded-lg border-2 border-yellow-300 text-center">
                    <p className="text-yellow-800 font-semibold">
                      This asset is not assigned to any employee
                    </p>
                    <p className="text-sm text-yellow-600 mt-2">
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
          <Card className="text-center py-12 bg-gray-50">
            <p className="text-3xl mb-4">🤔</p>
            <p className="text-xl text-gray-600">No asset found for "<strong>{search}</strong>"</p>
            <p className="text-sm text-gray-500 mt-2">Try scanning a barcode or entering a different asset code</p>
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
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-3xl">🔍</span> Scan Barcode
              </h3>
              <button
                onClick={stopBarcodeScanner}
                className="text-2xl cursor-pointer hover:scale-125 transition-transform"
              >
                ✕
              </button>
            </div>
            
            <div className="p-6">
              <div className="relative w-full bg-black rounded-lg overflow-hidden mb-6" style={{ paddingBottom: "100%" }}>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="absolute top-0 left-0 w-full h-full"
                />
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-2 border-green-400 w-40 h-32 rounded-lg opacity-70"></div>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-700 mb-2">Scanned Barcode or Manual Entry:</label>
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
                  className="input-base w-full"
                  autoFocus
                />
              </div>

              <p className="text-xs text-gray-500 text-center mb-4">
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
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  ✓ Confirm Barcode
                </Button>
                <Button
                  variant="secondary"
                  onClick={stopBarcodeScanner}
                  className="flex-1"
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
