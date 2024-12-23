const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: "",
    },
    seen: {
      type: Boolean,
      default: false,
    },
    msgByUserId: {
      type: mongoose.Schema.ObjectId,
      required: true,
      ref: "User",
    },
    msgtoId: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const conversetion = new mongoose.Schema(
  {
    user1: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    user1data: {
      type: Object,
      required: true,
    },
    user2: {
      type: mongoose.Schema.ObjectId,
      required: true,
    },
    user2data: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);
const messageModel = mongoose.model("Message", messageSchema);
const conversetionModel = mongoose.model("Conversetion", conversetion);
module.exports = { messageModel, conversetionModel };
