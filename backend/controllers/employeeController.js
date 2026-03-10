import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";
import Event from "../models/Event.js";

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(email || "").trim());
}

async function generateEmployeeId() {
  const result = await Employee.aggregate([
    {
      $match: {
        employeeId: { $regex: /^EMP\d+$/ }
      }
    },
    {
      $project: {
        idNum: {
          $toInt: { $substrCP: ["$employeeId", 3, { $strLenCP: "$employeeId" }] }
        }
      }
    },
    { $sort: { idNum: -1 } },
    { $limit: 1 }
  ]);

  if (!result.length) {
    return "EMP0001";
  }

  const nextId = result[0].idNum + 1;
  return `EMP${String(nextId).padStart(4, "0")}`;
}

export async function createEmployee(req, res, next) {
  try {
    const { fullName, email, department } = req.body || {};

    if (!fullName || !email || !department) {
      return res.status(400).json({ message: "Full Name, Email and Department are required" });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const employeeId = await generateEmployeeId();

    const employee = await Employee.create({
      employeeId,
      fullName,
      email,
      department,
    });

    return res.status(201).json(employee);
  } catch (err) {
    if (err?.code === 11000) {
      const keys = Object.keys(err?.keyPattern || err?.keyValue || {});
      if (keys.includes("employeeId")) {
        return res.status(409).json({ message: "Employee ID already exists" });
      }
      if (keys.includes("email")) {
        return res.status(409).json({ message: "Email already exists" });
      }
      return res.status(409).json({ message: "Duplicate employee" });
    }
    return next(err);
  }
}

export async function listEmployees(_req, res, next) {
  try {
    const employees = await Employee.find().sort({ createdAt: -1 });
    return res.json(employees);
  } catch (err) {
    return next(err);
  }
}

export async function getEmployee(req, res, next) {
  try {
    const { id } = req.params;
    const employee = await Employee.findById(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    return res.json(employee);
  } catch (err) {
    return next(err);
  }
}

export async function deleteEmployee(req, res, next) {
  try {
    const { id } = req.params;

    const employee = await Employee.findByIdAndDelete(id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    await Attendance.deleteMany({ employee: employee._id });
    await Event.deleteMany({ employeeId: employee._id });

    return res.status(200).json({ message: "Employee deleted" });
  } catch (err) {
    return next(err);
  }
}

