import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import Quiz from "@/models/Quiz"; // Ensure Quiz model is registered
import PreviousYearPaper from "@/models/PreviousYearPaper"; // Ensure Model is registered for population

export async function GET() {
    try {
        await dbConnect();

        // Fetch all exams
        // Fetch all exams and populate IDs filtering by Published status to get correct counts
        const exams = await Exam.find({}).populate({
            path: 'previousYearExamsIds',
            match: { status: { $regex: /^published$/i } },
            select: '_id' // We only need proper count, so IDs are fine (array length)
        });

        // Filter out exams that have 0 published PYQs
        const filteredExams = exams.filter(exam =>
            exam.previousYearExamsIds && exam.previousYearExamsIds.length > 0
        );

        return NextResponse.json(filteredExams);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
