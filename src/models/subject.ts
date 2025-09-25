type subject = {
    subject_abbreviation: string; // Primary Key
    course_abbreviation: string; // Foreign Key -> courses.abbreviation
    name: string; // TEXT
    subject_semester: number; // Integer
};
