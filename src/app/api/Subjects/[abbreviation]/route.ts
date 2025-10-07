import { NextResponse, NextRequest } from "next/server";
import db from "../../../../utils/database/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { abbreviation: string } }
) {
  const { abbreviation } = params;

  try {
    const res = await db
      .select("*")
      .from("subjects")
      .join("courses", "courses.abbreviation", "subjects.course_abbreviation")
      .where("courses.abbreviation", abbreviation);
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}
