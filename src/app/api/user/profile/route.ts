import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/db";
import { User } from "@/models/User";
import { handler as authHandler } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession({
            handlers: [authHandler],
        });

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }

    try {
        await connectToDatabase();
        const user = await User.findById(session.user.id);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

            return NextResponse.json({
                _id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone || "",
                address: user.address || "",
                roles: user.roles,
                accountType: user.accountType,
            });
        } catch (error) {
            console.error("Profile fetch error:", error);
            return NextResponse.json(
                { message: "Failed to fetch profile" },
                { status: 500 }
            );
        }
    } catch (sessionError) {
        console.error("Session error:", sessionError);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}

export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession({
            handlers: [authHandler],
        });

        if (!session?.user?.id) {
            return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
        }
        const body = await request.json();
        const { name, phone, address } = body;

        // Validation
        if (name && (name.length < 2 || name.length > 50)) {
            return NextResponse.json(
                { message: "Name must be between 2 and 50 characters" },
                { status: 400 }
            );
        }

        if (phone && phone.length > 20) {
            return NextResponse.json(
                { message: "Phone number is too long" },
                { status: 400 }
            );
        }

        if (address && address.length > 200) {
            return NextResponse.json(
                { message: "Address is too long" },
                { status: 400 }
            );
        }

        await connectToDatabase();
        const user = await User.findByIdAndUpdate(
            session.user.id,
            {
                ...(name && { name }),
                ...(phone !== undefined && { phone: phone || null }),
                ...(address !== undefined && { address: address || null }),
            },
            { new: true }
        );

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            address: user.address || "",
            roles: user.roles,
            accountType: user.accountType,
        });
        } catch (error) {
            console.error("Profile update error:", error);
            return NextResponse.json(
                { message: "Failed to update profile" },
                { status: 500 }
            );
        }
    } catch (sessionError) {
        console.error("Session error:", sessionError);
        return NextResponse.json(
            { message: "Unauthorized" },
            { status: 401 }
        );
    }
}
