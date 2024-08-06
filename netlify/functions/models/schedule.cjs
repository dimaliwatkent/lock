const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
    },
    type: {
      type: String,
      enum: ["regular", "exception"],
      required: true,
    },
    date: {
      type: Date,
    },
    time: [
      {
        day: {
          type: String,
          enum: [
            "monday",
            "tuesday",
            "wednesday",
            "thursday",
            "friday",
            "saturday",
            "sunday",
          ],
        },
        timeIn: {
          type: String,
          required: true,
        },
        timeOut: {
          type: String,
          required: true,
        },
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Schedule", scheduleSchema);
