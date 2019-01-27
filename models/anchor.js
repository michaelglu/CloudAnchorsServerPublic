const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const AnchorSchema = new mongoose.Schema({
  anchorID: { type: String, required: true },
  systemID: { type: String },
  apiKey: { type: String, required: true },
  translation: [{ type: Number, required: true }],
  rotation: [{ type: Number, required: true }],
  scale: [{ type: Number, required: true }],
  picturePath: { type: String, required: true }
});

const Anchor = mongoose.model("Anchor", AnchorSchema);
module.exports = { Anchor };
