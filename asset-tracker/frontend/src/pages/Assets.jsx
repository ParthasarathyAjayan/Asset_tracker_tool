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
      render: (value) => <span className="font-semibold text-blue-600">{value}</span>
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
        <h2 className="text-4xl font-bold text-gray-800 mb-2">All Assets</h2>
        <p className="text-gray-600">View and manage all IT assets in the system</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Assets</p>
              <p className="text-3xl font-bold text-blue-600">{assets.length}</p>
            </div>
            <span className="text-4xl">📦</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Assigned</p>
              <p className="text-3xl font-bold text-green-600">
                {assets.filter(a => a.status === "assigned").length}
              </p>
            </div>
            <span className="text-4xl">✓</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Available</p>
              <p className="text-3xl font-bold text-purple-600">
                {assets.filter(a => a.status === "instock").length}
              </p>
            </div>
            <span className="text-4xl">📌</span>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">In Repair</p>
              <p className="text-3xl font-bold text-orange-600">
                {assets.filter(a => a.status === "repair").length}
              </p>
            </div>
            <span className="text-4xl">🔧</span>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-8 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="form-label">🔍 Search</label>
            <input 
              type="text"
              placeholder="Code, model, brand..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-base"
            />
          </div>

          <div>
            <label className="form-label">Status</label>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="input-base"
            >
              <option value="all">All Status</option>
              <option value="assigned">Assigned</option>
              <option value="instock">Available</option>
              <option value="repair">In Repair</option>
              <option value="missing">Missing</option>
            </select>
          </div>

          <div>
            <label className="form-label">Category</label>
            <select 
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="input-base"
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 mt-4">
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
