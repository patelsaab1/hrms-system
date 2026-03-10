const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json", ...(options.headers || {}) },
    ...options,
  });
  const isJson = (res.headers.get("content-type") || "").includes("application/json");
  const data = isJson ? await res.json() : null;
  if (!res.ok) {
    const message = data?.message || `Request failed (${res.status})`;
    const error = new Error(message);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

export const api = {
  // Employees
  listEmployees: () => request("/employees"),
  getEmployee: (id) => request(`/employees/${id}`),
  createEmployee: (payload) =>
    request("/employees", { method: "POST", body: JSON.stringify(payload) }),
  deleteEmployee: (id) => request(`/employees/${id}`, { method: "DELETE" }),

  // Attendance
  markAttendance: (payload) =>
    request("/attendance", { method: "POST", body: JSON.stringify(payload) }),
  listAttendance: (employeeId) =>
    request(`/attendance?employeeId=${encodeURIComponent(employeeId)}`),

  // Events
  createEvent: (payload) =>
    request("/events", { method: "POST", body: JSON.stringify(payload) }),
  listEvents: (employeeId) => request(`/events/${employeeId}`),
  updateEvent: (id, payload) =>
    request(`/events/${id}`, { method: "PUT", body: JSON.stringify(payload) }),
  deleteEvent: (id) => request(`/events/${id}`, { method: "DELETE" }),
};

