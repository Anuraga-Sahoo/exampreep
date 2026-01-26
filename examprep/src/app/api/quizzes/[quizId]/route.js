import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";
import PreviousYearPaper from "@/models/PreviousYearPaper";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { quizId } = await params;

        let test = await Quiz.findById(quizId);

        if (!test) {
            // If not found in Quiz, try PreviousYearPaper
            test = await PreviousYearPaper.findById(quizId);
        }

        if (!test) {
            return NextResponse.json({ error: "Test not found" }, { status: 404 });
        }

        return NextResponse.json(test);
    } catch (error) {
        console.error("Error fetching test:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
