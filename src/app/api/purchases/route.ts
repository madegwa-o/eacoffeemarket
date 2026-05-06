import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { connectToDatabase } from "@/lib/db";
import { CoffeeProduct } from "@/models/CoffeeProduct";
import { Purchase } from "@/models/Purchase";
import { Role } from "@/models/User";

export async function GET() {
    const session = await getServerSession();
    if (!session?.user?.id || !session.user.roles?.includes(Role.BUYER)) {
        return NextResponse.json({ message: "Only buyers can view purchases." }, { status: 403 });
    }

    await connectToDatabase();
    const purchases = await Purchase.find({ buyerId: session.user.id }).sort({ createdAt: -1 }).lean();
    return NextResponse.json(purchases);
}

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    console.log("user roles:", session?.user?.roles);
    if (!session?.user?.id || !session.user.roles?.includes(Role.BUYER)) {
        return NextResponse.json({ message: "Only buyers can purchase." }, { status: 403 });
    }

    const { productId, quantity } = await request.json();
    await connectToDatabase();

    const product = await CoffeeProduct.findById(productId);
    if (!product) return NextResponse.json({ message: "Product not found." }, { status: 404 });
    if (product.quantityAvailable < quantity) {
        return NextResponse.json({ message: "Not enough stock available." }, { status: 400 });
    }

    product.quantityAvailable -= quantity;
    await product.save();

    const purchase = await Purchase.create({
        buyerId: session.user.id,
        productId: product._id,
        productName: product.name,
        exhibitorName: product.exhibitorName,
        quantity,
        unitPrice: product.price,
        totalPrice: product.price * quantity,
    });

    return NextResponse.json(purchase, { status: 201 });
}