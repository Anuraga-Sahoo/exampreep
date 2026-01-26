import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import Quiz from "@/models/Quiz"; // Ensure Quiz model is registered

export async function GET() {
    try {
        await dbConnect();

        // Fetch all exams
        // Optimization: Do NOT populate here. We only need the list of exams.
        // The array of IDs is enough for the UI to show "N Papers" count.
        const exams = await Exam.find({});

        console.log(`API: Fetched ${exams.length} exams`);
        if (exams.length > 0) {
            console.log("Sample Exam Keys:", Object.keys(exams[0].toObject()));
            console.log("Sample PYQs:", exams[0].previousYearExamsIds);
        }

        return NextResponse.json(exams);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
