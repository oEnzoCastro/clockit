import { NextResponse,NextRequest } from 'next/server';
import db from "../../../../utils/database/database"
import { count } from 'console';

export async function GET(request:NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const courseAbbreviation = searchParams.get('course_abbreviation');
    const subjectAbbreviation = searchParams.get('subject_abbreviation');
    try {
        const res = await db
            .select('*')
            .from('monitors')
            .join('events', 'monitors.id', '=', 'events.monitor_id')
            .where('events.course_abbreviation', courseAbbreviation).andWhere('events.subject_abbreviation',subjectAbbreviation);
        return NextResponse.json({data:res});
    } catch (error) {
         return NextResponse.json(
      { error: 'Failed to fetch courses' },
      { status: 500 }
    )
    }
}