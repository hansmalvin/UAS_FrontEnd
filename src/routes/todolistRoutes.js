const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ToDoList = require("../models/todoList-schema");
const Training = require("../models/training-schema");

// Middleware untuk validasi ObjectId
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

    const userId = req.session.user._id;

    // Ambil todo-list milik user
    const todoList = await ToDoList.find({ idUser: userId });

    if (!todoList || todoList.length === 0) {
      return res.status(200).json({ message: "No items found", data: [] });
    }

    res.status(200).json({ message: "Success", data: todoList });
  } catch (err) {
    console.error("Error fetching ToDoList:", err);
    res.status(500).json({ error: "Error retrieving todo-list items" });
  }
});

/**
 * POST /todolist
 * Add a new todo-list item
 */
router.post("/", async (req, res) => {
  try {
    const { idTraining, idUser, priority } = req.body;

    if (!idTraining || typeof idTraining !== "string") {
      return res
        .status(400)
        .json({ error: "idTraining must be a valid string" });
    }

    if (!idUser || typeof idUser !== "string") {
      return res
        .status(400)
        .json({ error: "idUser is required and must be a string" });
    }

    if (
      priority === undefined ||
      typeof priority !== "number" ||
      priority < 1 ||
      priority > 10
    ) {
      return res
        .status(400)
        .json({ error: "Priority must be a number between 1 and 10" });
    }

    // Hitung jumlah entri yang sudah ada untuk kombinasi user dan latihan ini
    const existingEntriesCount = await ToDoList.countDocuments({
      idUser,
      idTraining,
    });

    if (existingEntriesCount >= 3) {
      return res.status(400).json({
        error: "You cannot add more than 3 entries for the same training.",
      });
    }

    // Tambahkan latihan baru ke database
    const newToDo = new ToDoList({ idTraining, idUser, priority });
    await newToDo.save();

    res.status(201).json({ message: "ToDo added successfully", data: newToDo });
  } catch (err) {
    console.error("Error adding to todo-list:", err);
    res.status(500).json({ error: "Error adding to todo-list" });
  }
});

/**
 * DELETE /todolist/:id
 * Delete a todo-list item by ID
 */
router.delete("/:id", validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;

    const deletedToDo = await ToDoList.findByIdAndDelete(id);
    if (!deletedToDo) {
      return res.status(404).json({ error: "ToDo item not found" });
    }
    res.json({ message: "ToDo removed successfully", data: deletedToDo });
  } catch (err) {
    res.status(500).json({ error: "Error deleting todo-list item" });
  }
});

/**
 * PUT /todolist/:id
 * Update priority of a todo-list item
 */
router.put("/:id", validateObjectId, async (req, res) => {
  try {
    const { id } = req.params;
    const { priority } = req.body;

    console.log("Received ID for update:", id); // Debug ID
    console.log("New Priority:", priority);

    if (priority < 1 || priority > 10) {
      return res.status(400).json({ error: "Priority harus antara 1 dan 10." });
    }

    const updatedToDo = await ToDoList.findByIdAndUpdate(
      id,
      { priority },
      { new: true }
    );

    if (!updatedToDo) {
      console.log("ToDo item not found for ID:", id); // Debug jika tidak ditemukan
      return res.status(404).json({ error: "ToDo item tidak ditemukan." });
    }

    res.json({ message: "Priority berhasil diperbarui.", data: updatedToDo });
  } catch (err) {
    console.error("Error updating ToDo:", err);
    res.status(500).json({ error: "Error memperbarui priority." });
  }
});

module.exports = router;
