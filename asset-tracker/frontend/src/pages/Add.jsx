import { useState, useEffect, useRef } from "react";
import { fetchCategories, addAsset, fetchAssetCount, checkDuplicateCategory, addCategory } from "../api/api";
import { Button, Card, Input, Select, Alert } from "../components";
import { useNavigate } from "react-router-dom";
import JsBarcode from "jsbarcode";

export default function Add() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const barcodeRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const [assetCount, setAssetCount] = useState(0);
  const [generatedBarcode, setGeneratedBarcode] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [similarCategories, setSimilarCategories] = useState([]);
  const [showSimilarWarning, setShowSimilarWarning] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories().then(setCategories);
    fetchAssetCount().then(setAssetCount);
  }, []);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  // Generate barcode SVG when barcode is generated
  useEffect(() => {
    if (generatedBarcode && barcodeRef.current) {
      try {
        // Clear previous barcode
        barcodeRef.current.innerHTML = '';
        
        // Create SVG element for barcode
        const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        barcodeRef.current.appendChild(svg);
        
        // Generate barcode on the SVG
        JsBarcode(svg, generatedBarcode, {
          format: "CODE128",
          width: 2,
          height: 100,
          displayValue: true,
          margin: 10,
        });
      } catch (error) {
        console.error("Error generating barcode:", error);
      }
    }
  }, [generatedBarcode]);

  function handleSaveClick() {
    setShowConfirm(true);
  }

  async function confirmSave() {
    setShowConfirm(false);
    setIsLoading(true);
    try {
      const res = await addAsset(form);
      if (res.message) {
        setMsg(res.message);
        setMsgType("success");
        setForm({});
        setGeneratedBarcode(res.asset_code || "");
      } else if (res.detail) {
        setMsg(res.detail);
        setMsgType("danger");
        setGeneratedBarcode("");
      }
    } catch (error) {
      setMsg("Error adding asset");
      setMsgType("danger");
      setGeneratedBarcode("");
    }
    setIsLoading(false);
  }

  function cancelSave() {
    setShowConfirm(false);
  }

  async function handleCheckCategory() {
    if (!newCategoryName.trim()) {
      setMsg("Please enter a category name");
      setMsgType("warning");
      return;
    }

    setCategoryLoading(true);
    try {
      const result = await checkDuplicateCategory(newCategoryName);
      
      if (result.has_similar && result.similar_categories.length > 0) {
        setSimilarCategories(result.similar_categories);
        setShowSimilarWarning(true);
      } else {
        // No similar categories, add it directly
        await proceedAddCategory();
      }
    } catch (error) {
      setMsg("Error checking category");
      setMsgType("danger");
    }
    setCategoryLoading(false);
  }

  async function proceedAddCategory() {
    setCategoryLoading(true);
    try {
      const result = await addCategory(newCategoryName);
      
      if (result.message) {
        setMsg(`Category "${result.name}" added successfully!`);
        setMsgType("success");
        
        // Refresh categories
        const updatedCategories = await fetchCategories();
        setCategories(updatedCategories);
        
        // Clear the form
        setNewCategoryName("");
        setShowAddCategory(false);
        setShowSimilarWarning(false);
        setSimilarCategories([]);
      } else {
        setMsg(result.detail || "Error adding category");
        setMsgType("danger");
      }
    } catch (error) {
      setMsg("Error adding category");
      setMsgType("danger");
    }
    setCategoryLoading(false);
  }

  const categoryOptions = [
    { value: "", label: "Select Category" },
    ...categories.map(c => ({ value: c.id, label: c.name }))
  ];

  return (
    <div className="page">
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Add New Asset</h2>
        <p className="text-white font-medium">Register a new IT asset in the system</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form Section */}
        <Card className="form-section bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500" style={{
          boxShadow: `
            0 20px 40px rgba(0, 0, 0, 0.15),
            inset 0 1px 0 rgba(255, 255, 255, 0.1),
            inset 0 -2px 4px rgba(0, 0, 0, 0.3)
          `
        }}>
          <h3 className="text-2xl font-semibold text-white mb-6 flex items-center gap-2">
            <span>📝</span> Asset Details
          </h3>

          {/* Barcode is generated after submission */}
          {generatedBarcode && (
            <div className="mb-4 p-4 bg-green-900/30 border-l-4 border-green-500 rounded">
              <div className="text-lg font-semibold text-green-100 mb-3 flex items-center gap-2">
                <span>✅</span> Barcode Generated Successfully
              </div>
              <div className="flex flex-col items-center justify-center bg-gray-900/50 p-4 rounded border-2 border-green-500/50 barcode-print-section">
                <div ref={barcodeRef}></div>
                <div className="mt-3 text-center text-sm font-mono font-bold text-white">{generatedBarcode}</div>
              </div>
              <Button className="w-full" onClick={() => {
                setTimeout(() => window.print(), 100);
              }}>🖨️ Print Barcode</Button>
              
              {/* Print styles - show only barcode */}
              <style>{`
                @page {
                  margin: 0 !important;
                  padding: 0 !important;
                }
                
                @media print {
                  body * {
                    visibility: hidden !important;
                  }

                  .barcode-print-section,
                  .barcode-print-section * {
                    visibility: visible !important;
                  }

                  .barcode-print-section {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                    text-align: center;
                    background: white !important;
                    padding: 20px 0 !important;
                    margin: 0 !important;
                  }

                  .barcode-print-section svg {
                    width: 100% !important;
                    max-width: 400px !important;
                    height: auto !important;
                    margin: 0 auto 10px !important;
                  }

                  .barcode-print-section > div {
                    color: black !important;
                    font-family: 'Courier New', monospace !important;
                    font-size: 14pt !important;
                    font-weight: bold !important;
                  }
                }
              `}</style>
            </div>
          )}

          <div className="flex gap-3 mb-6">
            <div className="flex-1">
              <label className="form-label text-white font-bold">Category *</label>
              <select
                name="category_id"
                value={form.category_id || ""}
                onChange={update}
                className="input-base w-full bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
              >
                <option value="" className="bg-gray-900 text-white">Select Category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id} className="bg-gray-900 text-white">{c.name}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <Button 
                variant="secondary"
                onClick={() => setShowAddCategory(true)}
                className="px-4 py-3 text-orange-400 border-b-2 border-orange-500 hover:bg-orange-500/10 whitespace-nowrap"
                title="Add a new category"
              >
                ➕ New
              </Button>
            </div>
          </div>

          <Select
            name="type"
            label="Type *"
            value={form.type || ""}
            onChange={update}
            options={[
              { value: "", label: "Select Type" },
              { value: "New", label: "New" },
              { value: "Repaired", label: "Repaired" },
            ]}
          />

          <Input
            name="brand"
            label="Brand"
            placeholder="e.g., Dell, HP, Apple"
            value={form.brand || ""}
            onChange={update}
            icon="🏷️"
          />

          <Input
            name="model"
            label="Model"
            placeholder="e.g., ThinkPad X1"
            value={form.model || ""}
            onChange={update}
            icon="🔖"
          />

          <Input
            name="serial_number"
            label="Serial Number"
            placeholder="Unique serial number"
            value={form.serial_number || ""}
            onChange={update}
            icon="🔐"
          />

          <Input
            name="location"
            label="Location"
            placeholder="e.g., Office 101, Warehouse A"
            value={form.location || ""}
            onChange={update}
            icon="📍"
          />

          <div className="flex gap-3 pt-4">
            <Button 
              variant="primary" 
              onClick={handleSaveClick}
              isLoading={isLoading}
            >
              Save Asset
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => {
                setForm({});
                setGeneratedBarcode("");
              }}
            >
              Clear Form
            </Button>
          </div>
        </Card>

        {/* Info Section */}
        <div>
          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500 mb-6" style={{
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `
          }}>
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
              <span>ℹ️</span> Quick Tips
            </h3>
            <ul className="space-y-3 text-white font-medium">
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong className="text-white">Barcode:</strong> Use the asset barcode or a unique identifier</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong className="text-white">Category:</strong> Choose the appropriate category for classification</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong className="text-white">Type:</strong> Indicate if the asset is new or has been repaired</span>
              </li>
              <li className="flex gap-3">
                <span className="text-orange-400 font-bold">•</span>
                <span><strong className="text-white">Serial Number:</strong> Enter the manufacturer's serial number if available</span>
              </li>
            </ul>
          </Card>

          <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500" style={{
            boxShadow: `
              0 20px 40px rgba(0, 0, 0, 0.15),
              inset 0 1px 0 rgba(255, 255, 255, 0.1),
              inset 0 -2px 4px rgba(0, 0, 0, 0.3)
            `
          }}>
            <h3 className="text-xl font-bold text-orange-400 mb-6 flex items-center gap-2">
              <span>📊</span> Asset Statistics
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="primary"
                className="w-full bg-white rounded-lg p-4 text-center flex flex-col items-center justify-center"
                style={{ boxShadow: "none" }}
                onClick={() => navigate("/assets")}
              >
                <span className="text-3xl font-bold text-blue-600">📦</span>
                <span className="text-sm text-gray-900 font-medium mt-2">Total Assets</span>
                <span className="text-2xl font-bold text-blue-700 mt-1">{assetCount}</span>
              </Button>
              <div className="bg-white rounded-lg p-4 text-center">
                <p className="text-3xl font-bold text-green-600">✓</p>
                <p className="text-sm text-gray-900 font-medium mt-2">Registered</p>
              </div>
            </div>
          </Card>
        </div>
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

      {/* Custom Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-orange-500">
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>⚠️</span> Confirm Action
              </h3>
            </div>
            <div className="p-6">
              <p className="text-white text-lg mb-6">
                Save the asset details and generate a new barcode?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={confirmSave}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:scale-105 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 border border-orange-400/50"
                >
                  {isLoading ? "Processing..." : "✅ Confirm"}
                </button>
                <button
                  onClick={cancelSave}
                  disabled={isLoading}
                  className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 border border-gray-600/50"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showAddCategory && !showSimilarWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-orange-500">
            <div className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>➕</span> Add New Category
              </h3>
            </div>
            <div className="p-6">
              <p className="text-white mb-4">Enter the name of the new category:</p>
              <input
                type="text"
                placeholder="e.g., Laptop, Monitor, Printer"
                value={newCategoryName}
                onChange={e => setNewCategoryName(e.target.value)}
                className="input-base w-full mb-4 bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400"
                autoFocus
              />
              <div className="flex gap-3">
                <button
                  onClick={handleCheckCategory}
                  disabled={categoryLoading}
                  className="flex-1 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:scale-105 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 border border-orange-400/50"
                >
                  {categoryLoading ? "Checking..." : "✅ Check & Add"}
                </button>
                <button
                  onClick={() => {
                    setShowAddCategory(false);
                    setNewCategoryName("");
                  }}
                  disabled={categoryLoading}
                  className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 border border-gray-600/50"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Similar Category Warning Modal */}
      {showSimilarWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-gray-900 rounded-lg shadow-2xl max-w-md w-full mx-4 overflow-hidden border-2 border-orange-500">
            <div className="bg-gradient-to-r from-yellow-600 to-orange-600 p-6 text-white">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <span>⚠️</span> Similar Category Found
              </h3>
            </div>
            <div className="p-6">
              <p className="text-white mb-4">
                The following similar categories already exist:
              </p>
              <div className="mb-6 bg-yellow-900/30 p-4 rounded border-l-4 border-yellow-500 max-h-40 overflow-y-auto">
                {similarCategories.map((cat, idx) => (
                  <div key={idx} className="mb-2 text-sm">
                    <span className="font-semibold text-yellow-100">{cat.name}</span>
                    {cat.type === "exact" && (
                      <span className="ml-2 text-red-400 text-xs">(Exact match)</span>
                    )}
                    {cat.type === "similar" && (
                      <span className="ml-2 text-yellow-400 text-xs">
                        ({Math.round(cat.similarity * 100)}% similar)
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <p className="text-white text-sm font-medium mb-4">
                Are you sure you want to add "<strong className="text-white">{newCategoryName}</strong>" as a new category?
              </p>
              <div className="flex gap-3">
                <button
                  onClick={proceedAddCategory}
                  disabled={categoryLoading}
                  className="flex-1 bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 hover:scale-105 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 border border-orange-400/50"
                >
                  {categoryLoading ? "Adding..." : "✅ Yes, Add Anyway"}
                </button>
                <button
                  onClick={() => {
                    setShowSimilarWarning(false);
                    setShowAddCategory(true);
                  }}
                  disabled={categoryLoading}
                  className="flex-1 bg-gray-700/80 hover:bg-gray-600 text-white font-semibold py-3 rounded-full transition disabled:opacity-50 border border-gray-600/50"
                >
                  ❌ Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
