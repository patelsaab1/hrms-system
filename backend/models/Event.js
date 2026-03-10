import mongoose from "mongoose";

const eventSchema = new mongoose.Schema({
  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Employee",
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  date: {
    type: Date,
    required: true,
  },
  type: {
    type: String,
    enum: ["Task", "Event"],
    default: "Event",
  },
  status: {
    type: String,
    enum: ["Pending", "Completed"],
    default: "Pending",
  },
}, { timestamps: true });

export default mongoose.model("Event", eventSchema);
