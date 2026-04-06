const Shift = require("../models/Shift");

exports.clockIn = async (req, res) => {
  const waiterName = req.body.waiterName?.trim();

  if (!waiterName) {
    return res.status(400).json({ message: "waiterName is required" });
  }

  const activeShift = await Shift.findOne({ waiterName, clockOutAt: null });
  if (activeShift) {
    return res
      .status(400)
      .json({ message: "Waiter already has an active shift" });
  }

  const shift = await Shift.create({
    waiterName,
    clockInAt: new Date()
  });

  res.json(shift);
};

exports.clockOut = async (req, res) => {
  const { id } = req.params;
  const shift = await Shift.findById(id);

  if (!shift) {
    return res.status(404).json({ message: "Shift not found" });
  }

  if (shift.clockOutAt) {
    return res.status(400).json({ message: "Shift already closed" });
  }

  const now = new Date();
  const durationMinutes = Math.max(
    1,
    Math.round((now - shift.clockInAt) / (1000 * 60))
  );

  shift.clockOutAt = now;
  shift.durationMinutes = durationMinutes;
  await shift.save();

  res.json(shift);
};

exports.getShifts = async (req, res) => {
  const shifts = await Shift.find().sort({ createdAt: -1 }).limit(50);
  res.json(shifts);
};
