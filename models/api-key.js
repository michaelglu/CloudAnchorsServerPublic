const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const KeySchema = new mongoose.Schema({
  keyHash: { type: String, required: true }
});

KeySchema.pre("save", function(next) {
  const key = this;
  bcryptjs.genSalt(10, (error, salt) => {
    bcryptjs.hash(key.keyHash, salt, (error, hash) => {
      key.keyHash = hash;
      next();
    });
  });
});

const APIKEY = mongoose.model("apiKEY", KeySchema);
module.exports = { APIKEY };
