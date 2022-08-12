const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, index: true },
    surname: { type: String, required: true, index: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/],
    },
  },
  { timestamps: true }
);

userSchema.index({ name: "text" });
userSchema.index({ surname: "text" });

const UserModel = mongoose.model("users", userSchema);

module.exports = UserModel;
