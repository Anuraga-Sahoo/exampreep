import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import MockTest from "@/models/MockTest"; // Ensure Model is registered for population

export async function GET() {
    try {
        await dbConnect();
        // Fetch all exams
        // Fetch all exams and populate IDs filtering by Published status for correct count
        const exams = await Exam.find({}).populate({
            path: 'mockExamIds',
            match: { status: { $regex: /^published$/i } },
            select: '_id'
        });
        // Filter out exams that have 0 published Mock Tests
        const filteredExams = exams.filter(exam =>
            exam.mockExamIds && exam.mockExamIds.length > 0
        );

        return NextResponse.json(filteredExams);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
