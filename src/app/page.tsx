import Calendar from "@/components/calendar/Calendar";
import EventsData from "@/data/EventsData";

export default function Home() {
  const sampleEvents = EventsData;



  return (
    <div>
      <Calendar events={sampleEvents.filter(event => event.subjectAbreviation == "AEDS1")} />
    </div>
  );
}
