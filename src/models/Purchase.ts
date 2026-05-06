import { Schema, model, models, Types, Document } from "mongoose";

export interface IPurchase extends Document {
    _id: Types.ObjectId;
    buyerId: Types.ObjectId;
    productId: Types.ObjectId;
    productName: string;
    exhibitorName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    createdAt: Date;
    updatedAt: Date;
}

const PurchaseSchema = new Schema<IPurchase>(
    {
        buyerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
        productId: { type: Schema.Types.ObjectId, ref: "CoffeeProduct", required: true, index: true },
        productName: { type: String, required: true },
        exhibitorName: { type: String, required: true },
        quantity: { type: Number, required: true, min: 1 },
        unitPrice: { type: Number, required: true, min: 0 },
        totalPrice: { type: Number, required: true, min: 0 },
    },
    { timestamps: true, versionKey: false }
);

PurchaseSchema.index({ buyerId: 1, createdAt: -1 });

export const Purchase = models.Purchase || model<IPurchase>("Purchase", PurchaseSchema);