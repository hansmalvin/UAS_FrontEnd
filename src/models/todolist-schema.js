const mongoose = require("mongoose");
const { Schema } = mongoose;

const todolistSchema = new Schema({
  idTraining: { type: String, required: true },
  idUser: { type: String, required: true},
  priority: { type: Number, required: true, min: 1, max: 10 },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ToDoList", todolistSchema);
