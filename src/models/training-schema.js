const mongoose = require("mongoose");
const { Schema } = mongoose;

const trainingSchema = new Schema(
  {
    title: { type: String, required: true },
    img: { data: Buffer, contentType: String },
    description: { type: String, required: true },
    rating: { type: Number, default: 0 },
    link: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Training", trainingSchema);
