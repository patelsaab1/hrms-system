import { Link, Route, Routes, useLocation } from "react-router-dom";
import Attendance from "./pages/Attendance.jsx";
import EmployeeDetails from "./pages/EmployeeDetails.jsx";
import Employees from "./pages/Employees.jsx";

function NavItem({ to, label, icon }) {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link to={to} className={`nav-item ${active ? "active" : ""}`}>
      {icon && <span className="icon">{icon}</span>}
      {label}
    </Link>
  );
}

export default function App() {
  return (
    <div className="app-container">
      <aside className="sidebar">
        <div className="brand">
          <span>HRMS Lite</span>
        </div>
        <nav className="nav-links">
          <NavItem to="/" label="Employees" icon="👥" />
          <NavItem to="/attendance" label="Attendance" icon="📅" />
        </nav>
      </aside>
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Employees />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/employees/:id" element={<EmployeeDetails />} />
        </Routes>
        
      </main>
    </div>
  );
}
