import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import Quiz from "@/models/Quiz"; // Ensure Quiz model is registered

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { examId } = await params;

        const exam = await Exam.findById(examId).populate('quizIds');

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
