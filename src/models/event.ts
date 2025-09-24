type Event = {
  monitor: string;
  id: string;
  location: string;
  recurrence: string | null;
  startTime: Date;
  endTime: Date;
  subject: string;
};
export default Event;