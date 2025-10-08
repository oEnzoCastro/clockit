import { NextResponse, NextRequest } from 'next/server';
import db from "../../../../utils/database/database"

export async function GET(
  request: NextRequest,
  { params }: { params: { abbreviation: string } }
) {
  
  const { abbreviation } = await params;
  try {
    const res = await db("monitors AS D")
      .join("events AS A", "A.monitor_id", "=", "D.id")
      .join(
        "subjects AS B",
        "B.subject_abbreviation",
        "=",
        "A.subject_abbreviation"
      )
      .join("courses AS C", "C.abbreviation", "=", "B.course_abbreviation")
      .select(
        "D.name AS monitor_name",
        "A.event_id",
        "A.event_location",
        "A.event_recurrence",
        "A.event_start_time",
        "A.event_end_time",
        "B.name AS subject_name",
        "B.subject_abbreviation",
        "B.subject_semester",
        "C.abbreviation AS course_abbreviation",
        "C.name AS course_name"
      )
      .where("C.abbreviation", abbreviation);
    
    return NextResponse.json({ data: res });
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
