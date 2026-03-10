import express from "express";
import {
  createEvent,
  getEventsByEmployee,
  updateEvent,
  deleteEvent,
} from "../controllers/eventController.js";

const router = express.Router();

router.post("/", createEvent);
router.get("/:employeeId", getEventsByEmployee);
router.put("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
