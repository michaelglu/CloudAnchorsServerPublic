const mongoose = require("mongoose");

const CoordinateSchema = new mongoose.Schema({
  csID: { type: String, required: true },
  apiKey: { type: String, required: true },
  point1: {
    translation: [{ type: Number, required: true }],
    rotation: [{ type: Number, required: true }]
  },
  point2: {
    translation: [{ type: Number, required: true }],
    rotation: [{ type: Number, required: true }]
  },
  point3: {
    translation: [{ type: Number, required: true }],
    rotation: [{ type: Number, required: true }]
  },
  point4: {
    translation: [{ type: Number, required: true }],
    rotation: [{ type: Number, required: true }]
  }
});

const CoordinateSystem = mongoose.model("CoordinateSystem", CoordinateSchema);
module.exports = { CoordinateSystem };
