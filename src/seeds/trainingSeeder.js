const Training = require("../models/training-schema");
const mongoose = require("mongoose");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

const url = process.env.DB_CONNECTION;

async function seedTrainingData() {
  try {
    await mongoose.connect(url, {

    });

    console.log("Connected to MongoDB!");

    await Training.deleteMany({});
    console.log("Old training data deleted.");

    const trainingData = [
      {
        title: "Deadlift",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/training1.jpg")),
          contentType: "image/jpg",
        },
        description: "Strength training for people that wants extreme strong",
        rating: 4,
        link: "https://stronglifts.com/deadlift/",
      },
      {
        title: "Pulldown back training",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/training2.jpg")),
          contentType: "image/jpg",
        },
        description: "Hypertrophy training using pulldown machine for back workout",
        rating: 1,
        link: "https://www.verywellfit.com/how-to-do-the-lat-pulldown-3498309",
      },
      {
        title: "Squat Leg training",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/training3.jpg")),
          contentType: "image/jpg",
        },
        description: "Hypertrophy training using Leg Squat Movements",
        rating: 1,
        link: "https://health.clevelandclinic.org/proper-squat-form",
      },
      {
        title: "Chest training",
        img: {
          data: fs.readFileSync(path.join(__dirname, "../public/image/training4.jpg")),
          contentType: "image/jpg",
        },
        description: "Hypertrophy training using incline bench press for chest growth",
        rating: 1,
        link: "https://www.webmd.com/fitness-exercise/how-to-do-incline-bench-presses",
      },
    ];

    await Training.insertMany(trainingData);
    console.log("Training data seeded!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error seeding training data:", error);
    mongoose.connection.close();
  }
}

seedTrainingData();