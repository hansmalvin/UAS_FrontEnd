train-schema.js
const mongoose = require("mongoose");
const { Schema } = mongoose;

const trainSchema = new Schema({
  title: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },

  img: {
    data: Buffer,
    contentType: String,
  },
  description: {
    type: String,
    minlength: 10,
    maxlength: 200,
  },
});

module.exports = mongoose.model("Train", trainSchema);

