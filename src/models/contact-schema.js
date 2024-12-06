const mongoose = require("mongoose");
const { Schema } = mongoose;

const contactSchema = new Schema(
  {
    title: { type: String, required: true, minlength: 3, maxlength: 100 },
    message: { type: String, required: true, minlength: 3, maxlength: 500 },
    idUser: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Contact", contactSchema);
