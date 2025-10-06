import { NextResponse,NextRequest } from 'next/server';
import db from "../../../../utils/database/database"

export async function GET(request:NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const abbreviation = searchParams.get('course_abbreviation');
    try {
        const res = await db
            .select('*')
            .from('monitors')
            .join('events', 'monitors.id', '=', 'events.monitor_id')
            .where('events.course_abbreviation', abbreviation);
        return NextResponse.json({data:res});
    } catch (error) {
         return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
    }
}