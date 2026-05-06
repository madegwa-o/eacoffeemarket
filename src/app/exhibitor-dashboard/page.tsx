"use client";

import { FormEvent, useState } from "react";

export default function ExhibitorDashboardPage() {
    const [message, setMessage] = useState("");

        async function handleSubmit(event: FormEvent<HTMLFormElement>) {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                const payload = Object.fromEntries(formData.entries());

                const res = await fetch("/api/products", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });

                setMessage(res.ok ? "Coffee posted successfully." : "Failed to post coffee. Ensure you have EXHIBITOR role.");
                if (res.ok) event.currentTarget.reset();
                }

                return (
                <main className="mx-auto max-w-2xl space-y-6 p-6">
                    <h1 className="text-2xl font-bold">Exhibitor Dashboard</h1>
                    <p>Post your coffee so buyers can discover it on the home page.</p>
                    <form onSubmit={handleSubmit} className="space-y-4 rounded border p-4">
                        <input name="name" required placeholder="Coffee name" className="w-full rounded border p-2" />
                        <textarea name="description" required placeholder="Description" className="w-full rounded border p-2" />
                        <input name="origin" required placeholder="Origin (e.g. Ethiopia Sidamo)" className="w-full rounded border p-2" />
                        <input name="price" required type="number" min="0" step="0.01" placeholder="Price" className="w-full rounded border p-2" />
                        <input name="quantityAvailable" required type="number" min="1" placeholder="Quantity available" className="w-full rounded border p-2" />
                        <input name="imageUrl" placeholder="Image URL (optional)" className="w-full rounded border p-2" />
                        <button className="rounded bg-black px-4 py-2 text-white" type="submit">Post Coffee</button>
                    </form>
                    {message && <p className="text-sm">{message}</p>}
                </main>
                );
                }