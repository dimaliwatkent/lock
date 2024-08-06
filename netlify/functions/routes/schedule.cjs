const express = require("express");
const router = express.Router();
const Schedule = require("../models/schedule.cjs");
const Room = require("../models/room.cjs");
const room = require("../models/room.cjs");

router.post("/:roomId/check-time", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { day, timeIn, timeOut } = req.body;
    const time = [{ day, timeIn, timeOut }];
    const existingSchedules = await Schedule.find({
      room: roomId,
      $or: time.map((timeSlot) => ({
        "time.day": timeSlot.day,
        $and: [
          { "time.timeIn": { $lt: timeSlot.timeOut } },
          { "time.timeOut": { $gt: timeSlot.timeIn } },
        ],
      })),
    });

    if (existingSchedules.length > 0) {
      return res.status(200).send({ message: "Time slot is already booked" });
    }

    res.status(200).send({ message: "Time slot is available" });
  } catch (error) {
    res.status(400).send({ message: "Error checking time slot" });
  }
});

router.post("/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const { title, type, date, time } = req.body;
    const existingSchedules = await Schedule.find({
      room: roomId,
      $or: time.map((timeSlot) => ({
        "time.day": timeSlot.day,
        $and: [
          { "time.timeIn": { $lt: timeSlot.timeOut } },
          { "time.timeOut": { $gt: timeSlot.timeIn } },
        ],
      })),
    });

    if (existingSchedules.length > 0) {
      return res.status(400).send({ message: "Time slot is already booked" });
    }

    const schedule = new Schedule({ title, type, date, time, room: roomId });

    // Find the room and update its schedules array
    const roomToUpdate = await Room.findById(roomId);
    if (!roomToUpdate) {
      return res.status(404).send({ message: "Room not found" });
    }
    roomToUpdate.schedules.push(schedule._id);
    await roomToUpdate.save();

    await schedule.save();

    res.status(201).send(schedule);
  } catch (error) {
    res.status(400).send({ message: "Error creating schedule" });
  }
});
// Get schedules for a specific room
router.get("/:roomId", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const schedules = await Schedule.find({ room: roomId });
    res.send(schedules);
  } catch (error) {
    res.status(400).send({ message: "Error getting schedules" });
  }
});

// Get a schedule by ID
router.get("/:roomId/:id", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const scheduleId = req.params.id;
    const schedule = await Schedule.findOne({
      room: roomId,
      _id: scheduleId,
    }).populate("room");
    if (!schedule) {
      res.status(404).send({ message: "Schedule not found" });
    } else {
      res.send(schedule);
    }
  } catch (error) {
    res.status(400).send({ message: "Error getting schedule" });
  }
});

router.patch("/:roomId/:id", async (req, res) => {
  try {
    const { roomId, id: scheduleId } = req.params;
    const { title, type, date, time } = req.body;

    console.log(req.body);
    console.log(roomId);
    console.log(scheduleId);

    const existingSchedules = await Schedule.find({
      room: roomId,
      $or: time.map((timeSlot) => ({
        "time.day": timeSlot.day,
        $and: [
          { "time.timeIn": { $lt: timeSlot.timeOut } },
          { "time.timeOut": { $gt: timeSlot.timeIn } },
        ],
      })),
      _id: { $ne: scheduleId },
    });

    if (existingSchedules.length > 0) {
      return res.status(400).send({ message: "Time slot is already booked" });
    }

    const schedule = await Schedule.findOneAndUpdate(
      { room: roomId, _id: scheduleId },
      { title, type, date, time },
      { new: true },
    );

    if (!schedule) {
      return res.status(404).send({ message: "Schedule not found" });
    }

    res.send(schedule);
  } catch (error) {
    res.status(400).send({ message: "Error updating schedule" });
  }
});

// Delete a schedule
router.delete("/:roomId/:id", async (req, res) => {
  try {
    const roomId = req.params.roomId;
    const scheduleId = req.params.id;
    await Schedule.findOneAndDelete({ room: roomId, _id: scheduleId });
    await Room.findByIdAndUpdate(roomId, { $pull: { schedules: scheduleId } });
    res.send({ message: "Schedule deleted" });
  } catch (error) {
    res.status(400).send({ message: "Error deleting schedule" });
  }
});

module.exports = router;
