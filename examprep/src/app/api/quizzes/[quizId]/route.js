import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Quiz from "@/models/Quiz";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { quizId } = await params;

        const quiz = await Quiz.findById(quizId);

        if (!quiz) {
            return NextResponse.json({ error: "Quiz not found" }, { status: 404 });
        }

        return NextResponse.json(quiz);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
