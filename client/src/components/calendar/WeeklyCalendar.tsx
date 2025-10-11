"use client";

import React, { useState, useRef, useEffect } from "react";
import Event from "@/models/event";
import "./WeeklyCalendar.css";

interface EventDetailPosition {
  x: number;
  y: number;
  event: ProcessedEvent | MergedEvent;
}

const COLOR_PALETTE = [
  "#0173B2", // Blue
  "#DE8F05", // Orange
  "#029E73", // Green
  "#CC78BC", // Pink
  "#CA9161", // Brown
  "#FBAFE4", // Light Pink
  "#949494", // Gray
  "#ECE133", // Yellow
  "#56B4E9", // Light Blue
  "#E69F00", // Dark Orange
  "#F0E442", // Bright Yellow
  "#009E73", // Teal Green
  "#0072B2", // Dark Blue
  "#D55E00", // Red Orange
  "#CC79A7", // Mauve
  "#000000", // Black
  "#8B4513", // Saddle Brown
  "#4B0082", // Indigo
  "#2E8B57", // Sea Green
  "#B22222", // Fire Brick
  "#DAA520", // Golden Rod
  "#6495ED", // Cornflower Blue
  "#DC143C", // Crimson
  "#228B22", // Forest Green
  "#FF6347", // Tomato
  "#4682B4", // Steel Blue
  "#D2691E", // Chocolate
  "#9370DB", // Medium Purple
  "#32CD32", // Lime Green
  "#FF4500", // Orange Red
];

const LIGHT_COLOR_INDICES = [5, 7, 8, 10, 11]; // Light Pink, Yellow, Light Blue, Bright Yellow, Teal Green
const PRIME_OFFSET = 7;
const HOUR_HEIGHT = 40;
const GAP_PERCENTAGE = 0;

interface ProcessedEvent extends Event {
  displayDate: Date;
  colorIndex: number;
}

interface MergedEvent {
  events: ProcessedEvent[];
  startTime: Date;
  endTime: Date;
  theme: string;
  themeAbbreviation: string;
  count: number;
  colorIndex: number;
}

interface DayColumn {
  date: Date;
  events: (ProcessedEvent | MergedEvent)[];
}

interface WeeklyCalendarProps {
  events: Event[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ events }) => {
  const [currentWeekStart, setCurrentWeekStart] = useState<Date>(
    getMonday(new Date())
  );
  const [selectedEventDetail, setSelectedEventDetail] =
    useState<EventDetailPosition | null>(null);
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (calendarRef.current) {
      calendarRef.current.scrollTop = 7 * HOUR_HEIGHT;
    }
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as HTMLElement;
      if (
        selectedEventDetail &&
        !target.closest(".event-detail-panel") &&
        !target.closest(".event")
      ) {
        setSelectedEventDetail(null);
      }
    }

    if (selectedEventDetail) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [selectedEventDetail]);

  function getMonday(date: Date): Date {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  }

  function formatDate(date: Date): string {
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    });
  }

  function formatTime(date: Date): string {
    return date.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }

  function getDayName(date: Date): string {
    return date
      .toLocaleDateString("pt-BR", { weekday: "short" })
      .replace(".", "");
  }

  function isToday(date: Date): boolean {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  }

  function isSameDay(date1: Date, date2: Date): boolean {
    return date1.toDateString() === date2.toDateString();
  }

  function generateStringHash(str: string): number {
    let hash = 5381;
    for (let i = 0; i < str.length; i++) {
      hash = (hash << 5) + hash + str.charCodeAt(i);
    }
    return Math.abs(hash);
  }

  function getEventIdentifier(event: Event): string {
    return event.event_title;
  }

  function getOptimalColorIndex(
    eventId: string,
    existingColors: Set<number>
  ): number {
    const hash = generateStringHash(eventId);
    const paletteSize = COLOR_PALETTE.length;

    let colorIndex = hash % paletteSize;
    let attempts = 0;

    while (existingColors.has(colorIndex) && attempts < paletteSize) {
      colorIndex = (colorIndex + PRIME_OFFSET) % paletteSize;
      attempts++;
    }

    if (attempts === paletteSize) {
      colorIndex = hash % paletteSize;
    }

    return colorIndex;
  }

  function getTextColor(colorIndex: number): string {
    return LIGHT_COLOR_INDICES.includes(colorIndex) ? "#000000" : "#ffffff";
  }

  function processEvents(): DayColumn[] {
    const weekDays: DayColumn[] = [];

    for (let i = 0; i < 7; i++) {
      const date = new Date(currentWeekStart);
      date.setDate(date.getDate() + i);
      weekDays.push({ date, events: [] });
    }

    const eventColorMap = new Map<string, number>();
    const usedColors = new Set<number>();

    const uniqueEvents = new Map<string, Event>();
    events.forEach((event) => {
      const eventId = getEventIdentifier(event);
      if (!uniqueEvents.has(eventId)) {
        uniqueEvents.set(eventId, event);
      }
    });

    Array.from(uniqueEvents.entries())
      .sort(([idA], [idB]) => idA.localeCompare(idB))
      .forEach(([eventId, _]) => {
        if (!eventColorMap.has(eventId)) {
          const colorIndex = getOptimalColorIndex(eventId, usedColors);
          eventColorMap.set(eventId, colorIndex);
          usedColors.add(colorIndex);
        }
      });

    events.forEach((event) => {
      const eventId = getEventIdentifier(event);
      const eventColorIndex = eventColorMap.get(eventId)!;

      if (event.event_recurrence === null) {
        const targetDay = weekDays.find((day) =>
          isSameDay(day.date, new Date(event.event_start_date))
        );

        if (targetDay) {
          targetDay.events.push({
            ...event,
            displayDate: new Date(event.event_start_date),
            colorIndex: eventColorIndex,
          });
        }
      } else {
        const originalDate = new Date(event.event_start_date);
        const targetDayOfWeek = originalDate.getDay();

        weekDays.forEach((day) => {
          if (day.date.getDay() === targetDayOfWeek) {
            const eventStart = new Date(day.date);
            eventStart.setHours(
              originalDate.getHours(),
              originalDate.getMinutes(),
              0,
              0
            );

            const eventEnd = new Date(day.date);
            const endDate = new Date(event.event_end_date);
            eventEnd.setHours(endDate.getHours(), endDate.getMinutes(), 0, 0);

            day.events.push({
              ...event,
              displayDate: eventStart,
              colorIndex: eventColorIndex,
              event_start_date: eventStart,
              event_end_date: eventEnd,
            });
          }
        });
      }
    });

    weekDays.forEach((day) => {
      const mergedEvents: (ProcessedEvent | MergedEvent)[] = [];
      const processedIndices = new Set<number>();

      day.events.forEach((event, index) => {
        if (processedIndices.has(index) || isMergedEvent(event)) return;

        const overlappingEvents = day.events.filter(
          (e, i): e is ProcessedEvent =>
            i !== index &&
            !processedIndices.has(i) &&
            !isMergedEvent(e) &&
            e.event_title === event.event_title &&
            doEventsOverlap(event, e)
        );

        if (overlappingEvents.length > 0) {
          const allEventsToMerge: ProcessedEvent[] = [
            event,
            ...overlappingEvents,
          ];
          const startTimes = allEventsToMerge.map((e) =>
            new Date(e.event_start_date).getTime()
          );
          const endTimes = allEventsToMerge.map((e) =>
            new Date(e.event_end_date).getTime()
          );

          mergedEvents.push({
            events: allEventsToMerge,
            startTime: new Date(Math.min(...startTimes)),
            endTime: new Date(Math.max(...endTimes)),
            theme: event.theme_name,
            themeAbbreviation: event.theme_abbreviation,
            count: allEventsToMerge.length,
            colorIndex: event.colorIndex,
          });

          overlappingEvents.forEach((e) => {
            const idx = day.events.indexOf(e);
            if (idx !== -1) processedIndices.add(idx);
          });
          processedIndices.add(index);
        } else {
          mergedEvents.push(event);
          processedIndices.add(index);
        }
      });

      day.events = mergedEvents;
    });

    return weekDays;
  }

  function doEventsOverlap(e1: ProcessedEvent, e2: ProcessedEvent): boolean {
    const start1 = new Date(e1.event_start_date).getTime();
    const end1 = new Date(e1.event_end_date).getTime();
    const start2 = new Date(e2.event_start_date).getTime();
    const end2 = new Date(e2.event_end_date).getTime();

    return start1 < end2 && start2 < end1;
  }

  function calculateDayLayout(dayEvents: (ProcessedEvent | MergedEvent)[]) {
    // Ordenar eventos por horário de início, depois por horário de fim
    const sortedEvents = [...dayEvents].sort((a, b) => {
      const startA = isMergedEvent(a)
        ? a.startTime.getTime()
        : new Date(a.event_start_date).getTime();
      const startB = isMergedEvent(b)
        ? b.startTime.getTime()
        : new Date(b.event_start_date).getTime();

      if (startA !== startB) return startA - startB;

      const endA = isMergedEvent(a)
        ? a.endTime.getTime()
        : new Date(a.event_end_date).getTime();
      const endB = isMergedEvent(b)
        ? b.endTime.getTime()
        : new Date(b.event_end_date).getTime();

      return endA - endB;
    });

    // Criar layouts com informações de coluna
    const eventLayouts = sortedEvents.map((event, idx) => {
      const startDate = isMergedEvent(event)
        ? event.startTime
        : new Date(event.event_start_date);
      const endDate = isMergedEvent(event)
        ? event.endTime
        : new Date(event.event_end_date);

      return {
        originalIndex: dayEvents.indexOf(event),
        event,
        start: startDate.getTime(),
        end: endDate.getTime(),
        startHour: startDate.getHours() + startDate.getMinutes() / 60,
        endHour: endDate.getHours() + endDate.getMinutes() / 60,
        column: 0,
        totalColumns: 1,
      };
    });

    // Agrupar eventos sobrepostos
    const overlapGroups: number[][] = [];

    for (let i = 0; i < eventLayouts.length; i++) {
      const currentEvent = eventLayouts[i];
      let groupFound = false;

      // Verificar se o evento atual se sobrepõe com algum grupo existente
      for (
        let groupIndex = 0;
        groupIndex < overlapGroups.length;
        groupIndex++
      ) {
        const group = overlapGroups[groupIndex];

        // Verificar se há sobreposição com qualquer evento do grupo
        const overlapsWithGroup = group.some((eventIndex) => {
          const groupEvent = eventLayouts[eventIndex];
          return (
            currentEvent.start < groupEvent.end &&
            currentEvent.end > groupEvent.start
          );
        });

        if (overlapsWithGroup) {
          group.push(i);
          groupFound = true;
          break;
        }
      }

      // Se não encontrou grupo, criar novo
      if (!groupFound) {
        overlapGroups.push([i]);
      }
    }

    // Atribuir colunas dentro de cada grupo
    overlapGroups.forEach((group) => {
      if (group.length === 1) {
        eventLayouts[group[0]].column = 0;
        eventLayouts[group[0]].totalColumns = 1;
        return;
      }

      const groupEvents = group
        .map((i) => ({
          index: i,
          layout: eventLayouts[i],
        }))
        .sort((a, b) => a.layout.start - b.layout.start);

      const columnAssignments: number[] = new Array(group.length).fill(-1);

      groupEvents.forEach((eventInfo, eventIdx) => {
        const { index: originalIndex, layout } = eventInfo;

        let column = 0;
        let columnAvailable = false;

        while (!columnAvailable && column < group.length) {
          columnAvailable = true;

          for (let otherIdx = 0; otherIdx < eventIdx; otherIdx++) {
            const otherEventInfo = groupEvents[otherIdx];
            const otherColumn = columnAssignments[otherEventInfo.index];

            if (otherColumn === column) {
              if (
                layout.start < otherEventInfo.layout.end &&
                layout.end > otherEventInfo.layout.start
              ) {
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

      const maxColumn = Math.max(...group.map((i) => columnAssignments[i]));
      const totalColumns = maxColumn + 1;

      group.forEach((i) => {
        eventLayouts[i].totalColumns = totalColumns;
      });
    });

    const finalLayouts = dayEvents.map((_, originalIndex) => {
      const layout = eventLayouts.find(
        (l) => l.originalIndex === originalIndex
      )!;

      const top = layout.startHour * HOUR_HEIGHT;
      const height = (layout.endHour - layout.startHour) * HOUR_HEIGHT;

      const availableWidth = 100 - GAP_PERCENTAGE * (layout.totalColumns - 1);
      const columnWidth = availableWidth / layout.totalColumns;
      const leftPosition = layout.column * (columnWidth + GAP_PERCENTAGE);

      return {
        top,
        height,
        left: leftPosition + 0.5,
        width: Math.max(columnWidth - 1, 8),
        column: layout.column,
        totalColumns: layout.totalColumns,
      };
    });

    return finalLayouts;
  }

  function isMergedEvent(
    event: ProcessedEvent | MergedEvent
  ): event is MergedEvent {
    return "count" in event;
  }

  function handleEventClick(
    event: ProcessedEvent | MergedEvent,
    mouseEvent: React.MouseEvent<HTMLDivElement>
  ): void {
    const rect = mouseEvent.currentTarget.getBoundingClientRect();
    const containerRect = calendarRef.current?.getBoundingClientRect();

    if (!containerRect) return;

    const panelWidth = 350; // max-width from CSS
    const panelHeight = 300; // estimated height
    const spacing = 10;

    // Calculate initial position to the right of the event
    let x = rect.right - containerRect.left + spacing;
    let y = rect.top - containerRect.top;

    // Check if panel would overflow horizontally
    if (x + panelWidth > containerRect.width) {
      // Position to the left of the event instead
      x = rect.left - containerRect.left - panelWidth - spacing;

      // If still overflows, position within bounds
      if (x < 0) {
        x = containerRect.width - panelWidth - spacing;
      }
    }

    // Check if panel would overflow vertically
    if (y + panelHeight > containerRect.height) {
      // Position above the event or at bottom of container
      y = Math.max(spacing, containerRect.height - panelHeight - spacing);
    }

    // Ensure minimum spacing from top
    y = Math.max(spacing, y);

    setSelectedEventDetail({
      x,
      y,
      event,
    });
  }

  function closeEventDetail(): void {
    setSelectedEventDetail(null);
  }

  function navigateWeek(direction: "prev" | "next"): void {
    const newWeek = new Date(currentWeekStart);
    const daysToAdd = direction === "next" ? 7 : -7;
    newWeek.setDate(newWeek.getDate() + daysToAdd);
    setCurrentWeekStart(newWeek);
  }

  function goToToday(): void {
    setCurrentWeekStart(getMonday(new Date()));
  }

  const weekDays = processEvents();
  const weekEnd = new Date(currentWeekStart);
  weekEnd.setDate(weekEnd.getDate() + 6);

  return (
    <div className="weekly-calendar">
      <div className="calendar-header">
        <div className="header-content">
          <div className="week-info">
            <h2 className="week-range">
              {formatDate(currentWeekStart)} - {formatDate(weekEnd)}
            </h2>
            <div className="week-year">
              {currentWeekStart.toLocaleDateString("pt-BR", {
                month: "long",
                year: "numeric",
              })}
            </div>
          </div>

          <div className="navigation">
            <button
              onClick={() => navigateWeek("prev")}
              className="nav-button"
              title="Semana Anterior"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" />
              </svg>
            </button>
            <button onClick={goToToday} className="today-button">
              Hoje
            </button>
            <button
              onClick={() => navigateWeek("next")}
              className="nav-button"
              title="Próxima Semana"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="calendar-wrapper">
        <div className="sticky-headers">
          <div className="time-column-header"></div>
          {weekDays.map((day, dayIndex) => (
            <div
              key={dayIndex}
              className={`day-header-sticky ${
                isToday(day.date) ? "today" : ""
              }`}
            >
              <div className="day-name">{getDayName(day.date)}</div>
              <div
                className={`day-number ${
                  isToday(day.date) ? "today-number" : ""
                }`}
              >
                {day.date.getDate()}
              </div>
            </div>
          ))}
        </div>

        <div className="calendar-container" ref={calendarRef}>
          <div className="calendar-grid">
            <div className="time-column">
              {Array.from({ length: 24 }, (_, i) => (
                <div key={i} className="time-slot">
                  {i.toString().padStart(2, "0")}:00
                </div>
              ))}
            </div>

            {weekDays.map((day, dayIndex) => {
              const layouts = calculateDayLayout(day.events);

              return (
                <div key={dayIndex} className="day-column">
                  <div className="day-content">
                    {Array.from({ length: 24 }, (_, i) => (
                      <div key={i} className="hour-line"></div>
                    ))}

                    {day.events.map((event, eventIndex) => {
                      const position = layouts[eventIndex];
                      const isMerged = isMergedEvent(event);
                      const colorIndex = event.colorIndex;
                      const isRecurring = isMerged
                        ? event.events.some((e) => e.event_recurrence !== null)
                        : !isMerged && event.event_recurrence !== null;

                      return (
                        <div
                          key={eventIndex}
                          className={`event ${
                            isRecurring ? "recurring" : "single"
                          } ${position.width < 50 ? "compressed" : ""}`}
                          style={{
                            top: `${position.top}px`,
                            height: `${position.height}px`,
                            left: `${position.left}%`,
                            width: `${position.width}%`,
                            backgroundColor: COLOR_PALETTE[colorIndex],
                            color: "#fff",
                          }}
                          onClick={(e) => handleEventClick(event, e)}
                        >
                          <div className="event-content">
                            {isMerged ? (
                              <>
                                <div className="event-title">
                                  {event.events[0].event_title} ({event.count})
                                </div>
                                <div className="event-time">
                                  {formatTime(event.startTime)} -{" "}
                                  {formatTime(event.endTime)}
                                </div>
                                {position.width >= 50 && (
                                  <div className="event-theme">
                                    {event.themeAbbreviation}
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                <div className="event-title">
                                  {event.event_title}
                                </div>
                                {position.width >= 50 && (
                                  <>
                                    <div className="event-time">
                                      {formatTime(
                                        new Date(event.event_start_date)
                                      )}{" "}
                                      -{" "}
                                      {formatTime(
                                        new Date(event.event_end_date)
                                      )}
                                    </div>
                                    <div className="event-theme">
                                      {event.theme_abbreviation}
                                    </div>
                                  </>
                                )}
                                {position.width < 50 && (
                                  <div className="event-time-compact">
                                    {formatTime(
                                      new Date(event.event_start_date)
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {selectedEventDetail && (
          <div
            className="event-detail-panel"
            style={{
              position: "absolute",
              left: `${selectedEventDetail.x}px`,
              top: `${selectedEventDetail.y}px`,
              zIndex: 1000,
            }}
          >
            <div className="event-detail-content">
              <div className="event-detail-header">
                <h3>
                  {isMergedEvent(selectedEventDetail.event)
                    ? selectedEventDetail.event.events[0].event_title
                    : selectedEventDetail.event.event_title}
                </h3>
                <button
                  className="close-button"
                  onClick={closeEventDetail}
                  aria-label="Close"
                >
                  ×
                </button>
              </div>

              <div className="event-detail-body">
                {isMergedEvent(selectedEventDetail.event) ? (
                  <>
                    <p>
                      <strong>Eventos:</strong>{" "}
                      {selectedEventDetail.event.count}
                    </p>
                    <p>
                      <strong>Horário:</strong>{" "}
                      {formatTime(selectedEventDetail.event.startTime)} -{" "}
                      {formatTime(selectedEventDetail.event.endTime)}
                    </p>
                    <p>
                      <strong>Tema:</strong> {selectedEventDetail.event.theme}
                    </p>
                    <div className="merged-events-list">
                      {selectedEventDetail.event.events.map((evt, idx) => (
                        <div key={idx} className="merged-event-item">
                          <p>
                            <strong>Local:</strong> {evt.event_location}
                          </p>
                          <p>
                            <strong>Agente:</strong> {evt.agent_name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <p>
                      <strong>Horário:</strong>{" "}
                      {formatTime(
                        new Date(selectedEventDetail.event.event_start_date)
                      )}{" "}
                      -{" "}
                      {formatTime(
                        new Date(selectedEventDetail.event.event_end_date)
                      )}
                    </p>
                    <p>
                      <strong>Local:</strong>{" "}
                      {selectedEventDetail.event.event_location}
                    </p>
                    <p>
                      <strong>Agente:</strong>{" "}
                      {selectedEventDetail.event.agent_name}
                    </p>
                    <p>
                      <strong>Tema:</strong>{" "}
                      {selectedEventDetail.event.theme_name}
                    </p>
                    <p>
                      <strong>Instituto:</strong>{" "}
                      {selectedEventDetail.event.institute_name}
                    </p>
                    {selectedEventDetail.event.event_description && (
                      <p>
                        <strong>Descrição:</strong>{" "}
                        {selectedEventDetail.event.event_description}
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WeeklyCalendar;
