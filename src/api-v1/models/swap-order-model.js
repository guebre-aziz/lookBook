const mongoose = require("mongoose");

const swapSchema = new mongoose.Schema(
  {
    swapUsersId: { type: Array, required: true, default: [] },
    swapProductsId: { type: Array, required: true, default: [] },
  },
  { timestamps: true }
);

const SwapModel = mongoose.model("swap-orders", swapSchema);

module.exports = SwapModel;
