# Props Refactoring - WeeklyCalendar

## 📝 Summary

Refactored the `WeeklyCalendar` component to accept events as props instead of using hardcoded mock data inside the component.

## ✨ Changes Made

### 1. **Component Signature Updated**

**Before:**
```tsx
const WeeklyCalendar: React.FC = () => {
  // Mock data inside component
  const mockEvents: Event[] = [ ... ];
  // ...
}
```

**After:**
```tsx
interface WeeklyCalendarProps {
  events: Event[];
}

const WeeklyCalendar: React.FC<WeeklyCalendarProps> = ({ events }) => {
  // Events passed as prop
  // ...
}
```

### 2. **Props Interface Added**

```typescript
interface WeeklyCalendarProps {
  events: Event[];
}
```

- **`events`**: Array of `Event` objects to be displayed in the calendar
- Type-safe with full TypeScript support
- Required prop (not optional)

### 3. **Mock Data Moved to Page Component**

**File: `src/app/page.tsx`**

```tsx
"use client";

import WeeklyCalendar from "../components/calendar/WeeklyCalendar";
import Event from "@/models/event";

export default function Home() {
  const mockEvents: Event[] = [
    // All 5 mock events moved here
  ];

  return (
    <main>
      <WeeklyCalendar events={mockEvents} />
    </main>
  );
}
```

### 4. **Internal References Updated**

Changed all internal references from `mockEvents` to `events`:

```tsx
// Before
mockEvents.forEach((event) => { ... });

// After
events.forEach((event) => { ... });
```

## 🎯 Benefits

### ✅ **Better Separation of Concerns**
- Component focused on presentation logic
- Data management in parent component
- Clear boundary between data and UI

### ✅ **Reusability**
- Component can now be used with any event data
- Can be used multiple times with different event sets
- Easy to integrate with API data

### ✅ **Testability**
- Mock data can be easily passed during testing
- Component behavior can be tested with different datasets
- Props make dependencies explicit

### ✅ **Type Safety**
- Full TypeScript support with `WeeklyCalendarProps`
- IDE autocomplete for props
- Compile-time error checking

### ✅ **Flexibility**
- Data can come from any source (API, state management, etc.)
- Easy to implement filtering/sorting in parent component
- Parent controls data lifecycle

## 📚 Usage Examples

### Example 1: Basic Usage (Current)
```tsx
export default function Home() {
  const mockEvents: Event[] = [ /* mock data */ ];
  
  return <WeeklyCalendar events={mockEvents} />;
}
```

### Example 2: With API Data
```tsx
"use client";

import { useState, useEffect } from "react";
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";
import Event from "@/models/event";

export default function CalendarPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => {
        setEvents(data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Carregando...</div>;

  return <WeeklyCalendar events={events} />;
}
```

### Example 3: With Filtering
```tsx
export default function FilteredCalendar() {
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null);

  const filteredEvents = selectedTheme
    ? allEvents.filter(e => e.theme_name === selectedTheme)
    : allEvents;

  return (
    <>
      <ThemeFilter onChange={setSelectedTheme} />
      <WeeklyCalendar events={filteredEvents} />
    </>
  );
}
```

### Example 4: Multiple Calendars
```tsx
export default function MultiCalendarView() {
  const mathEvents = events.filter(e => e.theme_name === "Matemática");
  const physicsEvents = events.filter(e => e.theme_name === "Física");

  return (
    <div className="grid grid-cols-2">
      <WeeklyCalendar events={mathEvents} />
      <WeeklyCalendar events={physicsEvents} />
    </div>
  );
}
```

## 🔄 Migration Guide

If you have existing code using the old version:

**Old Code:**
```tsx
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";

<WeeklyCalendar />
```

**New Code:**
```tsx
import WeeklyCalendar from "@/components/calendar/WeeklyCalendar";
import Event from "@/models/event";

const events: Event[] = [ /* your events */ ];

<WeeklyCalendar events={events} />
```

## 📋 Checklist for Future API Integration

When ready to connect to real API:

- [ ] Remove mock data from `page.tsx`
- [ ] Create API endpoint or fetch function
- [ ] Add loading state handling
- [ ] Add error state handling
- [ ] Consider using SWR or React Query for caching
- [ ] Add pagination if dealing with many events
- [ ] Implement date range filtering on API level
- [ ] Add refresh mechanism

## 🎨 Component Remains Backward Compatible

The component still:
- ✅ Handles single events (`event_recurrence: null`)
- ✅ Handles recurring events (`event_recurrence: "weekly"`)
- ✅ Merges same-theme overlapping events
- ✅ Displays overlapping events side-by-side
- ✅ Uses 15-color colorblind-accessible palette
- ✅ Shows weekly view with navigation
- ✅ Auto-scrolls to 7:00 AM
- ✅ Highlights current day

Only difference: **data now comes from props instead of being hardcoded** 🎉
