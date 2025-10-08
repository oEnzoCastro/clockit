import { NextResponse, NextRequest } from "next/server";
import db from "../../../../utils/database/database";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ abbreviation: string }> }
) {
  
  const { abbreviation } = await params;

  try {
    const res = await db
      .select("A.name AS subject_name", "A.subject_abbreviation", "A.subject_semester", "B.name AS course_name", "B.abbreviation AS course_abbreviation")
      .from("subjects AS A")
      .join("courses AS B", "B.abbreviation", "A.course_abbreviation")
      .where("B.abbreviation", abbreviation);
      console.log(res);
    return NextResponse.json({ data: res });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch subjects" },
      { status: 500 }
    );
  }
}
