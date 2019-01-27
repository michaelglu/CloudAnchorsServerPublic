const mongoose = require("mongoose");

mongoose.Promise = global.Promise;
const options = { useNewUrlParser: true };
mongoose.connect(
  "mongodb://localhost:27017/CloudAnchors", //I took out the actual path for security purposes
  options
);

module.exports = { mongoose };
