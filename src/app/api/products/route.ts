import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { CoffeeProduct } from "@/models/CoffeeProduct";
import { Role } from "@/models/User";

export async function GET(request: NextRequest) {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const exhibitorId = searchParams.get("exhibitorId");
    
    const query = exhibitorId ? { exhibitorId } : {};
    const products = await CoffeeProduct.find(query).sort({ createdAt: -1 }).lean();
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

export async function PUT(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.id || !session.user.roles?.includes(Role.EXHIBITOR)) {
        return NextResponse.json({ message: "Only exhibitors can update products." }, { status: 403 });
    }

    const body = await request.json();
    const { id } = body;

    if (!id) {
        return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const product = await CoffeeProduct.findById(id);
    if (!product) {
        return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    // Verify ownership
    if (product.exhibitorId.toString() !== session.user.id) {
        return NextResponse.json({ message: "You can only update your own products." }, { status: 403 });
    }

    const updated = await CoffeeProduct.findByIdAndUpdate(
        id,
        {
            name: body.name,
            description: body.description,
            origin: body.origin,
            price: Number(body.price),
            quantityAvailable: Number(body.quantityAvailable),
            imageUrl: body.imageUrl || null,
        },
        { new: true }
    );

    return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.id || !session.user.roles?.includes(Role.EXHIBITOR)) {
        return NextResponse.json({ message: "Only exhibitors can delete products." }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) {
        return NextResponse.json({ message: "Product ID is required." }, { status: 400 });
    }

    await connectToDatabase();

    const product = await CoffeeProduct.findById(id);
    if (!product) {
        return NextResponse.json({ message: "Product not found." }, { status: 404 });
    }

    // Verify ownership
    if (product.exhibitorId.toString() !== session.user.id) {
        return NextResponse.json({ message: "You can only delete your own products." }, { status: 403 });
    }

    await CoffeeProduct.findByIdAndDelete(id);

    return NextResponse.json({ message: "Product deleted successfully." });
}
