import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import dbConnect from "@/lib/db";
import User from "@/models/User";

// GET: Fetch User Profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();
        const user = await User.findOne({ email: session.user.email }).select('-password');

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        return NextResponse.json(user);
    } catch (error) {
        console.error("Profile Fetch Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// PATCH: Update User Profile (Phone Number)
export async function PATCH(req) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("Profile Update Request Body:", body);
        const { phone, name } = body;

        // Basic validation
        if (phone && phone.length > 15) {
            return NextResponse.json({ error: "Invalid phone number" }, { status: 400 });
        }

        await dbConnect();

        // DEBUG: Check if phone is in the schema paths
        console.log("User Model Paths:", Object.keys(User.schema.paths).filter(k => k === 'phone'));

        const updateFields = {};
        if (phone !== undefined) updateFields.phone = phone;
        if (name !== undefined) updateFields.name = name;

        console.log("Fields to update:", updateFields);

        const updatedUser = await User.findOneAndUpdate(
            { email: session.user.email },
            { $set: updateFields },
            { new: true, runValidators: true }
        ).select('-password');

        console.log("Updated User:", updatedUser);

        return NextResponse.json(updatedUser);
    } catch (error) {
        console.error("Profile Update Error:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
