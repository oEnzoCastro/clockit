type Event = {
  event_id: string;
  event_title: string;
  event_description: string;
  event_location: string;
  event_recurrence: string | null;
  event_start_date: Date;
  event_end_date: Date;

  agent_name: string;

  theme_name: string;
  theme_abbreviation: string;

  sector_name: string;
  sector_abbreviation: string;

  institute_name: string;

  group_name: string;
};
export default Event;
