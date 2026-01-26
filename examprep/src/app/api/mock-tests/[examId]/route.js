import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Exam from "@/models/Exam";
import MockTest from "@/models/MockTest";

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { examId } = await params;

        const exam = await Exam.findById(examId).populate('mockExamIds');

        if (!exam) {
            return NextResponse.json({ error: "Exam not found" }, { status: 404 });
        }

        return NextResponse.json(exam);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
