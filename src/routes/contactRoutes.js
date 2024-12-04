const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const Contact = require("../models/contact-schema");

const validateObjectId = (req, res, next) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "Invalid ID format" });
  }
  next();
};

router.get("/", async (req, res) => {
  try {
    if (!req.session.isAuth || !req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const idUser = req.session.user._id;
    const userMessages = await Contact.find({ idUser });

    res.status(200).json({ message: "Messages retrieved successfully", data: userMessages });
  } catch (err) {
    console.error("Error retrieving messages:", err);
    res.status(500).json({ error: "Error retrieving messages" });
  }
});

router.post("/", async (req, res) => {
  console.log("Request body:", req.body);
  console.log("Session data:", req.session);
  try {
    if (!req.session.isAuth || !req.session.user) {
      return res.status(401).json({ error: "User not authenticated" });
    }

    const { title, message } = req.body;
    const idUser = req.session.user._id;

    if (!title || title.length < 3 || title.length > 100) {
      return res.status(400).json({ error: "Title must be between 3 and 100 characters." });
    }

    if (!message || message.length < 3 || message.length > 500) {
      return res.status(400).json({ error: "Message must be between 3 and 500 characters." });
    }

    const newMessage = new Contact({ title, message, idUser });
    await newMessage.save();

    res.status(201).json({ message: "Message sent successfully", data: newMessage });
  } catch (err) {
    console.error("Error creating message:", err);
    res.status(500).json({ error: "Error creating message" });
  }
});

router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedMessage = await Contact.findByIdAndDelete(id);
    if (!deletedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message deleted successfully", data: deletedMessage });
  } catch (err) {
    console.error("Error deleting message:", err);
    res.status(500).json({ error: "Error deleting message" });
  }
});

router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;

    if (!message || message.length < 3 || message.length > 500) {
      return res.status(400).json({ error: "Message must be between 3 and 500 characters." });
    }

    const updatedMessage = await Contact.findByIdAndUpdate(id, { message }, { new: true });

    if (!updatedMessage) {
      return res.status(404).json({ error: "Message not found" });
    }

    res.json({ message: "Message updated successfully", data: updatedMessage });
  } catch (err) {
    console.error("Error updating message:", err);
    res.status(500).json({ error: "Error updating message" });
  }
});

module.exports = router;