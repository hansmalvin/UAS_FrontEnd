const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();
const ToDoList = require("../models/todoList-schema");

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
    const todoList = await ToDoList.find(); 
    if (!todoList || todoList.length === 0) {
      return res.status(404).json({ error: "No Todolist items found" });
    }
    res.status(200).json({ message: "Success", data: todoList });
  } catch (err) {
    console.error("Error fetching Todolist:", err);
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
    console.log("Request Body:", req.body);

    if (!idTraining || typeof idTraining !== "string") {
      return res
        .status(400)
        .json({ error: "idTraining must be a valid string" });
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

    // Cek jumlah kemunculan idTraining dalam database
    const count = await ToDoList.countDocuments({ idTraining });
    if (count >= 3) {
      return res
        .status(400)
        .json({
          error:
            "Latihan sudah melebihi dari kapasitas list, mohon selesaikan latihan yang ada dahulu",
        });
    }

    const newToDo = new ToDoList({ idTraining, idUser, priority });
    await newToDo.save();
    console.log("Saved to database:", newToDo);
    res.status(201).json({ message: "ToDo added successfully", data: newToDo });
  } catch (err) {
    console.error("Error in backend:", err);
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

    if (priority < 1 || priority > 10) {
      return res.status(400).json({ error: "Priority harus antara 1 dan 10." });
    }

    const updatedToDo = await ToDoList.findByIdAndUpdate(
      id,
      { priority },
      { new: true }
    );
    if (!updatedToDo) {
      return res.status(404).json({ error: "ToDo item tidak ditemukan." });
    }

    res.json({ message: "Priority berhasil diperbarui.", data: updatedToDo });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error memperbarui priority." });
  }
});

module.exports = router;
