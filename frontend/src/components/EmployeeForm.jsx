import { useState } from "react";
import { api } from "../services/api.js";

export default function EmployeeForm({ onCreated }) {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    department: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function updateField(e) {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  }

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    try {
      await api.createEmployee(form);
      setSuccess("Employee added");
      setForm({ fullName: "", email: "", department: "" });
      onCreated?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Add Employee</h3>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="form-grid">
        <label>
          Full Name
          <input
            name="fullName"
            value={form.fullName}
            onChange={updateField}
            placeholder="John Doe"
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={updateField}
            placeholder="john@company.com"
            required
          />
        </label>
        <label>
          Department
          <input
            name="department"
            value={form.department}
            onChange={updateField}
            placeholder="Engineering"
            required
          />
        </label>
      </div>
      <button type="submit" className="btn-primary" disabled={loading}>
        {loading ? "Saving..." : "Add Employee"}
      </button>
    </form>
  );
}

