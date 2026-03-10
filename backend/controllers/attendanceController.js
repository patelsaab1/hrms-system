import Attendance from "../models/Attendance.js";
import Employee from "../models/Employee.js";

function normalizeDate(dateStr) {
  if (typeof dateStr !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return null;
  }
  const date = new Date(`${dateStr}T00:00:00.000Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

export async function markAttendance(req, res, next) {
  try {
    const { employeeId, date, status } = req.body || {};

    if (!employeeId || !date || !status) {
      return res.status(400).json({ message: "employeeId, date and status are required" });
    }

    if (!["Present", "Absent"].includes(status)) {
      return res.status(400).json({ message: "Status must be Present or Absent" });
    }

    const normalizedDate = normalizeDate(date);
    if (!normalizedDate) {
      return res.status(400).json({ message: "Date must be in YYYY-MM-DD format" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const attendance = await Attendance.findOneAndUpdate(
      { employee: employee._id, date: normalizedDate },
      { $set: { status } },
      { new: true, upsert: true, runValidators: true }
    );

    return res.status(200).json(attendance);
  } catch (err) {
    return next(err);
  }
}

export async function listAttendance(req, res, next) {
  try {
    const { employeeId } = req.query || {};
    if (!employeeId) {
      return res.status(400).json({ message: "employeeId query param is required" });
    }

    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    const records = await Attendance.find({ employee: employee._id })
      .sort({ date: -1 })
      .lean();

    const presentDays = records.reduce((count, r) => count + (r.status === "Present" ? 1 : 0), 0);

    return res.json({ employee, records, presentDays });
  } catch (err) {
    return next(err);
  }
}

