import { NextResponse,NextRequest } from 'next/server';
import db from "../../../../utils/database/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { abbreviation: string } }
) {
  
  const { abbreviation } = await params;
    try {
        const res = await db
            .select('*')
            .from('monitors')
            .join('events', 'monitors.id', '=', 'events.monitor_id')
            .where('events.course_abbreviation', abbreviation);
        return NextResponse.json({data:res});
    } catch (error) {
         return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
    }
}