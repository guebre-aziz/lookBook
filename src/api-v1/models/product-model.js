const mongoose = require("mongoose");
const ObjectId = mongoose.Schema.Types.ObjectId;

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    userId: { type: ObjectId, required: true },
    images: { type: Array, default: [] },
  },
  { timestamps: true }
);

productSchema.index({ name: "text" });

const ProductModel = mongoose.model("products", productSchema);

module.exports = ProductModel;
