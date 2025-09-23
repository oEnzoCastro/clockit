"use client";

import React from "react";
import Calendar from "./Calendar";
import Event from "../../models/event";

// Example usage of the Calendar component
export default function CalendarExample() {
  // Sample events data
  const sampleEvents: Event[] = [
    {
      id: "1",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 1, 9, 0),
      endTime: new Date(0, 0, 1, 13, 30),
      subject: "Engenharia de Software 1",
    },
    {
      id: "2",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 1, 10, 0),
      endTime: new Date(0, 0, 1, 15, 0),
      subject: "Algoritmos e Estruturas de Dados 1",
    },
    {
      id: "3",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 1, 14, 0),
      endTime: new Date(0, 0, 1, 17, 0),
      subject: "Engenharia de Software 1",
    },
    {
      id: "4",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 2, 13, 0),
      endTime: new Date(0, 0, 2, 17, 0),
      subject: "Algoritmos e Estruturas de Dados 2",
    },
    {
      id: "5",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 3, 10, 0),
      endTime: new Date(0, 0, 3, 12, 0),
      subject: "Algoritmos e Estruturas de Dados 1",
    },
    {
      id: "6",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 3, 9, 0),
      endTime: new Date(0, 0, 3, 13, 0),
      subject: "Arquitetura de Computadores 1",
    },
    {
      id: "7",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 3, 14, 0),
      endTime: new Date(0, 0, 3, 16, 0),
      subject: "Algoritmos e Estruturas de Dados 1",
    },
    {
      id: "8",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 4, 14, 0),
      endTime: new Date(0, 0, 4, 16, 0),
      subject: "Algoritmos e Estruturas de Dados 1",
    },
    {
      id: "9",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 5, 9, 0),
      endTime: new Date(0, 0, 5, 12, 0),
      subject: "Algoritmos e Estruturas de Dados 2",
    },
    {
      id: "10",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 5, 9, 0),
      endTime: new Date(0, 0, 5, 13, 0),
      subject: "Algoritmos e Estruturas de Dados 1",
    },
    {
      id: "11",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 5, 11, 0),
      endTime: new Date(0, 0, 5, 13, 0),
      subject: "Engenharia de Software 1",
    },
    {
      id: "12",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 5, 14, 0),
      endTime: new Date(0, 0, 5, 16, 0),
      subject: "Algoritmos e Estruturas de Dados 1",
    },
    {
      id: "13",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 5, 14, 0),
      endTime: new Date(0, 0, 5, 17, 0),
      subject: "Engenharia de Software 1",
    },
    {
      id: "14",
      location: "Sala 1102 Prédio 4",
      recurrence: "null",
      startTime: new Date(0, 0, 5, 13, 0),
      endTime: new Date(0, 0, 5, 17, 0),
      subject: "Arquitetura de Computadores 1",
    },
  ];

  return (
    <div style={{ padding: "20px" }}>
      <Calendar events={sampleEvents} />
    </div>
  );
}
