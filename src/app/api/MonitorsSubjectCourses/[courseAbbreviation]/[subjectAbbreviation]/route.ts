import { NextResponse,NextRequest } from 'next/server';
import db from "../../../../../utils/database/database"
import { count } from 'console';

export async function GET(
  request: NextRequest,
  { params }: { params: { courseAbbreviation: string ,subjectAbbreviation:string} }
) 
{
    let fields = await params;
    const courseAbbreviation = fields.courseAbbreviation;
    const subjectAbbreviation = fields.subjectAbbreviation;
    try {
        const res = await db
            .select('*')
            .from('monitors')
            .join('events', 'monitors.id', '=', 'events.monitor_id')
            .where('events.course_abbreviation', courseAbbreviation).andWhere('events.subject_abbreviation',subjectAbbreviation);
        return NextResponse.json({data:res});
    } catch (error) {
      
         return NextResponse.json(
      { error: 'Failed to fetch monitors' },
      { status: 500 }
    )
    }
}


  
 