// ============================================
// models/Exhibitor.ts
// ============================================

import { Schema, model, models, Types, Document } from "mongoose";

// ? Optional enums (expand as needed)
export enum SponsorLevel {
    GOLD = "GOLD",
    SILVER = "SILVER",
    BRONZE = "BRONZE",
}

export interface IExhibitor extends Document {
    _id: Types.ObjectId;

    company_name: string;
    logo_url?: string | null;
    description?: string | null;
    website?: string | null;
    booth_number?: string | null;
    country?: string | null;

    sponsor_level?: SponsorLevel;

    industries: string[];
    looking_for: string[];

    createdAt: Date;
    updatedAt: Date;
}

const ExhibitorSchema = new Schema<IExhibitor>(
    {
        company_name: {
            type: String,
            required: [true, "Company name is required"],
            trim: true,
            minlength: [2, "Company name must be at least 2 characters"],
            maxlength: [100, "Company name cannot exceed 100 characters"],
            index: true,
        },

        logo_url: {
            type: String,
            default: null,
        },

        description: {
            type: String,
            default: null,
            maxlength: [1000, "Description too long"],
        },

        website: {
            type: String,
            default: null,
            trim: true,
        },

        booth_number: {
            type: String,
            default: null,
            index: true,
        },

        country: {
            type: String,
            default: null,
            index: true,
        },

        sponsor_level: {
            type: String,
            enum: Object.values(SponsorLevel),
            default: null,
            index: true,
        },

        industries: {
            type: [String],
            default: [],
            index: true,
        },

        looking_for: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        versionKey: false,
    }
);

// ? Compound indexes (optimize filtering)
ExhibitorSchema.index({ country: 1, sponsor_level: 1 });
ExhibitorSchema.index({ industries: 1 });

// ? Export (typed model)
export const Exhibitor =
    models.Exhibitor || model<IExhibitor>("Exhibitor", ExhibitorSchema);