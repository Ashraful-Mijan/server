const mongoose = require("mongoose");
const config = require("config");
const db = config.get("mongoURI");

const connectdb = async () => {
  try {
    await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
    });
    console.log("mongo db connected");
  } catch (err) {
    console.log(err);
  }
};

module.exports = connectdb;
