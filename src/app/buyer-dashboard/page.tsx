
"use client";

import { useEffect, useState } from "react";

 type Purchase = {
        _id: string;
        productName: string;
        exhibitorName: string;
        quantity: number;
        unitPrice: number;
        totalPrice: number;
        createdAt: string;
    };

    export default function BuyerDashboardPage() {
        const [purchases, setPurchases] = useState<Purchase[]>([]);

                useEffect(() => {
                fetch("/api/purchases").then((r) => r.json()).then((data) => setPurchases(Array.isArray(data) ? data : [])).catch(() => setPurchases([]));
            }, []);


    return (
        <main className="mx-auto max-w-3xl p-6">
            <h1 className="mb-4 text-2xl font-bold">Buyer Dashboard</h1>
            <div className="space-y-3">
                {purchases.map((purchase) => (
                    <div key={purchase._id} className="rounded border p-4">
                        <p className="font-semibold">{purchase.productName}</p>
                        <p className="text-sm">From: {purchase.exhibitorName}</p>
                        <p className="text-sm">Qty: {purchase.quantity}</p>
                        <p className="text-sm">Unit: ${purchase.unitPrice.toFixed(2)}</p>
                        <p className="font-medium">Total: ${purchase.totalPrice.toFixed(2)}</p>
                    </div>
                ))}
            </div>
        </main>
    );
}