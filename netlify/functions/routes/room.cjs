const express = require("express");
const router = express.Router();
const Room = require("../models/room.cjs");

// Create a new room
router.post("/", async (req, res) => {
  try {
    const room = new Room(req.body);
    await room.save();
    res.status(201).send(room);
  } catch (error) {
    res.status(400).send({ message: "Error creating room" });
  }
});

// Get all rooms
router.get("/", async (req, res) => {
  try {
    // const rooms = await Room.find().populate("schedules");
    const rooms = await Room.find();
    res.send(rooms);
  } catch (error) {
    res.status(400).send({ message: "Error getting rooms" });
  }
});

// Get a room by ID
router.get("/:id", async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("schedules");
    if (!room) {
      res.status(404).send({ message: "Room not found" });
    } else {
      res.send(room);
    }
  } catch (error) {
    res.status(400).send({ message: "Error getting room" });
  }
});

// Update a room
router.patch("/:id", async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!room) {
      res.status(404).send({ message: "Room not found" });
    } else {
      res.send(room);
    }
  } catch (error) {
    res.status(400).send({ message: "Error updating room" });
  }
});

// Delete a room
router.delete("/:id", async (req, res) => {
  try {
    await Room.findByIdAndDelete(req.params.id);
    res.send({ message: "Room deleted" });
  } catch (error) {
    res.status(400).send({ message: "Error deleting room" });
  }
});

module.exports = router;
