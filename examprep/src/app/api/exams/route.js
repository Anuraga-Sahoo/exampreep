import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";

export async function GET() {
    try {
        await dbConnect();
        const exams = await Exam.find({}).populate({
            path: 'quizIds',
            match: { status: 'Published' },
            select: '_id'
        });
        return NextResponse.json(exams);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
