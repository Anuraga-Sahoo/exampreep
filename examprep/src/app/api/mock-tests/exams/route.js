import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";

export async function GET() {
    try {
        await dbConnect();
        // Fetch all exams
        // We do not need to populate here, just list them
        const exams = await Exam.find({});
        return NextResponse.json(exams);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
