import { NextResponse,NextRequest } from 'next/server';
import db from "../../../../utils/database/database"

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ abbreviation: string }> }
) {
  
  const { abbreviation } = await params;
    console.log(abbreviation);


    try {
        const res = await db
            .select('*')
            .from('monitors')
            .join('events', 'monitors.id', '=', 'events.monitor_id')
            .where('events.subject_abbreviation', abbreviation);
        return NextResponse.json({data:res});
    } catch (_error) {
         return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
    }
}