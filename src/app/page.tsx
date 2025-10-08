"use client";

import { useState, useEffect, useCallback } from "react";
import Calendar from "@/components/calendar/Calendar";
import SubjectsBox from "../components/subjectsBox/SubjectsBox";
import Event from "@/models/event";

export default function Home() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(
    new Set()
  );
  const [selectedCourse, setSelectedCourse] = useState<string>("");

  // Fetch all events for the selected course
  useEffect(() => {
    const fetchEvents = async () => {
      if (!selectedCourse) {
        setAllEvents([]);
        setFilteredEvents([]);
        return;
      }

      try {
        const response = await fetch(`/api/CoursesEvents/${selectedCourse}`, {
          cache: "no-store",
        });



        if (!response.ok) {
          throw new Error(`Failed to fetch events: ${response.status}`);
        }

        const data = await response.json();
        const events = data.data || [];

        // Parse dates
        const parsedEvents = events.map((event: Event) => ({
          ...event,
          event_start_time: new Date(event.event_start_time),
          event_end_time: new Date(event.event_end_time),
        }));

        setAllEvents(parsedEvents);
      } catch (_error) {
        setAllEvents([]);
      }
    };

    fetchEvents();
  }, [selectedCourse]);

  // Filter events based on selected subjects
  useEffect(() => {
    if (selectedSubjects.size === 0) {
      setFilteredEvents(allEvents);
      return;
    }

    const filtered = allEvents.filter((event) =>
      selectedSubjects.has(event.subject_abbreviation)
    );

    setFilteredEvents(filtered);
  }, [allEvents, selectedSubjects]);

  // Handle subject toggle
  const handleSubjectToggle = useCallback(
    (subjectAbbreviation: string, isSelected: boolean) => {
      setSelectedSubjects((prev) => {
        const newSet = new Set(prev);
        if (isSelected) {
          newSet.add(subjectAbbreviation);
        } else {
          newSet.delete(subjectAbbreviation);
        }
        return newSet;
      });
    },
    []
  );

  // Handle course change
  const handleCourseChange = useCallback((courseAbbreviation: string) => {
    setSelectedCourse(courseAbbreviation);
    setSelectedSubjects(new Set()); // Clear selected subjects when course changes
  }, []);

  return (
    <main>
      <SubjectsBox
        onSubjectToggle={handleSubjectToggle}
        onCourseChange={handleCourseChange}
        selectedSubjects={selectedSubjects}
      />
      <Calendar events={filteredEvents} selectedDate={new Date()} />
    </main>
  );
}
