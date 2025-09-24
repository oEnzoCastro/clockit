type subject = {
    subject_abbreviation: string; // Size: 6 (Primary Key)
    course_abbreviation: string; // Size: 6 (Foreign Key -> courses.abbreviation)
    name: string; // Size: 100
    subject_semester: number; // Integer
};
