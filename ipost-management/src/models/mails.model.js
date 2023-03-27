const mongoose = require("mongoose");

const mailSchema = mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    subject: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    attachments: {
      type: Array,
    },
    status: {
      type: String,
      enum: ["UNREAD", "READ"],
      default: "UNREAD",
      required: true,
    },
    readAt: {
      type: Date,
    },
    counter: {
      type: Number,
      default: 0,
      required: true,
    },
    deleteStatus: {
      type: String,
      enum: ["NONE", "TRASHED", "DELETED"],
      default: "NONE",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Mails = new mongoose.model("Mail", mailSchema);
module.exports = Mails;
