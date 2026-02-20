import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Subject from "@/models/Subject";
import Chapter from "@/models/Chapter"; // Ensure Chapter model is registered
import Quiz from "@/models/Quiz"; // Ensure Quiz model is registered for deep population

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { subjectId } = await params;
        console.log("API: Fetching subject with ID:", subjectId);

        if (!subjectId || subjectId === 'undefined') {
            return NextResponse.json({ error: "Invalid Subject ID" }, { status: 400 });
        }

        const subject = await Subject.findById(subjectId).populate({
            path: 'associatedChapterIds',
            populate: {
                path: 'quizIds',
                match: { status: 'Published' },
                select: '_id'
            }
        });

        if (!subject) {
            return NextResponse.json({ error: "Subject not found" }, { status: 404 });
        }

        return NextResponse.json(subject);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
