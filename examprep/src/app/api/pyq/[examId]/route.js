import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import PreviousYearPaper from "@/models/PreviousYearPaper"; // Correct model import
import Quiz from "@/models/Quiz";


export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { examId } = await params;

        // Fetch specific exam and populate using the NEW correct reference
        const exam = await Exam.findById(examId).populate({
            path: 'previousYearExamsIds',
            match: { status: 'Published' }
        });

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        console.log(`API DEBUG: Populated PYQs:`, exam.previousYearExamsIds);

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
