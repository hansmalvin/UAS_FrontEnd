const express = require("express");
const multer = require("multer");
const Training = require("../models/training-schema");
const mongoose = require("mongoose");
const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * GET /trainings
 * Retrieve all training data
 */
router.get("/", async (req, res) => {
  try {
    const trainings = await Training.find();

    // Convert buffer image data to base64 for each training
    const formattedTrainings = trainings.map((training) => {
      if (training.img && training.img.data) {
        return {
          ...training.toObject(),
          img: {
            contentType: training.img.contentType,
            data: training.img.data.toString("base64"), // Convert buffer to Base64
          },
        };
      }
      return training;
    });

    res.json(formattedTrainings);
  } catch (err) {
    console.error("Error fetching trainings:", err);
    res.status(500).json({ error: "Error fetching trainings" });
  }
});

/**
 * POST /trainings
 * Add new training
 */
router.post("/", upload.single("img"), async (req, res) => {
  try {
    const { title, description, link, rating } = req.body;

    const newTraining = new Training({
      title,
      description,
      link,
      rating: rating || 0, // Default rating if not provided
    });

    // Add image if provided
    if (req.file) {
      newTraining.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await newTraining.save();
    res
      .status(201)
      .json({ message: "Training added successfully", newTraining });
  } catch (err) {
    res.status(500).json({ error: "Error adding training" });
  }
});

/**
 * DELETE /trainings/:id
 * Delete training by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const training = await Training.findByIdAndDelete(req.params.id);
    if (!training) {
      return res.status(404).json({ error: "Training not found" });
    }
    res.json({ message: "Training deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error deleting training" });
  }
});

/**
 * PUT /trainings/:id
 * Update training data by ID
 */

router.put("/:id", upload.single("img"), async (req, res) => {
  const trainingId = req.params.id;

  try {
    // Validasi ObjectId
    console.log("Received training ID from client:", trainingId);
    if (!mongoose.Types.ObjectId.isValid(trainingId)) {
      console.log("ID is invalid:", trainingId); // Debug
      return res.status(400).json({ error: "Invalid training ID waduh" });
    }

    const { title, description, link, rating } = req.body;

    const training = await Training.findById(trainingId);
    if (!training) {
      console.log("Training not found for ID:", trainingId); // Debug
      return res.status(404).json({ error: "Training not found" });
    }
    // Update fields
    if (title) training.title = title;
    if (description) training.description = description;
    if (link) training.link = link;
    if (rating !== undefined) training.rating = rating;

    // Handle uploaded image
    if (
      req.file &&
      ["image/jpeg", "image/png", "image/gif"].includes(req.file.mimetype)
    )
      await training.save();

    res.status(200).json({
      message: "Training updated successfully",
      training,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error updating training" });
  }
});

/**
 * PATCH /trainings/:id/rating
 * Update rating of a specific training
 */
router.patch("/:id/rating", async (req, res) => {
  try {
    let { rating } = req.body;

    // Coba parse rating jika dikirim sebagai string
    rating = Number(rating);

    if (isNaN(rating) || rating < 0 || rating > 5) {
      return res
        .status(400)
        .json({ error: "Rating must be a number between 0 and 5" });
    }

    const updatedTraining = await Training.findByIdAndUpdate(
      req.params.id,
      { rating },
      { new: true, runValidators: true }
    );

    if (!updatedTraining) {
      return res.status(404).json({ error: "Training not found" });
    }

    res.json({ message: "Rating updated successfully", updatedTraining });
  } catch (err) {
    res.status(500).json({ error: "Error updating rating" });
  }
});

module.exports = router;
