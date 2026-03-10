import { useEffect, useState } from "react";
import { api } from "../services/api.js";

export default function AttendanceList({ employeeId }) {
  const [records, setRecords] = useState([]);
  const [presentDays, setPresentDays] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!employeeId) return;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await api.listAttendance(employeeId);
        setRecords(data.records);
        setPresentDays(data.presentDays);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [employeeId]);

  if (!employeeId) return <div className="card">Select an employee to view attendance</div>;
  if (loading) return <div className="card">Loading attendance...</div>;
  if (error) return <div className="card alert error">Error: {error}</div>;
  if (!records.length) return <div className="card">No attendance yet</div>;

  return (
    <div className="card">
      <h3>Attendance</h3>
      <div className="muted">Total present days: {presentDays}</div>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr key={r._id}>
                <td>{new Date(r.date).toISOString().slice(0, 10)}</td>
                <td>{r.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

