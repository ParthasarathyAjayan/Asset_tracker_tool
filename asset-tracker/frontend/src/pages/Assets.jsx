import { useEffect, useState } from "react";
import { fetchAssets } from "../api/api";
import { Card, Table, Input, Badge, LoadingSpinner, EmptyState } from "../components";

export default function Assets() {
  const [assets, setAssets] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterCategory, setFilterCategory] = useState("all");

  useEffect(() => {
    setIsLoading(true);
    fetchAssets().then(data => {
      setAssets(data || []);
      setIsLoading(false);
    });
  }, []);

  // Get unique categories
  const categories = [...new Set(assets.map(a => a.category))];

  // Filter assets
  const filteredAssets = assets.filter(a => {
    const matchSearch = searchTerm === "" || 
      a.asset_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.brand?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchStatus = filterStatus === "all" || a.status === filterStatus;
    const matchCategory = filterCategory === "all" || a.category === filterCategory;
    
    return matchSearch && matchStatus && matchCategory;
  });

  const getStatusBadge = (status) => {
    const statusMap = {
      "assigned": "success",
      "instock": "info",
      "repair": "warning",
      "missing": "danger",
      "retired": "secondary",
    };
    return statusMap[status] || "info";
  };

  const columns = [
    { 
      key: "asset_code", 
      label: "Asset Code",
      render: (value) => <span className="font-semibold text-orange-400">{value}</span>
    },
    { key: "category", label: "Category" },
    { 
      key: "status", 
      label: "Status",
      render: (value) => <Badge variant={getStatusBadge(value)}>{value}</Badge>
    },
    { key: "brand", label: "Brand" },
    { key: "model", label: "Model" },
    { key: "location", label: "Location" },
    { 
      key: "employee_name", 
      label: "Assigned To",
      render: (value, row) => (
        <span>{row.employee_id ? `${row.employee_id} - ${value || ""}` : "Unassigned"}</span>
      )
    },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">All Assets</h2>
        <p className="text-white font-medium">View and manage all IT assets in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">Total Assets</p>
              <p className="text-3xl font-bold text-orange-400">{assets.length}</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">Assigned</p>
              <p className="text-3xl font-bold text-green-400">
                {assets.filter(a => a.status === "assigned").length}
              </p>
            </div>
            <span className="text-4xl">✓</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">Available</p>
              <p className="text-3xl font-bold text-yellow-400">
                {assets.filter(a => a.status === "instock").length}
              </p>
            </div>
            <span className="text-4xl">📌</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">In Repair</p>
              <p className="text-3xl font-bold text-red-400">
                {assets.filter(a => a.status === "repair").length}
              </p>
            </div>
            <span className="text-4xl">🔧</span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 bg-gray-900 border-2 border-orange-500">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label text-white font-bold">🔍 Search</label>
            <input 
              type="text"
              placeholder="Code, model, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base bg-gray-900/50 border-2 border-orange-500 text-white placeholder-gray-300 rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 w-full"
            />
          </div>

          <div>
            <label className="form-label text-white font-bold">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-base bg-gray-900/50 border-2 border-orange-500 text-white rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 w-full"
            >
              <option value="all" className="bg-gray-900 text-white">All Status</option>
              <option value="assigned" className="bg-gray-900 text-white">Assigned</option>
              <option value="instock" className="bg-gray-900 text-white">Available</option>
              <option value="repair" className="bg-gray-900 text-white">In Repair</option>
              <option value="missing" className="bg-gray-900 text-white">Missing</option>
            </select>
          </div>

          <div>
            <label className="form-label text-white font-bold">Category</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-base bg-gray-900/50 border-2 border-orange-500 text-white rounded-lg py-2 px-3 focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-400 w-full"
            >
              <option value="all" className="bg-gray-900 text-white">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat} className="bg-gray-900 text-white">{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-white font-medium mt-4">
          Showing <strong>{filteredAssets.length}</strong> of <strong>{assets.length}</strong> assets
        </div>
      </Card>

      {/* Table */}
      {isLoading ? (
        <LoadingSpinner />
      ) : filteredAssets.length > 0 ? (
        <Table columns={columns} data={filteredAssets} />
      ) : (
        <EmptyState 
          icon="📭"
          title="No Assets Found"
          subtitle={searchTerm ? "Try adjusting your filters" : "Start by adding new assets"}
        />
      )}
    </div>
  );
}
