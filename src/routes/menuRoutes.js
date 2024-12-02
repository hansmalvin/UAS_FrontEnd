const express = require("express");
const multer = require("multer");
const Menu = require("../models/menu-schema");
const mongoose = require("mongoose");
const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

/**
 * GET /menus
 * Retrieve all menu data
 */
router.get("/", async (req, res) => {
  try {
    const menus = await Menu.find();

    const formattedMenus = menus.map((menu) => {
      if (menu.img && menu.img.data) {
        return {
          ...menu.toObject(),
          img: {
            contentType: menu.img.contentType,
            data: menu.img.data.toString("base64")
          },
        };
      }
      return menu;
    });

    res.json(formattedMenus);
  } catch (err) {
    console.error("Error fetching menus:", err);
    res.status(500).json({ error: "Error fetching menus" });
  }
});

/**
 * POST /menus
 * Add new menu
 */
router.post("/", upload.single("img"), async (req, res) => {
  const { name_menu, description, category, availability, link } = req.body;

  if (!name_menu || !description || !category || !link) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const newMenu = new Menu({
      name_menu,
      description,
      category,
      availability: availability || 0,
      link,
    });

    if (req.file) {
      newMenu.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await newMenu.save();
    res.status(201).json({ message: "Menu added successfully", newMenu });
  } catch (err) {
    console.error("Error adding menu:", err);
    res.status(500).json({ error: "Error adding menu" });
  }
});

/**
 * DELETE /menus/:id
 * Delete menu by ID
 */
router.delete("/:id", async (req, res) => {
  try {
    const menu = await Menu.findByIdAndDelete(req.params.id);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }
    res.json({ message: "Menu deleted successfully" });
  } catch (err) {
    console.error("Error deleting menu:", err);
    res.status(500).json({ error: "Error deleting menu" });
  }
});

/**
 * PUT /menus/:id
 * Update menu data by ID
 */
router.put("/:id", upload.single("img"), async (req, res) => {
  const menuId = req.params.id;

  try {
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(menuId)) {
      return res.status(400).json({ error: "Invalid menu ID" });
    }

    const { name_menu, description, category, availability, link } = req.body;

    const menu = await Menu.findById(menuId);
    if (!menu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    if (name_menu) menu.name_menu = name_menu;
    if (description) menu.description = description;
    if (category) menu.category = category;
    if (availability !== undefined) menu.availability = availability;
    if (link) menu.link = link;

    if (
      req.file &&
      ["image/jpeg", "image/png", "image/gif"].includes(req.file.mimetype)
    ) {
      menu.img = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
      };
    }

    await menu.save();

    res.status(200).json({
      message: "Menu updated successfully",
      menu,
    });
  } catch (err) {
    console.error("Error updating menu:", err);
    res.status(500).json({ error: "Error updating menu" });
  }
});

/**
 * PATCH /menus/:id/availability
 * Update availability of a specific menu
 */
router.patch("/:id/availability", async (req, res) => {
  try {
    const { availability } = req.body;

    if (availability < 0 || typeof availability !== "number") {
      return res
        .status(400)
        .json({ error: "Availability must be a non-negative number" });
    }

    const updatedMenu = await Menu.findByIdAndUpdate(
      req.params.id,
      { availability },
      { new: true, runValidators: true }
    );

    if (!updatedMenu) {
      return res.status(404).json({ error: "Menu not found" });
    }

    res.json({ message: "Availability updated successfully", updatedMenu });
  } catch (err) {
    console.error("Error updating availability:", err);
    res.status(500).json({ error: "Error updating availability" });
  }
});

module.exports = router;
