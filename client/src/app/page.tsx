import WeeklyCalendar from "../components/calendar/WeeklyCalendar";
import Event from "@/models/event";

export default async function Home() {
  // Simulação de chamada à API para obter eventos
  let events: Event[] = [];

  try {
    const res = await fetch("http://localhost:3000/api/events");
    const data = await res.json();

    // Validate that data is an array
    if (Array.isArray(data)) {
      events = data;
    } else {
      console.error("API did not return an array:", data);
      events = []; // Fallback to mock data
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
    events = []; // Fallback to mock data
  }

  return (
    <main>
      <WeeklyCalendar events={events} />
    </main>
  );
}
