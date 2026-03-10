import Event from "../models/Event.js";

async function createEvent(req, res) {
  try {
    const { employeeId, title, description, date, type } = req.body;
    const event = await Event.create({
      employeeId,
      title,
      description,
      date,
      type,
    });
    res.status(201).json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function getEventsByEmployee(req, res) {
  try {
    const { employeeId } = req.params;
    const events = await Event.find({ employeeId }).sort({ date: 1 });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

async function updateEvent(req, res) {
  try {
    const { id } = req.params;
    
    const result = await Event.updateOne({ _id: id }, req.body);
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    const event = await Event.findById(id);
    res.json(event);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
}

async function deleteEvent(req, res) {
  try {
    const { id } = req.params;
    
    const result = await Event.deleteOne({ _id: id });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json({ message: "Event deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

export { createEvent, getEventsByEmployee, updateEvent, deleteEvent };
