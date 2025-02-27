const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      require: true,
      unique: true,
      trim: true,
    },

    email: {
      type: String,
      require: true,
      unique: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"], //only allow user or admin roles
      default: "user",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
