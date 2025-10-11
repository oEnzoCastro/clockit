import { NextResponse, NextRequest } from "next/server";
import db from "../../../../utils/database/database";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: Promise<{
      institute: string;
    }>;
  }
) {
  const fields = await params;
  const institute = fields.institute;

  const title = request.nextUrl.searchParams.get("title");

  try {
    const res = await db
      .select(
        "e.id",
        "e.title",
        "e.description",
        "e.startdate",
        "e.enddate",
        "e.location",
        "a.name as agent_name",
        "i.name as institute_name",
        "s.name as sector_name",
        "s.abbreviation as sector_abbreviation"
      )
      .from("event as e")
      .join("agent as a", "e.agentid", "a.id")
      .join("institute as i", "e.instituteid", "i.id")
      .where("i.name", institute)
      .join("sector as s", "e.sectorid", "s.id");

    if (title) {
      return NextResponse.json({ data: res.filter((event) => event.title.includes(title)) })
      
    }

    return NextResponse.json({ data: res });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch monitors" },
      { status: 500 }
    );
  }
}
