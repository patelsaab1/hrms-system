import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function EmployeeList({ refreshToken }) {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      const data = await api.listEmployees();
      setEmployees(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refreshToken]);

  async function remove(id) {
    const ok = confirm("Delete this employee? Attendance records will be removed.");
    if (!ok) return;
    try {
      await api.deleteEmployee(id);
      setEmployees((list) => list.filter((e) => e._id !== id));
    } catch (err) {
      alert(err.message);
    }
  }

  if (loading) return <div className="card">Loading employees...</div>;
  if (error) return <div className="card alert error">Error: {error}</div>;
  if (!employees.length) return <div className="card">No employees yet</div>;

  return (
    <div className="card">
      <h3>Employees</h3>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Employee ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Department</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((e) => (
              <tr key={e._id}>
                <td>{e.employeeId}</td>
                <td>
                  <Link to={`/employees/${e._id}`} style={{ fontWeight: 500, color: "var(--primary)" }}>
                    {e.fullName}
                  </Link>
                </td>
                <td>{e.email}</td>
                <td>{e.department}</td>
                <td>
                  <Link to={`/employees/${e._id}`} className="btn-secondary" style={{ marginRight: "0.5rem" }}>
                    View
                  </Link>
                  <button onClick={() => remove(e._id)} className="btn-danger">
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

