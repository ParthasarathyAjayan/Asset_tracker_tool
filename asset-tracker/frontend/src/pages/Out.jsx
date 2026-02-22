import { useState, useRef, useEffect } from "react";
import {
  returnAsset,
  sendToRepair,
  markMissing,
  retireAsset,
} from "../api/api";
import { Button, Card, Input, Alert, Badge } from "../components";

export default function Out() {
  const [barcode, setBarcode] = useState("");
  const [action, setAction] = useState("return");
  const [employee, setEmployee] = useState("");
  const [secret, setSecret] = useState("");
  const [comments, setComments] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showBarcodeScanner, setShowBarcodeScanner] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
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
      setMsg("Camera permission denied or not available");
      setMsgType("danger");
    }
  }

  function stopBarcodeScanner() {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    setShowBarcodeScanner(false);
  }

  function handleBarcodeScan(scannedBarcode) {
    setBarcode(scannedBarcode);
    stopBarcodeScanner();
  }

  async function execute() {
    if (!barcode.trim()) {
      setMsg("Please enter a barcode");
      setMsgType("warning");
      return;
    }

    setIsLoading(true);
    let res;

    try {
      if (action === "return") {
        res = await returnAsset(barcode, comments);
      } else if (action === "repair") {
        if (!employee.trim()) {
          setMsg("Please enter repair employee ID");
          setMsgType("warning");
          setIsLoading(false);
          return;
        }
        res = await sendToRepair(barcode, employee, comments);
      } else if (action === "missing") {
        res = await markMissing(barcode, comments);
      } else if (action === "retire") {
        if (!secret.trim()) {
          setMsg("Please enter admin secret");
          setMsgType("warning");
          setIsLoading(false);
          return;
        }
        res = await retireAsset(barcode, secret, comments);
      }

      setMsg(res.message || res.detail);
      setMsgType(res.message ? "success" : "danger");
      
      if (res.message) {
        setBarcode("");
        setEmployee("");
        setSecret("");
        setComments("");
      }
    } catch (error) {
      setMsg("Error executing action");
      setMsgType("danger");
    }
    setIsLoading(false);
  }

  const actionConfig = {
    return: {
      label: "Return Asset",
      description: "Mark asset as returned",
      icon: "📥",
      color: "from-blue-500 to-blue-600"
    },
    repair: {
      label: "Send to Repair",
      description: "Send asset for repair",
      icon: "🔧",
      color: "from-orange-500 to-orange-600"
    },
    missing: {
      label: "Mark Missing",
      description: "Report asset as missing",
      icon: "❓",
      color: "from-red-500 to-red-600"
    },
    retire: {
      label: "Retire Asset",
      description: "Retire asset from service",
      icon: "🚫",
      color: "from-gray-500 to-gray-600"
    },
  };

  const current = actionConfig[action];

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Manage Asset Status</h2>
        <p className="text-gray-600">Manage asset status: return, repair, missing, or retire</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Action Selector */}
        <Card className="lg:col-span-2">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6">Select Action</h3>

          <div className="grid grid-cols-2 gap-4 mb-8">
            {Object.entries(actionConfig).map(([key, config]) => (
              <button
                key={key}
                onClick={() => setAction(key)}
                className={`p-4 rounded-lg border-2 transition-all ${
                  action === key
                    ? `border-blue-500 bg-blue-50`
                    : `border-gray-200 hover:border-gray-300`
                }`}
              >
                <div className="text-3xl mb-2">{config.icon}</div>
                <div className="text-sm font-semibold text-gray-800">{config.label}</div>
                <div className="text-xs text-gray-600 mt-1">{config.description}</div>
              </button>
            ))}
          </div>

          {/* Barcode Input with Scan Button */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">📦 Asset Barcode</label>
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Scan or enter barcode"
                value={barcode}
                onChange={e => setBarcode(e.target.value)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
              <Button
                variant="primary"
                onClick={startBarcodeScanner}
                className="bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2"
                icon="📷"
                title="Scan barcode"
              >
                Scan
              </Button>
            </div>
          </div>

          {/* Barcode Scanner Modal */}
          {showBarcodeScanner && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <Card className="w-full max-w-md">
                <h3 className="text-2xl font-bold text-gray-800 mb-4">📷 Scan Barcode</h3>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full rounded-lg mb-4 bg-black"
                  style={{ maxHeight: '400px' }}
                />
                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Or enter manually:</label>
                  <input
                    type="text"
                    placeholder="Type barcode..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && e.target.value.trim()) {
                        handleBarcodeScan(e.target.value.trim());
                        e.target.value = '';
                      }
                    }}
                    autoFocus
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={stopBarcodeScanner}
                    className="flex-1"
                  >
                    Close
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Conditional Inputs */}
          {action === "repair" && (
            <Input
              label="👤 Repair Employee ID"
              placeholder="ID of person handling repair"
              value={employee}
              onChange={e => setEmployee(e.target.value)}
              icon="👨‍🔧"
            />
          )}

          {action === "retire" && (
            <Input
              label="🔐 Admin Secret"
              placeholder="Enter admin secret"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              icon="🔒"
            />
          )}

          {/* Comments Section */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">💬 Comments (Optional)</label>
            <textarea
              placeholder="Add any notes or comments for audit trail..."
              value={comments}
              onChange={e => setComments(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all resize-none"
              rows="4"
            />
            <p className="text-xs text-gray-500 mt-1">Comments will be saved in the audit history</p>
          </div>

          {/* Action Button */}
          <Button 
            variant="primary"
            onClick={execute}
            isLoading={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2 text-base"
            size="md"
            icon={current.icon}
          >
            {current.label}
          </Button>
        </Card>

        {/* Info Card */}
        <Card className={`bg-gradient-to-br ${current.color} text-white`}>
          <h3 className="text-2xl font-semibold mb-4">{current.label}</h3>
          <p className="opacity-90 mb-6">{current.description}</p>

          <div className="bg-white bg-opacity-20 rounded-lg p-4 space-y-3">
            <div className="flex items-start gap-3">
              <span className="text-2xl">ℹ️</span>
              <div>
                <p className="font-semibold text-sm">What happens?</p>
                {action === "return" && (
                  <p className="text-sm opacity-90 mt-1">Asset will be marked as returned and available for reassignment</p>
                )}
                {action === "repair" && (
                  <p className="text-sm opacity-90 mt-1">Asset will be marked in repair status for the specified employee</p>
                )}
                {action === "missing" && (
                  <p className="text-sm opacity-90 mt-1">Asset will be flagged as missing from the system</p>
                )}
                {action === "retire" && (
                  <p className="text-sm opacity-90 mt-1">Asset will be retired and no longer tracked</p>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-white bg-opacity-10 rounded-lg">
            <p className="text-sm font-semibold mb-2">⚠️ Important</p>
            <p className="text-sm opacity-90">Ensure the barcode is correct before executing the action</p>
          </div>
        </Card>
      </div>

      {/* Message Alert */}
      {msg && (
        <div className="mt-8">
          <Alert 
            variant={msgType}
            onClose={() => setMsg("")}
          >
            {msg}
          </Alert>
        </div>
      )}
    </div>
  );
}
