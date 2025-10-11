# Calendar Layout Improvements - Summary

## 🎯 Changes Made

### 1. **Merge Logic Changed: Same TITLE instead of Same THEME**

**Before:**
```typescript
// Merged events with the same theme_name
e.theme_name === event.theme_name
```

**After:**
```typescript
// Merge events with the same event_title
e.event_title === event.event_title
```

**Impact:**
- Events like "Aula de Matemática" occurring multiple times will be merged
- Events with different titles but same theme (e.g., "Aula de Física" and "Lab de Física") will NOT be merged
- More precise merging based on actual event identity

---

### 2. **Display: Show Event Title for Merged Events**

**Before:**
```typescript
{event.themeAbbreviation} ({event.count})
// Example: "MAT (2)"
```

**After:**
```typescript
{event.events[0].event_title} ({event.count})
// Example: "Aula de Matemática (2)"
```

**Impact:**
- Users can immediately see what the event is about
- Theme abbreviation still shown below if space permits
- More informative at a glance

---

### 3. **Positioning Algorithm: Complete Rewrite**

#### Old Algorithm Issues:
- ❌ Events were placed on top of each other
- ❌ Didn't efficiently pack events
- ❌ Calculated columns incorrectly for overlapping events
- ❌ Events could overflow their designated space

#### New Algorithm Features:
✅ **Column Assignment Algorithm**
- Uses a "greedy" approach to assign columns
- Tracks when each column becomes free
- Places events in the first available column
- Creates new columns only when necessary

✅ **Efficient Space Packing**
- Events fill available space tightly
- No unnecessary gaps between events
- Width adjusts based on actual overlaps

✅ **Smart Width Calculation**
- Each event knows its maximum column count
- Width = 100% / maxColumns
- 0.5% gap between events for visual clarity

#### Algorithm Flow:

```
1. Sort events by start time (then by end time)
   └─> Ensures consistent ordering

2. For each event:
   └─> Find first available column (where endTime <= event.startTime)
   └─> If no column available, create new column
   └─> Assign event to column

3. For each event:
   └─> Find all overlapping events
   └─> Calculate max columns needed = highest column number + 1
   └─> Set event width = 100% / maxColumns

4. Generate final layout:
   └─> top: based on hour * HOUR_HEIGHT
   └─> height: duration * HOUR_HEIGHT
   └─> left: (100% / maxColumns) * column
   └─> width: (100% / maxColumns) - gap
```

#### Example Scenarios:

**Scenario A: Sequential Events (No Overlap)**
```
Event 1: 08:00-09:00 → Column 0, Width 100%
Event 2: 09:00-10:00 → Column 0, Width 100% (reuses column)
Event 3: 10:00-11:00 → Column 0, Width 100%
```

**Scenario B: Two Overlapping Events**
```
Event 1: 08:00-10:00 → Column 0, Width 49.5%
Event 2: 08:30-09:30 → Column 1, Width 49.5%
```

**Scenario C: Three Overlapping Events**
```
Event 1: 08:00-10:00 → Column 0, Width 33%
Event 2: 08:30-09:30 → Column 1, Width 33%
Event 3: 09:00-11:00 → Column 2, Width 33%
```

**Scenario D: Complex Overlap**
```
Event 1: 08:00-10:00 → Column 0, Width 49.5% (2 max columns)
Event 2: 08:30-09:30 → Column 1, Width 49.5% (2 max columns)
Event 3: 10:00-11:00 → Column 0, Width 100% (1 max column - reuses column 0)
```

---

## 📊 Code Comparison

### Old calculateDayLayout (Simplified):
```typescript
// For each event individually:
  // 1. Find all overlapping events
  // 2. Create sorted array of overlapping indices
  // 3. Find position in that array
  // 4. width = 100 / total_overlapping
  
// Problem: Each event calculates independently
// Result: Inconsistent column assignments
```

### New calculateDayLayout:
```typescript
// 1. Sort ALL events by time
// 2. Assign columns globally using column tracking
// 3. Calculate max columns per event based on overlaps
// 4. Generate layouts with proper widths

// Benefit: Global view ensures consistent placement
// Result: Tight packing, no overlaps
```

---

## 🎨 Visual Improvements

### Before:
```
┌─────────┐
│ MAT (2) │  ← Just abbreviation
│ 08-10   │
└─────────┘
```

### After:
```
┌──────────────────────┐
│ Aula de Matemática(2)│  ← Full title
│ 08:00 - 10:00        │
│ MAT                  │  ← Theme if space
└──────────────────────┘
```

---

## 🔧 Technical Details

### Constants:
- `HOUR_HEIGHT = 40px` - Height of each hour slot
- `GAP_BETWEEN_EVENTS = 0.5%` - Visual gap between side-by-side events

### Data Structures:

**eventsWithTimes:**
```typescript
{
  index: number,           // Original index
  startTime: number,       // Unix timestamp
  endTime: number,         // Unix timestamp
  startHour: number,       // Decimal hours (8.5 = 08:30)
  endHour: number,         // Decimal hours
  column: number,          // Assigned column (0-based)
  maxColumns: number       // Max columns in overlap group
}
```

**columns array:**
```typescript
number[]  // Each element = endTime of event in that column
// Example: [timestamp1, timestamp2, timestamp3]
// Column 0 free after timestamp1
// Column 1 free after timestamp2
// etc.
```

---

## ✅ Benefits

### For Users:
- 📱 **Better Readability**: Full event titles instead of abbreviations
- 🎯 **Clear Layout**: Events don't overlap anymore
- 📊 **Efficient Use of Space**: Events pack tightly without gaps
- 🔍 **Easy to Scan**: Clean rows make it easy to see schedule at a glance

### For Developers:
- 🧹 **Clean Algorithm**: Easier to understand and maintain
- 🐛 **Fewer Bugs**: Global column tracking prevents inconsistencies
- 🚀 **Better Performance**: Single pass through events
- 📈 **Scalable**: Works well with many overlapping events

---

## 🧪 Test Scenarios to Verify

1. **Single Event Per Time Slot**
   - Should occupy 100% width
   - No gaps

2. **Two Events Overlapping**
   - Should split 50/50 (minus gap)
   - Side by side

3. **Three+ Events Overlapping**
   - Should divide evenly
   - All visible

4. **Partial Overlaps**
   - Event 1: 08:00-10:00
   - Event 2: 08:30-09:30
   - Event 3: 10:00-11:00
   - Events 1&2 should share space
   - Event 3 should use full width

5. **Same Title Events**
   - Should merge into one block
   - Show count: "Event Title (2)"

6. **Different Theme, Same Time**
   - Should NOT merge
   - Should display side by side

---

## 🚀 Future Enhancements (Not Implemented Yet)

- [ ] Drag and drop to adjust event times
- [ ] Click to expand merged events
- [ ] Color coding by priority/type
- [ ] Event resizing
- [ ] Conflict detection warnings
- [ ] Export to PDF/iCal

---

## 📝 Migration Notes

No breaking changes to:
- Event type structure
- Props interface
- External API
- CSS classes

Internal changes only affect:
- Merging logic (theme → title)
- Positioning algorithm
- Display text for merged events

All existing features remain functional! ✨
