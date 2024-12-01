const mongoose = require("mongoose");
const { Schema } = mongoose;

const menuSchema = new Schema({
  name_menu: { type: String, required: true, trim: true },
  img: { data: Buffer, contentType: String },
  description: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  availability: { type: Number, default: 0, min: 0 },
  link: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model("Menu", menuSchema);
