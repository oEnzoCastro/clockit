"use client";

import React, { useState, useMemo, useEffect, useRef } from "react";
import Event from "../../models/event";
import EventModal from "./EventModal";
import "./Calendar.css";
import { cursorTo } from "readline";

interface CalendarProps {
  events: Event[];
  selectedDate?: Date;
  onEventClick?: (event: Event) => void;
  onTimeSlotClick?: (date: Date, hour: number) => void;
}

export default function Calendar({
  events = [],
  selectedDate = new Date(),
  onEventClick,
  onTimeSlotClick,
}: CalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(() => {
    const date = new Date(selectedDate);
    const startOfWeek = new Date(date);
    // Start from Monday (1 = Monday, 0 = Sunday)
    const dayOfWeek = date.getDay();
    const daysToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek; // If Sunday (0), go back 6 days, otherwise go to Monday
    startOfWeek.setDate(date.getDate() + daysToMonday);
    return startOfWeek;
  });

  // Modal state
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ref for the calendar grid to control scrolling
  const calendarGridRef = useRef<HTMLDivElement>(null);

  // Effect to scroll to 6 AM on initial load and week changes
  useEffect(() => {
    if (calendarGridRef.current) {
      // Calculate scroll position for 6 AM (6 * 60px per hour)
      const scrollTo6AM = 6 * 60; // 360px
      calendarGridRef.current.scrollTop = scrollTo6AM;
    }
  }, [currentWeek]);

  // Generate week days
  const weekDays = useMemo(() => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeek);
      day.setDate(currentWeek.getDate() + i);
      days.push(day);
    }
    return days;
  }, [currentWeek]);

  // Generate hours (24-hour format)
  const hours = useMemo(() => {
    return Array.from({ length: 24 }, (_, i) => i);
  }, []);

  // Navigate week
  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek);
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7));
    setCurrentWeek(newWeek);
  };

  // Filter events for current week
  const weekEvents = useMemo(() => {
    const weekStart = new Date(currentWeek);
    const weekEnd = new Date(currentWeek);
    weekEnd.setDate(weekStart.getDate() + 6);
    weekEnd.setHours(23, 59, 59, 999);

    const allEvents: Event[] = [];

    events.forEach((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      // Check if the original event falls within the current week
      const originalEventInWeek =
        (eventStart >= weekStart && eventStart <= weekEnd) ||
        (eventEnd >= weekStart && eventEnd <= weekEnd) ||
        (eventStart <= weekStart && eventEnd >= weekEnd);

      if (originalEventInWeek) {
        allEvents.push(event);
      }

      // Handle recurring events (repeat every week if recurrence is not null)
      if (
        event.recurrence &&
        event.recurrence !== "none" &&
        event.recurrence.trim() !== ""
      ) {
        const dayOfWeek = eventStart.getDay(); // 0 = Sunday, 1 = Monday, etc.

        // Generate recurring instances for the current week
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
          const currentDay = new Date(weekStart);
          currentDay.setDate(weekStart.getDate() + dayOffset);

          // Check if this day matches the original event's day of week
          // Convert to Monday-first week (Monday = 1, Sunday = 0 becomes 7)
          const originalDayOfWeek = dayOfWeek === 0 ? 7 : dayOfWeek; // Sunday becomes 7
          const currentDayOfWeek =
            currentDay.getDay() === 0 ? 7 : currentDay.getDay(); // Sunday becomes 7

          if (currentDayOfWeek === originalDayOfWeek) {
            // Don't duplicate the original event if it's already in the week
            if (currentDay.toDateString() === eventStart.toDateString()) {
              continue;
            }

            // Create recurring event instance
            const recurringStartTime = new Date(currentDay);
            recurringStartTime.setHours(
              eventStart.getHours(),
              eventStart.getMinutes(),
              eventStart.getSeconds(),
              eventStart.getMilliseconds()
            );

            const recurringEndTime = new Date(currentDay);
            recurringEndTime.setHours(
              eventEnd.getHours(),
              eventEnd.getMinutes(),
              eventEnd.getSeconds(),
              eventEnd.getMilliseconds()
            );

            const recurringEvent: Event = {
              ...event,
              id: `${event.id}-recurring-${
                currentDay.toISOString().split("T")[0]
              }`,
              startTime: recurringStartTime,
              endTime: recurringEndTime,
            };

            allEvents.push(recurringEvent);
          }
        }
      }
    });

    return allEvents;
  }, [events, currentWeek]);

  // Get events for a specific day with overlap detection
  const getEventsForDay = (day: Date) => {
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(day);
    dayEnd.setHours(23, 59, 59, 999);

    const dayEvents = weekEvents.filter((event) => {
      const eventStart = new Date(event.startTime);
      const eventEnd = new Date(event.endTime);

      return (
        (eventStart >= dayStart && eventStart <= dayEnd) ||
        (eventEnd >= dayStart && eventEnd <= dayEnd) ||
        (eventStart <= dayStart && eventEnd >= dayEnd)
      );
    });

    // Sort events by start time
    return dayEvents.sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );
  };

  // Detect overlapping events and assign columns
  const calculateEventLayout = (events: Event[]) => {
    if (events.length === 0) return [];

    // Sort events by start time
    const sortedEvents = [...events].sort(
      (a, b) => a.startTime.getTime() - b.startTime.getTime()
    );

    const eventLayouts = sortedEvents.map((event) => ({
      event,
      column: 0,
      totalColumns: 1,
    }));

    // Group overlapping events together
    const overlapGroups: number[][] = [];

    for (let i = 0; i < eventLayouts.length; i++) {
      const currentEvent = eventLayouts[i].event;
      const currentStart = currentEvent.startTime.getTime();
      const currentEnd = currentEvent.endTime.getTime();

      // Find which group this event belongs to
      let groupFound = false;

      for (
        let groupIndex = 0;
        groupIndex < overlapGroups.length;
        groupIndex++
      ) {
        const group = overlapGroups[groupIndex];

        // Check if current event overlaps with any event in this group
        const overlapsWithGroup = group.some((eventIndex) => {
          const groupEvent = eventLayouts[eventIndex].event;
          const groupStart = groupEvent.startTime.getTime();
          const groupEnd = groupEvent.endTime.getTime();

          return currentStart < groupEnd && currentEnd > groupStart;
        });

        if (overlapsWithGroup) {
          group.push(i);
          groupFound = true;
          break;
        }
      }

      // If no group found, create new group
      if (!groupFound) {
        overlapGroups.push([i]);
      }
    }

    // Assign columns within each group
    overlapGroups.forEach((group) => {
      if (group.length === 1) {
        // Single event, no overlap
        eventLayouts[group[0]].column = 0;
        eventLayouts[group[0]].totalColumns = 1;
        return;
      }

      // Multiple events in group - assign columns
      const groupEvents = group
        .map((i) => ({
          index: i,
          event: eventLayouts[i].event,
          start: eventLayouts[i].event.startTime.getTime(),
          end: eventLayouts[i].event.endTime.getTime(),
        }))
        .sort((a, b) => a.start - b.start);

      // Track which columns are occupied at each time
      const columnAssignments: number[] = new Array(group.length).fill(-1);

      groupEvents.forEach((eventInfo, eventIdx) => {
        const { index: originalIndex, start, end } = eventInfo;

        // Find the first available column
        let column = 0;
        let columnAvailable = false;

        while (!columnAvailable && column < group.length) {
          columnAvailable = true;

          // Check if this column is free during our time period
          for (let otherIdx = 0; otherIdx < eventIdx; otherIdx++) {
            const otherEventInfo = groupEvents[otherIdx];
            const otherColumn = columnAssignments[otherEventInfo.index];

            if (otherColumn === column) {
              // Check if time periods overlap
              if (start < otherEventInfo.end && end > otherEventInfo.start) {
                columnAvailable = false;
                break;
              }
            }
          }

          if (!columnAvailable) {
            column++;
          }
        }

        columnAssignments[originalIndex] = column;
        eventLayouts[originalIndex].column = column;
      });

      // Set total columns for all events in group
      const maxColumn = Math.max(...group.map((i) => columnAssignments[i]));
      const totalColumns = maxColumn + 1;

      group.forEach((i) => {
        eventLayouts[i].totalColumns = totalColumns;
      });
    });

    return eventLayouts;
  };

  // Calculate event position, height, and column layout
  const calculateEventStyle = (
    event: Event,
    day: Date,
    column: number,
    totalColumns: number
  ) => {
    const eventStart = new Date(event.startTime);
    const eventEnd = new Date(event.endTime);
    const dayStart = new Date(day);
    dayStart.setHours(0, 0, 0, 0);

    // Calculate start position (in minutes from midnight)
    const startMinutes = Math.max(
      0,
      (eventStart.getTime() - dayStart.getTime()) / (1000 * 60)
    );

    // Calculate duration (in minutes)
    const durationMinutes = Math.min(
      (eventEnd.getTime() - eventStart.getTime()) / (1000 * 60),
      1440 - startMinutes // Don't exceed 24 hours
    );

    // Convert to pixels (assuming 60px per hour)
    const top = (startMinutes / 60) * 60;
    const height = Math.max(20, (durationMinutes / 60) * 60); // Minimum 20px height (reduced from 30px)

    // Calculate width and left position for columns - make events thinner
    const gapPercentage = totalColumns > 1 ? 1.5 : 0; // Increased gap between overlapping events
    const availableWidth = 100 - gapPercentage * (totalColumns - 1); // Account for gaps
    const columnWidth = availableWidth / totalColumns;
    const leftPosition = column * (columnWidth + gapPercentage);

    // Determine text visibility based on event size
    const showTitle = height >= 25 && columnWidth >= 20;
    const showTime = height >= 45 && columnWidth >= 25;
    const showLocation = height >= 65 && columnWidth >= 30 && totalColumns <= 2;

    return {
      top: `${top}px`,
      height: `${height}px`,
      width: `${Math.max(columnWidth - 1, 8)}%`, // Minimum 8% width, subtract 1% for better spacing
      left: `${leftPosition + 0.5}%`, // Add small offset for better visual separation
      zIndex: 5 + column, // Higher z-index for later columns
      showTitle,
      showTime,
      showLocation,
    };
  };

  // Format time for display
  const formatTime = (hour: number) => {
    return hour === 0
      ? "12 AM"
      : hour < 12
      ? `${hour} AM`
      : hour === 12
      ? "12 PM"
      : `${hour - 12} PM`;
  };

  // Format date for header
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  };

  // Check if date is today
  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Get current time indicator position
  const getCurrentTimeIndicator = () => {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const totalMinutes = hours * 60 + minutes;
    const topPosition = (totalMinutes / 60) * 60; // Convert to pixels

    return {
      top: `${topPosition}px`,
      display: "block",
    };
  };

  // Function to scroll to 6 AM
  const scrollTo6AM = () => {
    if (calendarGridRef.current) {
      const scrollTo6AM = 6 * 60; // 360px
      calendarGridRef.current.scrollTop = scrollTo6AM;
    }
  };

  // Handle event click
  const handleEventClick = (event: Event) => {
    setSelectedEvent(event);
    setIsModalOpen(true);
    // Call the optional onEventClick prop if provided
    onEventClick?.(event);
  };

  // Handle modal close
  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  // Function to generate consistent color for subjects
  const getSubjectColor = (subject: string, dayEvents: Event[]) => {
    // Get unique subjects for this day
    const uniqueSubjects = Array.from(
      new Set(dayEvents.map((event) => event.subject))
    );

    // Find the index of this subject in the unique subjects array
    const subjectIndex = uniqueSubjects.indexOf(subject);

    // For consistency across days, we can also use a hash of the subject name
    // This ensures the same subject gets similar colors even on different days
    const subjectHash = subject.split("").reduce((hash, char) => {
      return ((hash << 5) - hash + char.charCodeAt(0)) & 0xffffffff;
    }, 0);

    // Use both index and hash to distribute colors better
    const colorIndex = Math.abs(subjectHash) % 20; // We now have 20 color variations

    // Define color classes based on index
    const colorClasses = [
      "subject-color-0", // Indigo-Purple
      "subject-color-1", // Emerald
      "subject-color-2", // Red
      "subject-color-3", // Amber
      "subject-color-4", // Pink-Purple
      "subject-color-5", // Sky Blue
      "subject-color-6", // Hot Pink
      "subject-color-7", // Violet
      "subject-color-8", // Orange-Brown
      "subject-color-9", // Cyan-Dark
      "subject-color-10", // Purple
      "subject-color-11", // Green
      "subject-color-12", // Yellow
      "subject-color-13", // Orange-Red
      "subject-color-14", // Purple-Bright
      "subject-color-15", // Cyan
      "subject-color-16", // Rose
      "subject-color-17", // Lime
      "subject-color-18", // Teal
      "subject-color-19", // Amber-Bright
    ];

    return colorClasses[colorIndex];
  };

  return (
    <div className="calendar-container">
      {/* Header */}
      <div className="calendar-header">
        <button className="nav-button" onClick={() => navigateWeek("prev")}>
          &#8249;
        </button>

        <h2
          className="week-title"
          style={{ cursor: "pointer" }}
          onClick={scrollTo6AM}
        >
          {weekDays[0].toLocaleDateString("pt-BR", {
            month: "long",
            year: "numeric",
          })}
        </h2>

        <button className="nav-button" onClick={() => navigateWeek("next")}>
          &#8250;
        </button>
      </div>

      {/* Days header */}
      <div className="days-header">
        <div className="time-column-header"></div>
        {weekDays.map((day, index) => (
          <div
            key={index}
            className={`day-header ${isToday(day) ? "today" : ""}`}
            onClick={scrollTo6AM}
            style={{ cursor: "pointer" }}
          >
            <div className="day-name">
              {day.toLocaleDateString("en-US", { weekday: "short" })}
            </div>
            <div className="day-number">{day.getDate()}</div>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="calendar-grid" ref={calendarGridRef}>
        {/* Time column */}
        <div className="time-column">
          {hours.map((hour) => (
            <div key={hour} className="time-slot">
              <span className="time-label">{formatTime(hour)}</span>
            </div>
          ))}
        </div>

        {/* Days columns */}
        {weekDays.map((day, dayIndex) => (
          <div key={dayIndex} className="day-column">
            {/* Hour slots */}
            {hours.map((hour) => (
              <div
                key={hour}
                className="hour-slot"
                onClick={() => onTimeSlotClick?.(day, hour)}
              />
            ))}

            {/* Events overlay */}
            <div className="events-overlay">
              {/* Current time indicator for today */}
              {isToday(day) && (
                <div
                  className="current-time-line"
                  style={getCurrentTimeIndicator()}
                >
                  <div className="current-time-dot"></div>
                </div>
              )}

              {(() => {
                const dayEvents = getEventsForDay(day);
                const eventLayouts = calculateEventLayout(dayEvents);

                return eventLayouts.map((layout, eventIndex) => {
                  const { event, column, totalColumns } = layout;
                  const style = calculateEventStyle(
                    event,
                    day,
                    column,
                    totalColumns
                  );

                  // Get color class based on subject
                  const subjectColorClass = getSubjectColor(
                    event.subject,
                    dayEvents
                  );

                  return (
                    <div
                      key={`${event.id}-${eventIndex}`}
                      className={`event ${subjectColorClass} ${
                        style.showTitle ? "" : "no-text"
                      }`}
                      style={{
                        top: style.top,
                        height: style.height,
                        width: style.width,
                        left: style.left,
                        zIndex: style.zIndex,
                      }}
                      onClick={() => handleEventClick(event)}
                      title={`${
                        event.subject
                      }\n${event.startTime.toLocaleTimeString()} - ${event.endTime.toLocaleTimeString()}`}
                    >
                      {style.showTitle && (
                        <div className="event-title">{event.subject}</div>
                      )}
                      {style.showTime && (
                        <div className="event-time">
                          {event.startTime.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}{" "}
                          -{" "}
                          {event.endTime.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </div>
                      )}
                      {style.showLocation && event.location && (
                        <div className="event-location">{event.location}</div>
                      )}
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        ))}
      </div>

      {/* Event Modal */}
      <EventModal
        event={selectedEvent}
        isOpen={isModalOpen}
        onClose={handleModalClose}
      />
    </div>
  );
}
