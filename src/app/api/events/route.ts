import { NextResponse } from "next/server";
import db from "../../../utils/database/database";

export async function GET() {
  try {
    const res = await db
      // .select(
      //   "e.id",
      //   "e.title",
      //   "e.description",
      //   "e.startdate",
      //   "e.enddate",
      //   "e.location",
      //   "a.name as agent_name",
      //   "i.name as institute_name",
      //   "s.name as sector_name",
      //   "s.abbreviation as sector_abbreviation"
      // )
      .select(
        "i.name as institute_name",
        "g.name as group_name",
        "e.id as event_id",
        "e.title as event_title",
        "e.description as event_description",
        "e.startdate as event_start_date",
        "e.enddate as event_end_date",
        "e.location as event_location",
        "e.recurrence as event_recurrence",
        "a.name as agent_name",
        "t.name as theme_name",
        "t.abbreviation as theme_abbreviation",
        "s.name as sector_name",
        "s.abbreviation as sector_abbreviation"
      )
      .from("institute as i")
      .where("i.name", "ICEI") // Filter by institute name
      .join("group as g", "i.id", "g.instituteid")
      .where("g.name", "Lourdes") // Filter by group name
      .join("event as e", "e.groupid", "g.id")
      .join("agent as a", "e.agentid", "a.id")
      .join("sector as s", "e.sectorid", "s.id")
      .join("theme as t", "e.id", "t.eventid")
      .where("t.name", "Ciência da Computação"); // Filter by theme name

    return NextResponse.json(res);
  } catch (_error) {
    return NextResponse.json(
      { error: "Failed to fetch events" + _error },
      { status: 500 }
    );
  }
}
