
import { NextResponse } from 'next/server';
import db from "./../../../utils/database/database"

export async function GET() {
    try {
        const res = await db.select('courses');
        return NextResponse.json({data:res});
    } catch (error) {
         return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
    }
}