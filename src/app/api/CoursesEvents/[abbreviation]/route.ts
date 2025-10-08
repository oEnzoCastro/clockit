import { NextResponse, NextRequest } from "next/server";
import db from "../../../../utils/database/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ abbreviation: string }> }
) {
  const { abbreviation } = await params;
  try {
    const res = await db("courses AS C")
      .select(
        "M.name AS monitor_name",
        "E.event_id",
        "E.event_location",
        "E.event_recurrence",
        "E.event_start_time",
        "E.event_end_time",
        "S.name AS subject_name",
        "S.subject_abbreviation",
        "S.subject_semester",
        "C.abbreviation AS course_abbreviation",
        "C.name AS course_name"
      )
      // .select("*")
      .where("C.abbreviation", abbreviation)
      .join("events AS E", "E.course_abbreviation", "=", "C.abbreviation")
      .join(
        "subjects AS S",
        "S.subject_abbreviation",
        "=",
        "E.subject_abbreviation"
      )
      .join("monitors AS M", "M.id", "=", "E.monitor_id")
      // .where("C.abbreviation", abbreviation);

    return NextResponse.json({ data: res });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
