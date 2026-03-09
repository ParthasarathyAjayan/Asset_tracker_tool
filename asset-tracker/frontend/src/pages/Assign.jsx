import { useState, useEffect, useRef } from "react";
import {
  fetchAsset,
  assignAsset,
  fetchAssets,
  fetchEmployees
} from "../api/api";
import { Button, Card, Input, Alert, Badge } from "../components";

export default function Assign() {
  const [search, setSearch] = useState("");
  const [asset, setAsset] = useState(null);
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [employeeId, setEmployeeId] = useState("");
  const [employeeSearch, setEmployeeSearch] = useState("");
  const [showList, setShowList] = useState(false);
  const [showEmployeeList, setShowEmployeeList] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  useEffect(() => {
    fetchAssets().then(setAssets);
    fetchEmployees().then(setEmployees);

    // Cleanup camera stream on unmount
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
    // Auto-load the asset after scanning
    setTimeout(() => loadAsset(barcode), 100);
  }

  async function loadAsset(code) {
    try {
      const data = await fetchAsset(code);
      setAsset(data);
      setSearch(code);
      setMessage("");
      setShowList(false);
    } catch {
      setMessage("Asset not found");
      setMessageType("danger");
      setAsset(null);
    }
  }

  async function assign() {
    if (!employeeId) {
      setMessage("Please select an employee");
      setMessageType("warning");
      return;
    }
    setIsLoading(true);
    const res = await assignAsset(search, employeeId);
    setMessage(res.message || res.detail);
    setMessageType(res.message ? "success" : "danger");
    if (res.message) {
      setAsset(null);
      setSearch("");
      setEmployeeId("");
      setEmployeeSearch("");
    }
    setIsLoading(false);
  }

  const filteredAssets = assets.filter(a =>
    `${a.asset_code} ${a.model}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const filteredEmployees = employees.filter(e =>
    `${e.employee_id} ${e.name}`
      .toLowerCase()
      .includes(employeeSearch.toLowerCase())
  );

  const getStatusColor = (status) => {
    const colors = {
      "Assigned": "text-blue-600",
      "Available": "text-green-600",
      "In Repair": "text-orange-600",
      "Missing": "text-red-600",
    };
    return colors[status] || "text-white";
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Assign Asset</h2>
        <p className="text-white font-medium">Assign IT assets to employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Select Asset */}
        <Card className="lg:col-span-2 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500" style={{
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3)
          `
        }}>
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Select Asset
          </h3>

          <label className="form-label text-white font-bold">📦 Scan / Type / Select Asset</label>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                placeholder="Search asset code or model..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowList(true);
                }}
                className="input-base w-full bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
                onFocus={() => search && setShowList(true)}
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-orange-400 text-xl"
                onClick={() => setShowList(!showList)}
              >
                ▼
              </span>
            </div>
            <Button
              variant="primary"
              onClick={startBarcodeScanner}
              className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50 px-5 py-2 text-base"
              icon="📷 "
              title="Scan barcode"
            >
              Scan
            </Button>
          </div>

          {/* Asset dropdown */}
          {showList && filteredAssets.length > 0 && (
            <div className="border-2 border-orange-500 rounded-lg overflow-hidden mb-4 bg-gray-900/80 shadow-lg z-10">
              {filteredAssets.slice(0, 8).map(a => (
                <div
                  key={a.asset_code}
                  onClick={() => loadAsset(a.asset_code)}
                  className="p-3 cursor-pointer hover:bg-orange-500/10 border-b-2 border-orange-500 transition-colors"
                >
                  <div className="font-semibold text-orange-400">{a.asset_code}</div>
                  <div className="text-sm text-white font-medium">{a.brand} {a.model}</div>
                  <Badge variant="info">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}

          <Button 
            variant="primary"
            onClick={() => loadAsset(search)}
            className="mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50 px-5 py-2 text-base"
            icon="🔍 "
            size="md"
          >
            Load Asset
          </Button>

          {/* Asset Details Card */}
          {asset && (
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 border-l-4 border-orange-500" style={{
              boxShadow: `
                0 20px 40px rgba(0, 0, 0, 0.15),
                inset 0 1px 0 rgba(255, 255, 255, 0.1),
                inset 0 -2px 4px rgba(0, 0, 0, 0.3)
              `
            }}>
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <span>✓</span> Asset Selected
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Asset Code:</span>
                  <span className="font-semibold text-orange-400">{asset.asset_code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Category:</span>
                  <span className="font-medium text-white">{asset.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Brand:</span>
                  <span className="text-white font-medium">{asset.brand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Model:</span>
                  <span className="text-white font-medium">{asset.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-white font-bold">Status:</span>
                  <Badge variant={asset.status === "Available" ? "success" : "warning"}>
                    {asset.status}
                  </Badge>
                </div>
              </div>
            </div>
          )}
        </Card>

        {/* Step 2: Select Employee */}
        {asset && (
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500" style={{
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `
          }}>
            <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
              <span className="bg-orange-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
              Select Employee
            </h3>

            <label className="form-label text-white font-bold">👤 Search Employee</label>
            <div className="relative mb-4">
              <input
                placeholder="ID or name..."
                value={employeeSearch}
                onChange={e => {
                  setEmployeeSearch(e.target.value);
                  setShowEmployeeList(true);
                }}
                className="input-base bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 w-full"
                onFocus={() => employeeSearch && setShowEmployeeList(true)}
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-orange-400 text-xl"
                onClick={() => setShowEmployeeList(!showEmployeeList)}
              >
                ▼
              </span>
            </div>

            {/* Employee dropdown */}
            {showEmployeeList && filteredEmployees.length > 0 && (
              <div className="border-2 border-orange-500 rounded-lg overflow-hidden mb-4 bg-gray-900/80 shadow-lg">
                {filteredEmployees.slice(0, 6).map(emp => (
                  <div
                    key={emp.employee_id}
                    onClick={() => {
                      setEmployeeId(emp.employee_id);
                      setEmployeeSearch(`${emp.employee_id} - ${emp.name}`);
                      setShowEmployeeList(false);
                    }}
                    className="p-3 cursor-pointer hover:bg-orange-500/10 border-b-2 border-orange-500 transition-colors"
                  >
                    <div className="font-semibold text-orange-400">{emp.employee_id}</div>
                    <div className="text-sm text-white font-medium">{emp.name}</div>
                    <div className="text-xs text-white font-medium">{emp.location}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Employee */}
            {employeeId && (
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-4 mb-6 border-l-4 border-orange-500">
                <h5 className="font-semibold text-white mb-2 flex items-center gap-2">
                  <span>✓</span> Employee Selected
                </h5>
                <p className="text-sm text-white font-medium">{employeeSearch}</p>
              </div>
            )}

            {/* Assign Button */}
            <Button 
              variant="primary"
              onClick={assign}
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50 px-5 py-2 text-base"
              icon="💼"
              size="md"
            >
              Assign Asset
            </Button>
          </Card>
        )}
      </div>

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

      {/* Barcode Scanner Modal */}
      {showBarcodeScanner && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-6 text-white flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span className="text-3xl"> 📷 🔍 </span> Scan Barcode
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
              </div>

              <div className="grid grid-cols-1 gap-3 mb-4">
                <Input
                  placeholder="Barcode will appear here..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  icon="📦"
                />
              </div>

              <p className="text-sm text-white font-medium text-center mb-4">
                Point camera at barcode or type manually below
              </p>

              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={() => {
                    if (search) handleBarcodeScan(search);
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
