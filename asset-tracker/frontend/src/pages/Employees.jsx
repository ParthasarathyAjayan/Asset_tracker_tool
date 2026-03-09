import { useEffect, useState } from "react";
import {
  fetchEmployees,
  addEmployee,
  deactivateEmployee,
  checkEmployeeAssets,
} from "../api/api";
import { Button, Card, Input, Table, Alert, Modal } from "../components";

export default function Employees() {
  const [employees, setEmployees] = useState([]);
  const [employeeAssets, setEmployeeAssets] = useState({});
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("info");
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  function load() {
    fetchEmployees().then(setEmployees);
  }

  useEffect(load, []);

  // Load asset counts for all employees
  useEffect(() => {
    if (employees.length > 0) {
      employees.forEach(emp => {
        checkEmployeeAssets(emp.employee_id).then(data => {
          setEmployeeAssets(prev => ({
            ...prev,
            [emp.employee_id]: data.active_assets || 0
          }));
        }).catch(() => {
          setEmployeeAssets(prev => ({
            ...prev,
            [emp.employee_id]: 0
          }));
        });
      });
    }
  }, [employees]);

  function update(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function save() {
    setIsLoading(true);
    try {
      const res = await addEmployee(form);
      setMsg(res.message || res.detail);
      setMsgType(res.message ? "success" : "danger");
      if (res.message) {
        setForm({});
        setShowModal(false);
        load();
      }
    } catch (error) {
      setMsg("Error adding employee");
      setMsgType("danger");
    }
    setIsLoading(false);
  }

  async function deactivate(id) {
    try {
      // Check if employee has active assets
      const assetData = await checkEmployeeAssets(id);
      const activeAssetCount = assetData.active_assets || 0;

      if (activeAssetCount > 0) {
        setMsg(`Cannot deactivate ${id}. This employee owns ${activeAssetCount} active asset(s). Please reassign or return these assets first.`);
        setMsgType("warning");
        return;
      }

      if (confirm("Are you sure you want to deactivate this employee?")) {
        await deactivateEmployee(id);
        load();
        setMsg("Employee deactivated successfully");
        setMsgType("success");
      }
    } catch (error) {
      setMsg("Error checking employee assets");
      setMsgType("danger");
    }
  }

  const filteredEmployees = employees.filter(e =>
    searchTerm === "" ||
    e.employee_id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    e.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const columns = [
    { 
      key: "employee_id", 
      label: "Employee ID",
      render: (value) => <span className="font-semibold text-blue-600">{value}</span>
    },
    { key: "name", label: "Name" },
    { 
      key: "email", 
      label: "Email",
      render: (value) => <span className="text-sm text-white font-medium">{value}</span>
    },
    { key: "location", label: "Location" },
  ];

  return (
    <div className="page">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Employees</h2>
        <p className="text-white font-medium">Manage your company's employees and their profiles</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">Total Employees</p>
              <p className="text-3xl font-bold text-orange-400">{employees.length}</p>
            </div>
            <span className="text-4xl">👥</span>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white text-sm font-bold">Locations</p>
              <p className="text-3xl font-bold text-orange-400">
                {new Set(employees.map(e => e.location)).size}
              </p>
            </div>
            <span className="text-4xl">📍</span>
          </div>
        </Card>
      </div>

      {/* Add Button */}
      <div className="mb-8">
        <Button 
          variant="primary"
          onClick={() => setShowModal(true)}
          icon="➕"
          className="bg-gradient-to-r from-orange-600 via-orange-500 to-red-600 text-white font-bold rounded-full shadow-lg hover:scale-105 transition-transform duration-200 border border-orange-400/50"
        >
          Add New Employee
        </Button>
      </div>

      {/* Search */}
      <Card className="mb-8 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
        <Input 
          label="🔍 Search Employees"
          placeholder="By ID, name, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </Card>

      {/* Employees Table */}
      {filteredEmployees.length > 0 ? (
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gradient-to-r from-orange-600 to-red-600 border-b-2 border-orange-500">
                  {columns.map(col => (
                    <th key={col.key} className="px-6 py-3 text-left text-white font-bold">{col.label}</th>
                  ))}
                  <th className="px-6 py-3 text-left text-white font-bold">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map(e => (
                  <tr key={e.employee_id} className="hover:bg-orange-500/10 transition-colors border-t border-gray-700">
                    {columns.map(col => (
                      <td key={col.key} className="px-6 py-4 text-white font-medium">
                        {col.render ? col.render(e[col.key], e) : e[col.key]}
                      </td>
                    ))}
                    <td className="px-6 py-4">
                      {employeeAssets[e.employee_id] > 0 ? (
                        <div className="flex items-center gap-2">
                          <Button 
                            size="sm"
                            variant="secondary"
                            disabled={true}
                            title={`Employee owns ${employeeAssets[e.employee_id]} asset(s)`}
                            className="bg-orange-600/40 text-orange-200 border-2 border-orange-500"
                          >
                            Deactivate
                          </Button>
                          <span className="text-xs text-orange-400 font-bold">
                            ({employeeAssets[e.employee_id]} asset{employeeAssets[e.employee_id] > 1 ? 's' : ''})
                          </span>
                        </div>
                      ) : (
                        <Button 
                          size="sm"
                          variant="primary"
                          onClick={() => deactivate(e.employee_id)}
                          className="bg-red-600/80 hover:bg-red-500 text-white font-bold border border-red-500/50"
                        >
                          Deactivate
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-white font-medium mt-4">
            Showing <strong className="text-white">{filteredEmployees.length}</strong> of <strong className="text-white">{employees.length}</strong> employees
          </p>
        </Card>
      ) : (
        <Card className="text-center py-12 bg-gradient-to-br from-gray-900 to-gray-800 border-2 border-orange-500">
          <p className="text-4xl mb-4">👤</p>
          <p className="text-white font-medium">No employees found. Add your first employee to get started!</p>
        </Card>
      )}}

      {/* Add Employee Modal */}
      <Modal 
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Add New Employee"
        actions={[
          { label: "Cancel", onClick: () => setShowModal(false), variant: "secondary" },
          { label: "Add Employee", onClick: save, variant: "success" },
        ]}
      >
        <Input
          name="employee_id"
          label="Employee ID *"
          placeholder="Unique employee ID"
          value={form.employee_id || ""}
          onChange={update}
          icon="🆔"
        />

        <Input
          name="name"
          label="Full Name *"
          placeholder="John Doe"
          value={form.name || ""}
          onChange={update}
          icon="👤"
        />

        <Input
          name="email"
          label="Email"
          type="email"
          placeholder="john.doe@company.com"
          value={form.email || ""}
          onChange={update}
          icon="✉️"
        />

        <Input
          name="location"
          label="Location"
          placeholder="Office location"
          value={form.location || ""}
          onChange={update}
          icon="📍"
        />
      </Modal>

      {/* Messages */}
      {msg && (
        <div className="fixed bottom-4 right-4 w-96 z-50">
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
