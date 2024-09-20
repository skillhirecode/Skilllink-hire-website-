const mongoose = require("mongoose");

const userCvSchema = new mongoose.Schema({
  fullname: {
    type: String,
    require: true,
  },

  email: {
    type: String,
    require: true,
  },
  cv: {
    type: String,
    require: true,
  },

 
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('userCvupload',userCvSchema)