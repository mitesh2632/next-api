const mongoose = require("mongoose");

const userModel = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: false,
  },
  image: {
    type: String,
    required: false,
  },
  password: {
    type: String,
    default: "",
  },
  facebook_token: String,
  google_token: String,
  apple_token: String,
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
  blog: [{ type: mongoose.Schema.Types.ObjectId, ref: "blogs" }],
});

export const User = mongoose.models.users || mongoose.model("users", userModel);
