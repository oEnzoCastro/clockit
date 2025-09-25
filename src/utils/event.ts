type event = {
    id: number; // Serial (Primary Key)
    location: string; // TEXT
    recurrence: string | null; // TEXT
    date: string; // Format: YYYY-MM-DD (DATE)
    start_time: string; // Format: HH:MM:SS (TIME)
    end_time: string; // Format: HH:MM:SS (TIME)
    subject_abbreviation: string; // Size: 6 (Foreign Key -> subjects.abbreviation)
    monitor_id: number; // Integer (Foreign Key -> monitors.id)
};
