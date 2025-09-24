import Calendar from "@/components/calendar/Calendar";
import EventsData from "@/data/EventsData";
import SubjectsBox from "../components/subjectsBox/SubjectsBox"

export default function Home() {
  const sampleEvents = EventsData;



  return (
    <div>
      <SubjectsBox />
      <Calendar events={sampleEvents.filter(event => event.subjectAbreviation == "AEDS1")} />
    </div>
  );
}