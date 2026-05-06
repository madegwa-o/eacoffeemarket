import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { CoffeeProduct } from "@/models/CoffeeProduct";
import { Role } from "@/models/User";

export async function GET() {
    await connectToDatabase();
    const products = await CoffeeProduct.find({}).sort({ createdAt: -1 }).lean();
    return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    console.log("user roles:", session?.user?.roles);

    if (!session?.user?.id || !session.user.roles?.includes(Role.EXHIBITOR)) {
        return NextResponse.json({ message: "Only exhibitors can post coffee products." }, { status: 403 });
    }

    const body = await request.json();
    await connectToDatabase();

    const product = await CoffeeProduct.create({
        exhibitorId: session.user.id,
        exhibitorName: session.user.name || "Exhibitor",
        name: body.name,
        description: body.description,
        origin: body.origin,
        price: Number(body.price),
        quantityAvailable: Number(body.quantityAvailable),
        imageUrl: body.imageUrl || null,
    });

    return NextResponse.json(product, { status: 201 });
}