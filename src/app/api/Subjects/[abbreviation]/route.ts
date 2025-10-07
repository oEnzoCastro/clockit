import { NextResponse, NextRequest } from "next/server";
import db from "../../../../utils/database/database";

export async function GET(
  request: NextRequest,
  { params }: { params: { abbreviation: string } }
) {
  
  const { abbreviation } = await params;

  try {
    const res = await db
      .select("*")
      .from("subjects")
      .join("courses", "courses.abbreviation", "subjects.course_abbreviation")
      .where("courses.abbreviation", abbreviation);
      console.log(res);
    return NextResponse.json({ data: res });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
