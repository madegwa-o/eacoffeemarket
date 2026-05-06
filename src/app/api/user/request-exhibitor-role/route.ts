import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User, Role } from "@/models/User";

export async function POST(request: NextRequest) {
    const session = await getServerSession();

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await request.json();
        const { companyName, phone, website, description } = body;

        // Validation
        if (!companyName || companyName.trim().length === 0) {
            return NextResponse.json(
                { message: "Company name is required" },
                { status: 400 }
            );
        }

        if (!phone || phone.trim().length === 0) {
            return NextResponse.json(
                { message: "Phone number is required" },
                { status: 400 }
            );
        }

        if (!description || description.trim().length === 0) {
            return NextResponse.json(
                { message: "Company description is required" },
                { status: 400 }
            );
        }

        if (description.length < 20) {
            return NextResponse.json(
                { message: "Description must be at least 20 characters" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        // Check if user already has exhibitor role
        if (user.roles.includes(Role.EXHIBITOR)) {
            return NextResponse.json(
                { message: "You already have the exhibitor role" },
                { status: 400 }
            );
        }

        // Add exhibitor role
        user.addRole(Role.EXHIBITOR);
        await user.save();

        return NextResponse.json(
            {
                message: "Exhibitor role granted successfully",
                roles: user.roles,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error("Exhibitor role request error:", error);
        return NextResponse.json(
            { message: "Failed to process exhibitor role request" },
            { status: 500 }
        );
    }
}
