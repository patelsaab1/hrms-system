import { useState } from "react";
import AttendanceForm from "../components/AttendanceForm.jsx";
import AttendanceList from "../components/AttendanceList.jsx";

export default function Attendance() {
  const [employeeId, setEmployeeId] = useState("");
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Attendance Tracking</h1>
        <p className="page-subtitle">Monitor employee attendance records</p>
      </div>
      
      <AttendanceForm onMarked={(id) => setEmployeeId(id)} />
      <AttendanceList employeeId={employeeId} />
    </div>
  );
}
