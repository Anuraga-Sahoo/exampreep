import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Chapter from "@/models/Chapter";
import Quiz from "@/models/Quiz"; // Ensure Quiz model is registered

export async function GET(request, { params }) {
    try {
        await dbConnect();
        const { chapterId } = await params;

        const chapter = await Chapter.findById(chapterId).populate('quizIds');

        if (!chapter) {
            return NextResponse.json({ error: "Chapter not found" }, { status: 404 });
        }

        return NextResponse.json(chapter);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
