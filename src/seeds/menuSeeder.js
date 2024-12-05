const Menu = require("../models/menu-schema");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const url = process.env.DB_CONNECTION;

async function seedMenuData() {
  try {
    await mongoose.connect(url, {

    });

    console.log("Connected to Mongo");

    await Menu.deleteMany({});
    console.log("cleaning menu data");

    const menuData = [
      {
        name_menu: "Fiber Diet",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/food1.jpg")),
          contentType: "image/jpg",
        },
        description: "High Fiber Diet",
        category: "Healthy Food Fiber",
        availability: 6,
        link: "https://www.healthline.com/nutrition/22-high-fiber-foods",
      },
      {
        name_menu: "High Healthy Fat",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/food2.jpg")),
          contentType: "image/jpg",
        },
        description: "Healthy fat using vegetables",
        category: "Healthy Food Fat",
        availability: 9,
        link: "https://www.healthline.com/nutrition/10-super-healthy-high-fat-foods",
      },
      {
        name_menu: "High Carbo",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/food3.jpg")),
          contentType: "image/jpg",
        },
        description: "High Carbo food but also balanced in other kinds of foods",
        category: "Healthy Food Carbo",
        availability: 7,
        link: "https://www.healthline.com/nutrition/12-healthy-high-carb-foods",
      },
      {
        name_menu: "Protein Diet",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/food4.jpg")),
          contentType: "image/jpg",
        },
        description: "Menu for you that wants to try high protein diet",
        category: "Healthy Food Protein",
        availability: 8,
        link: "https://www.healthline.com/nutrition/high-protein-diet-plan",
      },
    ];

    await Menu.insertMany(menuData);
    console.log("worked");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding menu data:", error);
    mongoose.connection.close();
  }
}

seedMenuData();