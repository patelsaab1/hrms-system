import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { api } from "../services/api";

export default function EmployeeDetails() {
  const { id } = useParams();
  const [employee, setEmployee] = useState(null);
  const [events, setEvents] = useState([]);
  const [date, setDate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  // Form state
  const [taskForm, setTaskForm] = useState({ title: "", description: "", type: "Task" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const [empData, eventData] = await Promise.all([
        api.getEmployee(id),
        api.listEvents(id)
      ]);
      setEmployee(empData);
      setEvents(eventData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleAddEvent(e) {
    e.preventDefault();
    if (!taskForm.title) return;
    
    setSubmitting(true);
    try {
      const newEvent = await api.createEvent({
        ...taskForm,
        employeeId: id,
        date: date,
      });
      setEvents([...events, newEvent]);
      setTaskForm({ title: "", description: "", type: "Task" });
    } catch (err) {
      alert(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  async function toggleStatus(event) {
    try {
      const newStatus = event.status === "Pending" ? "Completed" : "Pending";
      const updated = await api.updateEvent(event._id, { status: newStatus });
      setEvents(events.map(e => e._id === updated._id ? updated : e));
    } catch (err) {
      alert(err.message);
    }
  }

  async function deleteEvent(eventId) {
    if (!confirm("Delete this event?")) return;
    try {
      await api.deleteEvent(eventId);
      setEvents(events.filter(e => e._id !== eventId));
    } catch (err) {
      alert(err.message);
    }
  }

  // Filter events for selected date
  const selectedDateEvents = events.filter(e => 
    new Date(e.date).toDateString() === date.toDateString()
  );

  if (loading) return <div className="card">Loading details...</div>;
  if (error) return <div className="card alert error">Error: {error}</div>;
  if (!employee) return <div className="card">Employee not found</div>;

  return (
    <div className="employee-details">
      <div className="page-header">
        <Link to="/" className="btn-back">← Back</Link>
        <h1 className="page-title">{employee.fullName}</h1>
        <p className="page-subtitle">{employee.employeeId} • {employee.department}</p>
      </div>

      <div className="details-grid">
        <div className="card calendar-section">
          <h3>Calendar</h3>
          <Calendar 
            onChange={setDate} 
            value={date} 
            tileContent={({ date, view }) => {
              if (view === 'month') {
                const dayEvents = events.filter(e => new Date(e.date).toDateString() === date.toDateString());
                return dayEvents.length > 0 ? <div className="dot-indicator"></div> : null;
              }
            }}
          />
        </div>

        <div className="card tasks-section">
          <h3>{date.toDateString()}</h3>
          
          <div className="events-list">
            {selectedDateEvents.length === 0 && <p className="muted">No events for this day.</p>}
            {selectedDateEvents.map(event => (
              <div key={event._id} className={`event-item ${event.status.toLowerCase()}`}>
                <div className="event-info">
                  <span className={`badge ${event.type.toLowerCase()}`}>{event.type}</span>
                  <strong>{event.title}</strong>
                  {event.description && <p>{event.description}</p>}
                </div>
                <div className="event-actions">
                  <button onClick={() => toggleStatus(event)} className="btn-sm">
                    {event.status === "Pending" ? "✓" : "↺"}
                  </button>
                  <button onClick={() => deleteEvent(event._id)} className="btn-sm btn-danger">×</button>
                </div>
              </div>
            ))}
          </div>

          <hr />

          <form onSubmit={handleAddEvent} className="add-event-form">
            <h4>Add Task / Event</h4>
            <div className="form-group">
              <input 
                type="text" 
                placeholder="Title" 
                value={taskForm.title}
                onChange={e => setTaskForm({...taskForm, title: e.target.value})}
                required
              />
            </div>
            <div className="form-group">
              <select 
                value={taskForm.type}
                onChange={e => setTaskForm({...taskForm, type: e.target.value})}
              >
                <option>Task</option>
                <option>Event</option>
              </select>
            </div>
            <div className="form-group">
              <textarea 
                placeholder="Description (optional)"
                value={taskForm.description}
                onChange={e => setTaskForm({...taskForm, description: e.target.value})}
              />
            </div>
            <button type="submit" disabled={submitting}>
              {submitting ? "Adding..." : "Add"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
