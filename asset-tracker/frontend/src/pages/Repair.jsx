import { useEffect, useState } from "react";
import { fetchRepairList } from "../api/api";
import { Card, Badge, LoadingSpinner, EmptyState } from "../components";

export default function Repair() {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setIsLoading(true);
    fetchRepairList().then(data => {
      setItems(data || []);
      setIsLoading(false);
    });
  }, []);

  if (isLoading) {
    return (
      <div className="page">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Repair List</h2>
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Repair List</h2>
        <p className="text-gray-600">Track all assets currently in repair</p>
      </div>

      {/* Stats */}
      <Card className="mb-8 bg-gradient-to-r from-orange-50 to-red-50">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-600 text-sm">Total in Repair</p>
            <p className="text-3xl font-bold text-orange-600">{items.length}</p>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Status</p>
            <Badge variant="warning">In Progress</Badge>
          </div>
          <div>
            <p className="text-gray-600 text-sm">Last Updated</p>
            <p className="text-sm text-gray-700">{new Date().toLocaleDateString()}</p>
          </div>
        </div>
      </Card>

      {/* Repair Items */}
      {items.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {items.map(a => (
            <Card key={a.asset_code} className="border-l-4 border-orange-500">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{a.asset_code}</h3>
                  <p className="text-sm text-gray-600 mt-1">Asset Code</p>
                </div>
                <Badge variant="warning">🔧 In Repair</Badge>
              </div>

              <div className="space-y-3 bg-gray-50 rounded-lg p-4">
                <div>
                  <p className="text-sm font-semibold text-gray-700">Assigned Technician</p>
                  <p className="text-lg font-semibold text-gray-800 flex items-center gap-2 mt-1">
                    <span>👨‍🔧</span>
                    {a.name || "Unassigned"}
                  </p>
                </div>

                <div>
                  <p className="text-sm font-semibold text-gray-700">Repair Start Date</p>
                  <p className="text-gray-700 mt-1">
                    {a.repair_start_date 
                      ? new Date(a.repair_start_date).toLocaleDateString() 
                      : "Not specified"}
                  </p>
                </div>

                <div className="pt-2 border-t border-gray-200">
                  <p className="text-xs text-gray-600">
                    ⏱️ Days in repair: <strong>{
                      a.repair_start_date 
                        ? Math.floor((Date.now() - new Date(a.repair_start_date)) / (1000 * 60 * 60 * 24))
                        : "-"
                    }</strong>
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <EmptyState 
          icon="✨"
          title="No Items in Repair"
          subtitle="All assets are in good condition!"
        />
      )}
    </div>
  );
}
