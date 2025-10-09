import { NextResponse } from "next/server";
import db from "../../../utils/database/database";

export async function GET() {
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
      .join("sector as s", "e.sectorid", "s.id");
    return NextResponse.json({ data: res });
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch events" + _error },
      { status: 500 }
    );
  }
}
