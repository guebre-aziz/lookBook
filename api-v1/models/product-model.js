const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    images: { type: Array, default: [] },
  },
  { timestamps: true }
);

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
