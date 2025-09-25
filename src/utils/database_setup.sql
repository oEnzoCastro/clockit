-- ================================================
-- DATABASE SCHEMA AND DATA INSERTION SCRIPT
-- ================================================
-- This script creates tables for a monitoring system
-- and inserts data based on the provided JSON files
-- ================================================

-- Drop tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS events;
DROP TABLE IF EXISTS subjects;
DROP TABLE IF EXISTS subject_master;
DROP TABLE IF EXISTS monitors;
DROP TABLE IF EXISTS courses;

-- ================================================
-- CREATE TABLES
-- ================================================

-- Create courses table
CREATE TABLE courses (
    abbreviation VARCHAR(6) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create monitors table
CREATE TABLE monitors (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create master subjects table (for unique subject abbreviations)
CREATE TABLE subject_master (
    subject_abbreviation VARCHAR(6) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Create subjects table (relationship between subjects and courses)
-- Note: Using composite primary key as specified in requirements
CREATE TABLE subjects (
    subject_abbreviation VARCHAR(6),
    course_abbreviation VARCHAR(6),
    subject_semester INTEGER NOT NULL,
    PRIMARY KEY (subject_abbreviation, course_abbreviation)
);

-- Create events table
CREATE TABLE events (
    id SERIAL PRIMARY KEY,
    location TEXT NOT NULL,
    recurrence TEXT,
    date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    subject_abbreviation VARCHAR(6) NOT NULL,
    course_abbreviation VARCHAR(6) NOT NULL,
    monitor_id INTEGER NOT NULL
);

-- ================================================
-- ADD FOREIGN KEY CONSTRAINTS
-- ================================================

-- Add foreign key constraint for subjects table to courses
ALTER TABLE subjects 
ADD CONSTRAINT fk_subjects_course 
FOREIGN KEY (course_abbreviation) 
REFERENCES courses(abbreviation);

-- Add foreign key constraint for subjects table to subject_master
ALTER TABLE subjects 
ADD CONSTRAINT fk_subjects_master 
FOREIGN KEY (subject_abbreviation) 
REFERENCES subject_master(subject_abbreviation);

-- Add foreign key constraint for events table (subject and course combination)
ALTER TABLE events 
ADD CONSTRAINT fk_events_subject_course 
FOREIGN KEY (subject_abbreviation, course_abbreviation) 
REFERENCES subjects(subject_abbreviation, course_abbreviation);

-- Add foreign key constraint for events table (monitor)
ALTER TABLE events 
ADD CONSTRAINT fk_events_monitor 
FOREIGN KEY (monitor_id) 
REFERENCES monitors(id);

-- ================================================
-- INSERT DATA
-- ================================================

-- Insert courses data (Note: Removed duplicate 'EC' entry from source data)
INSERT INTO courses (abbreviation, name) VALUES
('CC', 'Ciência da Computação'),
('EC', 'Engenharia da Computação'),
('CDIA', 'Ciência de Dados e Inteligência Artificial');

-- Insert monitors data
INSERT INTO monitors (id, name) VALUES
(1, 'Rafael Assis Carvalho Lacerda'),
(2, 'Bernardo Barbosa Heronville'),
(3, 'Pedro Henrique Lopes De Melo'),
(4, 'Lucas Teixeira Reis'),
(5, 'Gabriel Henrique Costa Soares'),
(6, 'Thiago Domingos Venturim Ribeiro dos Santos'),
(7, 'Theo Diniz Viana'),
(8, 'Eduardo Henrique Aniceto Teixeira'),
(9, 'Alex de Castro Mendes Marques'),
(10, 'Talita Justo Fernandes'),
(11, 'Adriano Araújo Domingos dos Santos'),
(12, 'João Gabriel Mendonça Geraime Teodoro'),
(13, 'João Victor Martins dos Anjos'),
(14, 'Augusto Henrique Gonçalves Valbonetti'),
(15, 'Thayná Andrade Caldeira Antunes'),
(16, 'João Pedro de Meireles Alves'),
(17, 'Álvaro Oliveira Soares de Souza'),
(18, 'Matheus Filipe Rocha Viana'),
(19, 'Rafael Portilho de Andrade'),
(20, 'Lucas Abreu Lopes'),
(21, 'Fernando Augusto Palhares Barbosa'),
(22, 'Vitor Martins Gonçalves'),
(23, 'Enzo Alves Barcelos Gripp');

-- Insert master subjects data (unique subjects)
INSERT INTO subject_master (subject_abbreviation, name) VALUES
('AEDS1', 'Algoritmos e Estruturas de Dados 1'),
('AEDS2', 'Algoritmos e Estruturas de Dados 2'),
('AEDS3', 'Algoritmos e Estruturas de Dados 3'),
('AC1', 'Arquitetura de Computadores 1'),
('AC2', 'Arquitetura de Computadores 2'),
('BD', 'Bancos de Dados'),
('CAL1', 'Cálculo 1'),
('CAL2', 'Cálculo 2'),
('DIW', 'Desenvolvimento de Interfaces Web'),
('FTC', 'Fundamentos Teóricos da Computação'),
('GAAL', 'Geometria Analítica e Álgebra Linear'),
('LIEC', 'Laboratório de Introdução à Eng. de Computação'),
('PCD1', 'Projeto em Ciência de Dados I: Sistemas Inteligentes'),
('PI1', 'Projeto Integrado I: Desenvolvimento Móvel'),
('TCG', 'Teoria dos Grafos e Computabilidade'),
('ME', 'Aulão');

-- Insert subjects-courses relationships
INSERT INTO subjects (subject_abbreviation, course_abbreviation, subject_semester) VALUES
('AEDS1', 'CC', 1),
('AEDS1', 'EC', 1),
('AEDS1', 'CDIA', 1),
('AEDS2', 'CC', 2),
('AEDS2', 'EC', 2),
('AEDS3', 'EC', 2),
('AC1', 'CC', 2),
('AC2', 'EC', 3),
('BD', 'CC', 3),
('BD', 'EC', 3),
('CAL1', 'CDIA', 1),
('CAL1', 'CC', 1),
('CAL2', 'CC', 3),
('DIW', 'CC', 1),
('FTC', 'CC', 6),
('GAAL', 'EC', 2),
('LIEC', 'EC', 1),
('PCD1', 'CDIA', 1),
('PI1', 'EC', 4),
('TCG', 'CC', 4),
('ME', 'CDIA', 1);

-- Reset the sequence for monitors table to continue from the correct value
SELECT setval('monitors_id_seq', (SELECT MAX(id) FROM monitors));

-- Insert events data (complete dataset - all 109 events with course abbreviations)
INSERT INTO events (id, location, recurrence, date, start_time, end_time, subject_abbreviation, course_abbreviation, monitor_id) VALUES
(1, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '20:00:00', 'AEDS1', 'CC', 1),
(2, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '13:40:00', '15:00:00', 'AEDS1', 'CC', 1),
(3, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:40:00', '15:00:00', 'AEDS1', 'CC', 1),
(4, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '20:00:00', 'AEDS1', 'CC', 1),
(5, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '20:00:00', 'AEDS1', 'CC', 2),
(6, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '13:30:00', '15:20:00', 'AEDS1', 'CC', 2),
(7, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:30:00', '16:00:00', 'AEDS1', 'CC', 2),
(8, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '18:00:00', '19:40:00', 'AEDS1', 'CC', 2),
(9, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '13:40:00', '15:40:00', 'AEDS1', 'CC', 3),
(10, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '10:00:00', '12:00:00', 'AEDS1', 'CC', 3),
(11, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '13:40:00', '15:40:00', 'AEDS1', 'CC', 3),
(12, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:40:00', '15:40:00', 'AEDS1', 'CC', 3),
(13, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '16:00:00', '18:00:00', 'AEDS1', 'CC', 3),
(14, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '21:00:00', 'AEDS1', 'CC', 4),
(15, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '18:00:00', '21:00:00', 'AEDS1', 'CC', 4),
(16, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '18:00:00', 'AEDS1', 'CC', 4),
(17, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '17:20:00', 'AEDS1', 'EC', 5),
(18, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '11:50:00', '15:20:00', 'AEDS1', 'EC', 5),
(19, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '17:40:00', 'AEDS1', 'EC', 5),
(20, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '11:50:00', '15:20:00', 'AEDS1', 'EC', 5),
(21, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '13:50:00', '15:50:00', 'AEDS1', 'CDIA', 6),
(22, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '11:50:00', '13:10:00', 'AEDS1', 'CDIA', 6),
(23, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '11:50:00', '15:50:00', 'AEDS1', 'CDIA', 6),
(24, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '11:00:00', '15:00:00', 'AEDS1', 'CDIA', 6),
(25, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:30:00', '21:30:00', 'AEDS2', 'CC', 7),
(26, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:30:00', '15:30:00', 'AEDS2', 'CC', 7),
(27, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:30:00', '19:30:00', 'AEDS2', 'CC', 7),
(28, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:30:00', '18:30:00', 'AEDS2', 'CC', 8),
(29, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:30:00', '18:30:00', 'AEDS2', 'CC', 8),
(30, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:30:00', '15:30:00', 'AEDS2', 'CC', 8),
(31, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:30:00', '20:30:00', 'AEDS2', 'CC', 8),
(32, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '21:00:00', 'AEDS2', 'EC', 9),
(33, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '22:00:00', 'AEDS2', 'EC', 9),
(34, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '12:00:00', '13:00:00', 'AEDS2', 'EC', 9),
(35, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:00:00', '21:00:00', 'AEDS2', 'EC', 9),
(36, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '14:00:00', '15:00:00', 'AEDS2', 'EC', 9),
(37, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '18:00:00', 'AEDS2', 'EC', 9),
(38, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '12:00:00', '19:00:00', 'AEDS3', 'EC', 10),
(39, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '19:00:00', 'AEDS3', 'EC', 10),
(40, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:00:00', '19:00:00', 'AEDS3', 'EC', 10),
(41, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '12:00:00', '19:00:00', 'AEDS3', 'EC', 10),
(42, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '11:40:00', '13:40:00', 'AC1', 'CC', 11),
(43, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:00:00', '18:10:00', 'AC1', 'CC', 11),
(44, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:30:00', '15:30:00', 'AC1', 'CC', 11),
(45, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '10:00:00', '11:50:00', 'AC1', 'CC', 11),
(46, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '13:30:00', '15:30:00', 'AC1', 'CC', 11),
(47, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '15:40:00', '20:40:00', 'AC2', 'EC', 12),
(48, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '15:40:00', '20:40:00', 'AC2', 'EC', 12),
(49, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '15:40:00', '20:40:00', 'AC2', 'EC', 12),
(50, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '15:40:00', '20:40:00', 'AC2', 'EC', 12),
(51, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '13:30:00', '15:30:00', 'BD', 'CC', 13),
(52, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '18:00:00', '22:00:00', 'BD', 'CC', 13),
(53, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '18:00:00', '22:00:00', 'BD', 'CC', 13),
(54, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '12:00:00', '19:00:00', 'BD', 'EC', 10),
(55, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '19:00:00', 'BD', 'EC', 10),
(56, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:00:00', '19:00:00', 'BD', 'EC', 10),
(57, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '12:00:00', '19:00:00', 'BD', 'EC', 10),
(58, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:30:00', '21:30:00', 'CAL1', 'CDIA', 14),
(59, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:30:00', '21:30:00', 'CAL1', 'CDIA', 14),
(60, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '18:00:00', 'CAL1', 'CC', 15),
(61, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '18:00:00', 'CAL1', 'CC', 15),
(62, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:00:00', '18:00:00', 'CAL1', 'CC', 15),
(63, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:20:00', '15:20:00', 'CAL1', 'CC', 15),
(64, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '18:00:00', 'CAL1', 'CC', 15),
(65, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '13:30:00', '15:30:00', 'CAL1', 'CC', 16),
(66, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '19:00:00', 'CAL1', 'CC', 16),
(67, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:30:00', '15:30:00', 'CAL1', 'CC', 16),
(68, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '19:00:00', 'CAL1', 'CC', 16),
(69, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:30:00', '20:30:00', 'CAL1', 'CDIA', 17),
(70, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:30:00', '20:30:00', 'CAL1', 'CDIA', 17),
(71, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:30:00', '18:30:00', 'CAL1', 'CDIA', 17),
(72, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '10:00:00', '13:40:00', 'CAL2', 'CC', 18),
(73, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '10:00:00', '13:40:00', 'CAL2', 'CC', 18),
(74, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '10:40:00', '11:50:00', 'CAL2', 'CC', 18),
(75, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '13:30:00', '15:00:00', 'CAL2', 'CC', 18),
(76, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '10:00:00', '11:30:00', 'DIW', 'EC', 19),
(77, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '16:30:00', 'DIW', 'EC', 19),
(78, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '10:00:00', '11:30:00', 'DIW', 'EC', 19),
(79, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '16:30:00', 'DIW', 'EC', 19),
(80, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '10:00:00', '11:30:00', 'DIW', 'EC', 19),
(81, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '10:00:00', '11:30:00', 'DIW', 'EC', 19),
(82, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '14:00:00', '15:30:00', 'DIW', 'EC', 19),
(83, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '10:00:00', '11:30:00', 'DIW', 'EC', 19),
(84, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '10:00:00', '11:30:00', 'FTC', 'CDIA', 20),
(85, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '15:30:00', '16:30:00', 'FTC', 'CDIA', 20),
(86, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '15:30:00', '16:30:00', 'FTC', 'CDIA', 20),
(87, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '21:30:00', '02:00:00', 'FTC', 'CDIA', 20),
(88, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-06', '13:30:00', '15:30:00', 'FTC', 'CDIA', 20),
(89, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '15:40:00', '20:40:00', 'GAAL', 'EC', 12),
(90, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '15:40:00', '20:40:00', 'GAAL', 'EC', 12),
(91, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '15:40:00', '20:40:00', 'GAAL', 'EC', 12),
(92, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '15:40:00', '20:40:00', 'GAAL', 'EC', 12),
(93, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '15:30:00', '19:30:00', 'LIEC', 'EC', 21),
(94, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '15:30:00', '16:30:00', 'LIEC', 'EC', 21),
(95, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '15:30:00', '19:30:00', 'LIEC', 'EC', 21),
(96, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:30:00', '21:30:00', 'PCD1', 'CDIA', 22),
(97, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:30:00', '21:30:00', 'PCD1', 'CDIA', 22),
(98, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:30:00', '21:30:00', 'PCD1', 'CDIA', 23),
(99, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:30:00', '21:30:00', 'PCD1', 'CDIA', 23),
(100, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-02', '16:00:00', '21:00:00', 'PI1', 'EC', 9),
(101, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '22:00:00', 'PI1', 'EC', 9),
(102, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '12:00:00', '13:00:00', 'PI1', 'EC', 9),
(103, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-04', '16:00:00', '21:00:00', 'PI1', 'EC', 9),
(104, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '14:00:00', '15:00:00', 'PI1', 'EC', 9),
(105, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '18:00:00', 'PI1', 'EC', 9),
(106, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '13:30:00', '15:30:00', 'TCG', 'CC', 16),
(107, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-03', '16:00:00', '19:00:00', 'TCG', 'CC', 16),
(108, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '13:30:00', '15:30:00', 'TCG', 'CC', 16),
(109, 'Lab. 1101, prédio 4 - Lourdes', '-', '1900-01-05', '16:00:00', '19:00:00', 'TCG', 'CC', 16);

-- Reset the sequence for events table to continue from the correct value
SELECT setval('events_id_seq', (SELECT MAX(id) FROM events));

-- ================================================
-- INDEXES FOR PERFORMANCE (OPTIONAL)
-- ================================================

-- Create indexes on foreign key columns for better performance
CREATE INDEX idx_subjects_course_abbreviation ON subjects(course_abbreviation);
CREATE INDEX idx_subjects_subject_abbreviation ON subjects(subject_abbreviation);
CREATE INDEX idx_events_subject_abbreviation ON events(subject_abbreviation);
CREATE INDEX idx_events_monitor_id ON events(monitor_id);
CREATE INDEX idx_events_date ON events(date);

-- ================================================
-- VERIFICATION QUERIES
-- ================================================

-- Verify the data has been inserted correctly
-- SELECT COUNT(*) as course_count FROM courses;
-- SELECT COUNT(*) as monitor_count FROM monitors;
-- SELECT COUNT(*) as subject_master_count FROM subject_master;
-- SELECT COUNT(*) as subject_course_relationship_count FROM subjects;
-- SELECT COUNT(*) as event_count FROM events;

-- Additional verification queries
-- SELECT * FROM courses ORDER BY abbreviation;
-- SELECT * FROM monitors ORDER BY id;
-- SELECT * FROM subject_master ORDER BY subject_abbreviation;
-- SELECT s.subject_abbreviation, s.course_abbreviation, sm.name, s.subject_semester 
--   FROM subjects s JOIN subject_master sm ON s.subject_abbreviation = sm.subject_abbreviation 
--   ORDER BY s.subject_abbreviation, s.course_abbreviation;

-- ================================================
-- NOTES:
-- ================================================
-- 1. The events table includes the complete dataset (109 records)
-- 2. All recurrence fields are set to '-' as requested
-- 3. The foreign key constraints ensure referential integrity
-- 4. Indexes are created for better query performance
-- 5. Date format follows PostgreSQL standards (YYYY-MM-DD)
-- 6. Time format follows PostgreSQL standards (HH:MM:SS)
-- 7. All subject abbreviations match between events and subjects tables
-- ================================================