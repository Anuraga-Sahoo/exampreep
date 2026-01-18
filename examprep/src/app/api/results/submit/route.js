import { NextResponse } from 'next/server';

export async function POST(request) {
    const body = await request.json();
    // In a real app, save to MongoDB here
    return NextResponse.json({ success: true, message: 'Result submitted successfully' });
}
