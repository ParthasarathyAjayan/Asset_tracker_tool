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
    return colors[status] || "text-gray-600";
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Assign Asset</h2>
        <p className="text-gray-600">Assign IT assets to employees</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Step 1: Select Asset */}
        <Card className="lg:col-span-2">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Select Asset
          </h3>

          <label className="form-label">📦 Scan / Type / Select Asset</label>
          <div className="flex gap-2 mb-4">
            <div className="relative flex-1">
              <input
                placeholder="Search asset code or model..."
                value={search}
                onChange={e => {
                  setSearch(e.target.value);
                  setShowList(true);
                }}
                className="input-base w-full"
                onFocus={() => search && setShowList(true)}
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
                  onClick={() => loadAsset(a.asset_code)}
                  className="p-3 cursor-pointer hover:bg-blue-50 border-b border-gray-100 transition-colors"
                >
                  <div className="font-semibold text-blue-600">{a.asset_code}</div>
                  <div className="text-sm text-gray-600">{a.brand} {a.model}</div>
                  <Badge variant="info">{a.status}</Badge>
                </div>
              ))}
            </div>
          )}

          <Button 
            variant="primary"
            onClick={() => loadAsset(search)}
            className="mb-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2 text-base"
            icon="🔍 "
            size="md"
          >
            Load Asset
          </Button>

          {/* Asset Details Card */}
          {asset && (
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-l-4 border-blue-600">
              <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>✓</span> Asset Selected
              </h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Asset Code:</span>
                  <span className="font-semibold text-blue-600">{asset.asset_code}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Category:</span>
                  <span className="font-semibold">{asset.category}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Brand:</span>
                  <span>{asset.brand}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Model:</span>
                  <span>{asset.model}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Status:</span>
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
          <Card>
            <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
              <span className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
              Select Employee
            </h3>

            <label className="form-label">👤 Search Employee</label>
            <div className="relative mb-4">
              <input
                placeholder="ID or name..."
                value={employeeSearch}
                onChange={e => {
                  setEmployeeSearch(e.target.value);
                  setShowEmployeeList(true);
                }}
                className="input-base"
                onFocus={() => employeeSearch && setShowEmployeeList(true)}
              />
              <span
                className="absolute right-4 top-3 cursor-pointer text-gray-400 text-xl"
                onClick={() => setShowEmployeeList(!showEmployeeList)}
              >
                ▼
              </span>
            </div>

            {/* Employee dropdown */}
            {showEmployeeList && filteredEmployees.length > 0 && (
              <div className="border border-gray-200 rounded-lg overflow-hidden mb-4 bg-white shadow-lg">
                {filteredEmployees.slice(0, 6).map(emp => (
                  <div
                    key={emp.employee_id}
                    onClick={() => {
                      setEmployeeId(emp.employee_id);
                      setEmployeeSearch(`${emp.employee_id} - ${emp.name}`);
                      setShowEmployeeList(false);
                    }}
                    className="p-3 cursor-pointer hover:bg-purple-50 border-b border-gray-100 transition-colors"
                  >
                    <div className="font-semibold text-purple-600">{emp.employee_id}</div>
                    <div className="text-sm text-gray-600">{emp.name}</div>
                    <div className="text-xs text-gray-500">{emp.location}</div>
                  </div>
                ))}
              </div>
            )}

            {/* Selected Employee */}
            {employeeId && (
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 mb-6 border-l-4 border-purple-600">
                <h5 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                  <span>✓</span> Employee Selected
                </h5>
                <p className="text-sm text-gray-600">{employeeSearch}</p>
              </div>
            )}

            {/* Assign Button */}
            <Button 
              variant="primary"
              onClick={assign}
              isLoading={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2 text-base"
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

              <p className="text-sm text-gray-600 text-center mb-4">
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
