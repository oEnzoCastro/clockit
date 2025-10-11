import WeeklyCalendar from "../components/calendar/WeeklyCalendar";
import Event from "@/models/event";

export default async function Home() {
  // Mock data para testes (substituir por dados da API)
  const mockEvents: Event[] = [
    {
      event_id: "1",
      event_title: "Aula de Matemática",
      event_description: "Cálculo I",
      event_location: "Sala 101",
      event_recurrence: null,
      event_start_date: new Date("2025-10-13T08:00:00"),
      event_end_date: new Date("2025-10-13T10:00:00"),
      agent_name: "Prof. Silva",
      theme_name: "Matemática",
      theme_abbreviation: "MAT",
      sector_name: "Exatas",
      sector_abbreviation: "EX",
      institute_name: "Instituto Central",
      group_name: "Lourdes",
    },
    {
      event_id: "2",
      event_title: "Aula de Física",
      event_description: "Mecânica Clássica",
      event_location: "Sala 102",
      event_recurrence: null,
      event_start_date: new Date("2025-10-13T08:00:00"),
      event_end_date: new Date("2025-10-13T09:30:00"),
      agent_name: "Prof. Santos",
      theme_name: "Física",
      theme_abbreviation: "FIS",
      sector_name: "Exatas",
      sector_abbreviation: "EX",
      institute_name: "Instituto Central",
      group_name: "Lourdes",
    },
    {
      event_id: "3",
      event_title: "Laboratório de Química",
      event_description: "Experimentos práticos",
      event_location: "Lab 201",
      event_recurrence: "weekly",
      event_start_date: new Date("2025-10-14T14:00:00"),
      event_end_date: new Date("2025-10-14T16:00:00"),
      agent_name: "Prof. Costa",
      theme_name: "Química",
      theme_abbreviation: "QUI",
      sector_name: "Exatas",
      sector_abbreviation: "EX",
      institute_name: "Instituto Central",
      group_name: "Lourdes",
    },
    {
      event_id: "4",
      event_title: "Aula de Programação",
      event_description: "Algoritmos avançados",
      event_location: "Lab 301",
      event_recurrence: "weekly",
      event_start_date: new Date("2025-10-15T10:00:00"),
      event_end_date: new Date("2025-10-15T12:00:00"),
      agent_name: "Prof. Lima",
      theme_name: "Computação",
      theme_abbreviation: "COMP",
      sector_name: "Tecnologia",
      sector_abbreviation: "TEC",
      institute_name: "Instituto de TI",
      group_name: "Lourdes",
    },
    {
      event_id: "5",
      event_title: "Seminário de Matemática",
      event_description: "Apresentação de trabalhos",
      event_location: "Auditório",
      event_recurrence: null,
      event_start_date: new Date("2025-10-13T08:30:00"),
      event_end_date: new Date("2025-10-13T10:30:00"),
      agent_name: "Prof. Oliveira",
      theme_name: "Matemática",
      theme_abbreviation: "MAT",
      sector_name: "Exatas",
      sector_abbreviation: "EX",
      institute_name: "Instituto Central",
      group_name: "Lourdes",
    },
  ];

  // Simulação de chamada à API para obter eventos
  const events: Event[] = await fetch("http://localhost:3000/api/events")
    .then((res) => res.json())
    .then((data) => {
      return data;
    });

  return (
    <main>
      <WeeklyCalendar events={events} />
    </main>
  );
}
