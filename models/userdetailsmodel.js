const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, "provide name"],
      unique: true,
    },
    email: {
      type: String,
      required: [true, "provide email"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    bio: {
      type: String,
      default: "",
    },
    onlinestatus: {
      type: Boolean,
      default: false,
    },
    profile_pic: {
      type: String,
      default: "",
    },
    token: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

const userdetailsmodel = mongoose.model("User", userSchema);

module.exports = userdetailsmodel;
