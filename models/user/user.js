const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Userschema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {},
  activate: false,
});

module.exports = User = mongoose.model("user", Userschema);
