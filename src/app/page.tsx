"use client"

import {useEffect, useState} from "react";


type Product = {
    _id: string;
    name: string;
    description: string;
    origin: string;
    price: number;
    quantityAvailable: number;
    exhibitorName: string;
};
export default function Home() {

    const [products, setProducts] = useState<Product[]>([]);

    useEffect(() => {
        fetch("/api/products").then((r) => r.json()).then(setProducts).catch(() => setProducts([]));
    }, []);

    async function buy(productId: string) {
        const res = await fetch("/api/purchases", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ productId, quantity: 1 }),
        });

        if (res.ok) {
            setProducts((prev) => prev.map((p) => p._id === productId ? { ...p, quantityAvailable: p.quantityAvailable - 1 } : p));
            alert("Purchase saved to your buyer dashboard.");
        } else {
            alert("Purchase failed. Ensure you are signed in with BUYER role.");
        }
    }

    return (
        <main className="mx-auto max-w-4xl p-6">
            <h1 className="mb-2 text-3xl font-bold">East Africa Coffee Market</h1>
            <p className="mb-6">Browse coffee posted by exhibitors and buy directly.</p>
            <div className="grid gap-4 md:grid-cols-2">
                {products.map((product) => (
                    <article key={product._id} className="rounded border p-4">
                        <h2 className="text-xl font-semibold">{product.name}</h2>
                        <p>{product.description}</p>
                        <p className="text-sm">Origin: {product.origin}</p>
                        <p className="text-sm">Exhibitor: {product.exhibitorName}</p>
                        <p className="font-medium">${product.price.toFixed(2)}</p>
                        <p className="text-sm">Available: {product.quantityAvailable}</p>
                        <button disabled={product.quantityAvailable < 1} onClick={() => buy(product._id)} className="mt-2 rounded bg-green-700 px-4 py-2 text-white disabled:opacity-60">Buy</button>
                    </article>
                ))}
            </div>
        </main>
    );
}
