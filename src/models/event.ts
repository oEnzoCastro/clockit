type Event = {
  monitor_name: string;
  monitor_id: number; // Foreign Key -> monitors.id
  event_id: number; // Primary Key
  event_location: string;
  event_recurrence: string | null;
  event_start_time: Date;
  event_end_time: Date;
  subject_name: string; 
  subject_abbreviation: string; // Foreign Key -> subjects.subject_abbreviation
  subject_semester: number;
  course_name: string;
  course_abbreviation: string; // Foreign Key -> courses.abbreviation
};

export default Event;