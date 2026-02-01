import { NextResponse } from 'next/server';
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth"; // Verified correct import
import dbConnect from '@/lib/db';
import Attempt from '@/models/Attempt';

// GET: Fetch attempts for the authenticated user
export async function GET(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        await dbConnect();

        // Fetch attempts sorted by most recent
        // Fetch attempts from the last 24 hours only
        const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const attempts = await Attempt.find({
            userId: session.user.id,
            updatedAt: { $gt: oneDayAgo }
        })
            .sort({ updatedAt: -1 })
            .limit(50);

        return NextResponse.json(attempts);
    } catch (error) {
        console.error("Failed to fetch attempts:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}

// POST: Save or Update an attempt
export async function POST(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = await req.json();
        console.log("RECEIVED ATTEMPT BODY:", JSON.stringify(body, null, 2));
        const { quizId, quizTitle, quizType, score, totalQuestions, percentage, responses } = body;

        if (!quizId || score === undefined || !totalQuestions) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        await dbConnect();

        // Upsert: Update if exists, Insert if not
        const filter = { userId: session.user.id, quizId: quizId };
        const update = {
            userId: session.user.id,
            quizId,
            quizTitle,
            quizType: quizType || 'Unknown',
            score,
            totalQuestions,
            percentage,
            responses,
            updatedAt: new Date()
        };
        const options = { upsert: true, new: true, setDefaultsOnInsert: true };

        const attempt = await Attempt.findOneAndUpdate(filter, update, options);

        return NextResponse.json(attempt, { status: 200 });
    } catch (error) {
        console.error("Failed to save attempt:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}

// DELETE: Delete an attempt
export async function DELETE(req) {
    try {
        const session = await getServerSession(authOptions);
        if (!session) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const attemptId = searchParams.get('id');

        if (!attemptId) {
            return NextResponse.json({ error: "Attempt ID required" }, { status: 400 });
        }

        await dbConnect();

        const deletedAttempt = await Attempt.findOneAndDelete({
            _id: attemptId,
            userId: session.user.id // Ensure user owns the attempt
        });

        if (!deletedAttempt) {
            return NextResponse.json({ error: "Attempt not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ message: "Attempt deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Failed to delete attempt:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
