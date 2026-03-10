import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";

import attendanceRoutes from "./routes/attendanceRoutes.js";
import employeeRoutes from "./routes/employeeRoutes.js";
import eventRoutes from "./routes/eventRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(morgan("dev"));

const allowedOrigin = process.env.FRONTEND_ORIGIN;
app.use(
  cors({
    origin: allowedOrigin ? [allowedOrigin] : true,
    credentials: true,
  })
);

app.get("/api/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/employees", employeeRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/events", eventRoutes);

app.use((_req, res) => {
  res.status(404).json({ message: "Route not found" });
});

app.use((err, _req, res, _next) => {
  const status = Number.isInteger(err?.status) ? err.status : 500;
  const message = err?.message || "Internal server error";
  res.status(status).json({ message });
});

const port = Number(process.env.PORT) || 5000;
const mongoUri = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/hrms";

await mongoose.connect(mongoUri);

app.listen(port, () => {
  console.log(`API running on http://localhost:${port}`);
});
