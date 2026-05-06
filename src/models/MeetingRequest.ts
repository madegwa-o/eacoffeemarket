import { Schema, model, models } from "mongoose";

const MeetingRequestSchema = new Schema({
  buyer_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
  exhibitor_id: { type: Schema.Types.ObjectId, ref: "Exhibitor", required: true },
  message: String,
  proposed_time: Date,
  status: { type: String, enum: ["pending", "accepted", "rejected"], default: "pending" },
  created_at: { type: Date, default: Date.now },
});

export const MeetingRequest = models.MeetingRequest || model("MeetingRequest", MeetingRequestSchema);
