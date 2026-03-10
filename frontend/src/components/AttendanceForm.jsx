import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function AttendanceForm({ onMarked }) {
  const [employees, setEmployees] = useState([]);
  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [form, setForm] = useState({ employeeId: "", date: "", status: "Present" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const list = await api.listEmployees();
        setEmployees(list);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingEmployees(false);
      }
    })();
  }, []);

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
      await api.markAttendance(form);
      setSuccess("Attendance marked");
      onMarked?.(form.employeeId);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="card">
      <h3>Mark Attendance</h3>
      {error && <div className="alert error">{error}</div>}
      {success && <div className="alert success">{success}</div>}
      <div className="form-grid">
        <label>
          Employee
          <select name="employeeId" value={form.employeeId} onChange={updateField} required>
            <option value="">Select employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>
                {e.fullName} ({e.employeeId})
              </option>
            ))}
          </select>
        </label>
        <label>
          Date
          <input type="date" name="date" value={form.date} onChange={updateField} required />
        </label>
        <label>
          Status
          <select name="status" value={form.status} onChange={updateField}>
            <option>Present</option>
            <option>Absent</option>
          </select>
        </label>
      </div>
      <button type="submit" className="btn-primary" disabled={loading || loadingEmployees}>
        {loading ? "Saving..." : "Mark Attendance"}
      </button>
    </form>
  );
}

