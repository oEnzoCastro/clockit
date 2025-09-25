type Event = {
  monitor_name: string;
  monitor_id: number;
  event_id: number;
  event_location: string;
  event_recurrence: string | null;
  event_start_time: Date;
  event_end_time: Date;
  subject_name: string;
  subject_abbreviation: string;
  subject_semester: number;
  course_name: string;
  course_abbreviation: string;
};

export default Event;