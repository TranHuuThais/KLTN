  const mongoose = require("mongoose");

  const gallerySchema = new mongoose.Schema(
    {
      Images: { type: String, required: true },
    },
    {
      timestamps: true,
    }
  );

  module.exports = mongoose.model("Gallery", gallerySchema);
  