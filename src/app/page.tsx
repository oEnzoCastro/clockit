import Calendar from "@/components/calendar/Calendar";
import Event from "@/models/event";
import EventsData from "@/data/EventsData";

export default function Home() {

    const sampleEvents = EventsData;
  return (
    <div>
      <Calendar events={sampleEvents} />
    </div>
  );
}
