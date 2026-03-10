import express from "express";

import { listAttendance, markAttendance } from "../controllers/attendanceController.js";

const router = express.Router();

router.get("/", listAttendance);
router.post("/", markAttendance);

export default router;

