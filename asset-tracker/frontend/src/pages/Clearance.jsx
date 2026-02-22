import { useState, useEffect } from "react";
import { checkClearance, approveClearance, fetchEmployees } from "../api/api";
import { Button, Card, Input, Alert, Badge, LoadingSpinner } from "../components";

export default function Clearance() {
  const [emp, setEmp] = useState("");
  const [employees, setEmployees] = useState([]);
  const [result, setResult] = useState(null);
  const [secret, setSecret] = useState("");
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    fetchEmployees().then(setEmployees).catch(() => setEmployees([]));
  }, []);

  async function check() {
    if (!emp.trim()) {
      setMsg("Please enter an employee ID");
      setMsgType("warning");
      return;
    }

    setIsLoading(true);
    try {
      const res = await checkClearance(emp);
      setResult(res);
      setMsg("");
      setSecret("");
    } catch (error) {
      setMsg("Employee not found");
      setMsgType("danger");
      setResult(null);
    }
    setIsLoading(false);
  }

  async function approve() {
    if (!secret.trim()) {
      setMsg("Please enter admin secret");
      setMsgType("warning");
      return;
    }

    setIsApproving(true);
    try {
      const res = await approveClearance(emp, secret);
      setMsg(res.message || res.detail);
      setMsgType(res.message ? "success" : "danger");
      if (res.message) {
        setEmp("");
        setSecret("");
        setResult(null);
      }
    } catch (error) {
      setMsg("Error approving clearance");
      setMsgType("danger");
    }
    setIsApproving(false);
  }

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-gray-800 mb-2">Employee Exit Clearance</h2>
        <p className="text-gray-600">Manage employee exit clearance and asset returns</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Check Clearance */}
        <Card className="lg:col-span-2">
          <h3 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-2">
            <span className="bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">1</span>
            Check Clearance
          </h3>

          <div className="mb-6 space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">👤 Employee ID</label>
              <input
                type="text"
                placeholder="Type or select employee ID..."
                value={emp}
                onChange={e => setEmp(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && check()}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Or select from list</label>
              <select
                onChange={e => {
                  if (e.target.value) {
                    setEmp(e.target.value);
                  }
                }}
                value=""
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
              >
                <option value="">-- Select an employee --</option>
                {employees.map(employee => (
                  <option key={employee.employee_id} value={employee.employee_id}>
                    {employee.employee_id} - {employee.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <Button 
            variant="primary"
            onClick={check}
            isLoading={isLoading}
            className="w-full mt-6 bg-gradient-to-r from-blue-500 via-blue-400 to-blue-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border-none px-5 py-2 text-base"
            icon="🔍"
            size="md"
          >
            Check Clearance Status
          </Button>

          {/* Result Section */}
          {result && (
            <div className="mt-8 space-y-6">
              {/* Clearance Status */}
              <div className={`rounded-xl p-6 border-l-4 ${
                result.clearance 
                  ? "bg-green-50 border-green-600" 
                  : "bg-red-50 border-red-600"
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-xl font-semibold text-gray-800">Clearance Status</h4>
                  <Badge variant={result.clearance ? "success" : "danger"}>
                    {result.clearance ? "✅ Approved" : "❌ Blocked"}
                  </Badge>
                </div>
              </div>
              {/* Pending Assets */}
              {result.assets && result.assets.length > 0 && (
                <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-600">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span>⚠️</span> Pending Assets ({result.assets.length})
                  </h4>
                  <div className="space-y-2">
                    {result.assets.map(assetCode => (
                      <div 
                        key={assetCode} 
                        className="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-200"
                      >
                        <span className="text-yellow-600 text-lg">📦</span>
                        <span className="font-semibold text-gray-800">{assetCode}</span>
                        <Badge variant="warning">To Return</Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Approval Section */}
              {result.clearance && (
                <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 border-l-4 border-green-600">
                  <h4 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <span className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm">2</span>
                    Final Approval
                  </h4>

                  <Input
                    label="🔐 Admin Secret"
                    type="password"
                    placeholder="Enter admin secret to confirm"
                    value={secret}
                    onChange={e => setSecret(e.target.value)}
                    icon="🔒"
                    onKeyPress={(e) => e.key === "Enter" && approve()}
                  />

                  <Button 
                    variant="success"
                    onClick={approve}
                    isLoading={isApproving}
                    className="w-full mt-4"
                    size="lg"
                    icon="✅"
                  >
                    Approve Exit Clearance
                  </Button>
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Info Panel */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <span>ℹ️</span> About Exit Clearance
          </h3>

          <div className="space-y-4">
            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-sm">What is this?</p>
              <p className="text-sm text-gray-600 mt-2">
                Exit clearance ensures employees have returned or accounted for all assigned assets before leaving the company.
              </p>
            </div>

            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-sm">Process</p>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>✓ Employee returns all assets</li>
                <li>✓ System confirms all items accounted for</li>
                <li>✓ Admin approves clearance</li>
                <li>✓ Employee can exit</li>
              </ul>
            </div>

            <div className="bg-white rounded-lg p-3">
              <p className="font-semibold text-gray-800 text-sm">Status Meanings</p>
              <div className="text-sm text-gray-600 mt-2 space-y-1">
                <div className="flex items-center gap-2">
                  <Badge variant="success">Approved</Badge>
                  <span>All clear to proceed</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="danger">Blocked</Badge>
                  <span>Assets pending return</span>
                </div>
              </div>
            </div>
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
