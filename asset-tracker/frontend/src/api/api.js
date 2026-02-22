const BASE_URL = "http://127.0.0.1:8000";

export async function fetchCategories() {
  const res = await fetch(`${BASE_URL}/categories`);
  return res.json();
}

export async function checkDuplicateCategory(name) {
  const res = await fetch(
    `${BASE_URL}/categories/check-duplicate?name=${encodeURIComponent(name)}`,
    { method: "POST" }
  );
  return res.json();
}

export async function addCategory(name) {
  const res = await fetch(
    `${BASE_URL}/categories/add?name=${encodeURIComponent(name)}`,
    { method: "POST" }
  );
  return res.json();
}

export async function fetchAsset(code) {
  const res = await fetch(`${BASE_URL}/assets/${code}`);
  if (!res.ok) throw new Error("Asset not found");
  return res.json();
}

export async function assignAsset(code, employeeId) {
  const res = await fetch(
    `${BASE_URL}/assign?asset_code=${code}&employee_id=${employeeId}`,
    { method: "POST" }
  );

  return res.json();
}

export async function addAsset(data) {
  const params = new URLSearchParams(data).toString();

  const res = await fetch(
    `${BASE_URL}/assets/add?${params}`,
    { method: "POST" }
  );

  return res.json();
}

export async function fetchAssets() {
  const res = await fetch(`${BASE_URL}/assets`);
  return res.json();
}

export async function fetchAssetCount() {
  const res = await fetch(`${BASE_URL}/assets/count`);
  const data = await res.json();
  return data.count || 0;
}

export async function returnAsset(code, comments = "") {
  const res = await fetch(
    `${BASE_URL}/return?asset_code=${code}&remarks=${encodeURIComponent(comments)}`,
    { method: "POST" }
  );
  return res.json();
}

export async function sendToRepair(code, emp, comments = "") {
  const res = await fetch(
    `${BASE_URL}/repair?asset_code=${code}&repair_employee_id=${emp}&remarks=${encodeURIComponent(comments)}`,
    { method: "POST" }
  );
  return res.json();
}

export async function markMissing(code, comments = "") {
  const res = await fetch(
    `${BASE_URL}/missing?asset_code=${code}&remarks=${encodeURIComponent(comments)}`,
    { method: "POST" }
  );
  return res.json();
}

export async function retireAsset(code, secret, comments = "") {
  const res = await fetch(
    `${BASE_URL}/retire?asset_code=${code}&secret=${secret}&remarks=${encodeURIComponent(comments)}`,
    { method: "POST" }
  );
  return res.json();
}

export async function checkClearance(empId) {
  const res = await fetch(`${BASE_URL}/exit-clearance/${empId}`);
  return res.json();
}

export async function approveClearance(empId, secret) {
  const res = await fetch(
    `${BASE_URL}/exit-clearance/approve?employee_id=${empId}&secret=${secret}`,
    { method: "POST" }
  );

  return res.json();
}

export async function fetchRepairList() {
  const res = await fetch(`${BASE_URL}/repair/list`);
  return res.json();
}

export async function addEmployee(data) {
  const params = new URLSearchParams(data).toString();
  const res = await fetch(
    `${BASE_URL}/employees/add?${params}`,
    { method: "POST" }
  );
  return res.json();
}

export async function deactivateEmployee(id) {
  const res = await fetch(
    `${BASE_URL}/employees/deactivate?employee_id=${id}`,
    { method: "POST" }
  );
  return res.json();
}

export async function checkEmployeeAssets(employeeId) {
  const res = await fetch(`${BASE_URL}/employees/${employeeId}/assets`);
  return res.json();
}

export async function fetchEmployees() {
  const res = await fetch(`${BASE_URL}/employees`);
  return res.json();
}


