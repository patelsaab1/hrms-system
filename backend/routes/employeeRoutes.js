import express from "express";

import { createEmployee, deleteEmployee, getEmployee, listEmployees } from "../controllers/employeeController.js";

const router = express.Router();

router.get("/", listEmployees);
router.get("/:id", getEmployee);
router.post("/", createEmployee);
router.delete("/:id", deleteEmployee);

export default router;

