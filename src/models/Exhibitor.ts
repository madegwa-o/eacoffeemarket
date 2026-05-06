import { Schema, model, models } from "mongoose";

const ExhibitorSchema = new Schema({
  company_name: { type: String, required: true },
  logo_url: String,
  description: String,
  website: String,
  booth_number: String,
  country: String,
  sponsor_level: String,
  industries: [{ type: String }],
  looking_for: [{ type: String }],
});

export const Exhibitor = models.Exhibitor || model("Exhibitor", ExhibitorSchema);
