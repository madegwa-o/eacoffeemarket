import { Schema, model, models, Types, Document } from "mongoose";

export interface ICoffeeProduct extends Document {
    _id: Types.ObjectId;
    exhibitorId: Types.ObjectId;
    exhibitorName: string;
    name: string;
    description: string;
    origin: string;
    price: number;
    quantityAvailable: number;
    imageUrl?: string | null;
    createdAt: Date;
    updatedAt: Date;
}

const CoffeeProductSchema = new Schema<ICoffeeProduct>(
    {
        exhibitorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        exhibitorName: { type: String, required: true, trim: true },
        name: { type: String, required: true, trim: true },
        description: { type: String, required: true, trim: true },
        origin: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        quantityAvailable: { type: Number, required: true, min: 0 },
        imageUrl: { type: String, default: null },
    },
    { timestamps: true, versionKey: false }
);

CoffeeProductSchema.index({ name: 1, origin: 1 });

export const CoffeeProduct = models.CoffeeProduct || model<ICoffeeProduct>("CoffeeProduct", CoffeeProductSchema);