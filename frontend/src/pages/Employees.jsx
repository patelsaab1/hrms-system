import { useState } from "react";
import EmployeeForm from "../components/EmployeeForm.jsx";
import EmployeeList from "../components/EmployeeList.jsx";

export default function Employees() {
  const [refreshToken, setRefreshToken] = useState(0);
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Employee Management</h1>
        <p className="page-subtitle">Manage your organization's workforce</p>
      </div>
      
      <EmployeeForm onCreated={() => setRefreshToken((x) => x + 1)} />
      <EmployeeList refreshToken={refreshToken} />
    </div>
  );
}
