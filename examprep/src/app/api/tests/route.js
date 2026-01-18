import { NextResponse } from 'next/server';
import { MOCK_TESTS } from '@/lib/data';

export async function GET() {
    return NextResponse.json(MOCK_TESTS);
}
