import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  username: { type: String, unique: true, required: true },
  email: { type: String },
  password_hash: { type: String },
  google_id: { type: String },
  role: { type: String, enum: ["buyer", "exhibitor"], required: true },
  full_name: String,
  company: String,
  country: String,
  industries_of_interest: [{ type: String }],
  bio: String,
  created_at: { type: Date, default: Date.now },
});

export const User = models.User || model("User", UserSchema);
