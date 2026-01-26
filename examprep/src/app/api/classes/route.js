import { NextResponse } from 'next/server';
import dbConnect from "@/lib/db";
import Class from "@/models/Class";
import Subject from "@/models/Subject"; // Ensure Subject model is registered

export async function GET() {
    try {
        await dbConnect();

        // Fetch all classes and populate associated subjects
        const classes = await Class.find({}).populate('associatedSubjectIds');

        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
