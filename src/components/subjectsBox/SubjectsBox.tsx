"use client";

import './style.css';
import * as React from 'react';
import { useState, useEffect, useMemo, useCallback } from 'react';
import IOSSwitch from '../switch/Switch';
import Course from '@/models/course';
import CourseSubject from '@/models/courseSubject';

interface SubjectsBoxProps {
  onSubjectToggle: (subjectAbbreviation: string, isSelected: boolean) => void;
  onCourseChange: (courseAbbreviation: string) => void;
  selectedSubjects: Set<string>;
}

export default function SubjectsBox({
  onSubjectToggle,
  onCourseChange,
  selectedSubjects,
}: SubjectsBoxProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [subjects, setSubjects] = useState<CourseSubject[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<string>("");
  const [selectedPeriodo, setSelectedPeriodo] = useState<number | "all">("all");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch courses on mount
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/Courses');
        const data = await response.json();
        if (data.data) {
          setCourses(data.data);
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Failed to load courses');
      }
    };

    fetchCourses();
  }, []);

  // Fetch subjects when course is selected
  useEffect(() => {
    const fetchSubjects = async () => {
      if (!selectedCourse) {
        setSubjects([]);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/Subjects/${selectedCourse}`);
        const data = await response.json();
        if (data.data) {
          setSubjects(data.data);
        }
      } catch (err) {
        console.error('Error fetching subjects:', err);
        setError('Failed to load subjects');
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedCourse]);

  // Get unique periodos (semesters) from subjects
  const availablePeriodos = useMemo(() => {
    const periodos = new Set(subjects.map(s => s.subject_semester));
    return Array.from(periodos).sort((a, b) => a - b);
  }, [subjects]);

  // Filter subjects by selected periodo
  const filteredSubjects = useMemo(() => {
    if (selectedPeriodo === "all") {
      return subjects;
    }
    return subjects.filter(s => s.subject_semester === selectedPeriodo);
  }, [subjects, selectedPeriodo]);

  // Group subjects by semester
  const groupedSubjects = useMemo(() => {
    const groups: { [key: number]: CourseSubject[] } = {};
    
    filteredSubjects.forEach(subject => {
      if (!groups[subject.subject_semester]) {
        groups[subject.subject_semester] = [];
      }
      groups[subject.subject_semester].push(subject);
    });

    return groups;
  }, [filteredSubjects]);

  const handleCourseChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const courseAbbr = e.target.value;
    setSelectedCourse(courseAbbr);
    setSelectedPeriodo("all"); // Reset periodo filter when changing course
    onCourseChange(courseAbbr); // Notify parent
  }, [onCourseChange]);

  const handlePeriodoChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedPeriodo(value === "all" ? "all" : parseInt(value));
  }, []);

  const handleSwitchToggle = useCallback((subjectAbbreviation: string) => {
    const isCurrentlySelected = selectedSubjects.has(subjectAbbreviation);
    onSubjectToggle(subjectAbbreviation, !isCurrentlySelected);
  }, [selectedSubjects, onSubjectToggle]);

  return (
    <section className="box">
      {/* Course Dropdown */}
      <select 
        name="course" 
        id="course" 
        value={selectedCourse} 
        onChange={handleCourseChange}
        className="course-select"
      >
        <option value="" disabled>
          Selecione um curso
        </option>
        {courses.map((course) => (
          <option value={course.abbreviation} key={course.abbreviation}>
            {course.name}
          </option>
        ))}
      </select>

      {/* Periodo Filter */}
      {selectedCourse && availablePeriodos.length > 0 && (
        <select
          name="periodo"
          id="periodo"
          value={selectedPeriodo}
          onChange={handlePeriodoChange}
          className="periodo-select"
        >
          <option value="all">Todos os Períodos</option>
          {availablePeriodos.map((periodo) => (
            <option value={periodo} key={periodo}>
              {periodo}° Período
            </option>
          ))}
        </select>
      )}

      {/* Subjects Display */}
      <article className="allSubjects">
        {loading && (
          <div className="loading-state">
            <p>Carregando disciplinas...</p>
          </div>
        )}

        {error && (
          <div className="error-state">
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && selectedCourse && Object.keys(groupedSubjects).length === 0 && (
          <div className="empty-state">
            <p>Nenhuma disciplina encontrada</p>
          </div>
        )}

        {!loading && !error && Object.keys(groupedSubjects).length > 0 &&
          Object.entries(groupedSubjects)
            .sort(([a], [b]) => parseInt(a) - parseInt(b))
            .map(([semester, semesterSubjects]) => (
              <div className="semester" key={semester}>
                <h3>{semester}° Período</h3>
                <div className="subjects">
                  {semesterSubjects.map((subject) => (
                    <div className="subject" key={subject.subject_abbreviation}>
                      <h3 title={subject.subject_name}>
                        {subject.subject_abbreviation}
                      </h3>
                      <IOSSwitch
                        checked={selectedSubjects.has(subject.subject_abbreviation)}
                        onChange={() => handleSwitchToggle(subject.subject_abbreviation)}
                        inputProps={{ 'aria-label': `Toggle ${subject.subject_abbreviation}` }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
      </article>
    </section>
  );
}
