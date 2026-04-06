const mongoose = require("mongoose");

const shiftSchema = new mongoose.Schema(
  {
    waiterName: {
      type: String,
      required: true,
      trim: true
    },
    clockInAt: {
      type: Date,
      required: true
    },
    clockOutAt: Date,
    durationMinutes: Number
  },
  { timestamps: true }
);

module.exports = mongoose.model("Shift", shiftSchema);
