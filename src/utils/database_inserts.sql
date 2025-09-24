-- ================================================
-- SQL INSERT COMMANDS FOR CLOCKIT DATABASE
-- Generated from JSON data files
-- Date: September 24, 2025
-- ================================================

-- ================================================
-- COURSES TABLE INSERTS
-- ================================================
INSERT INTO courses (name) VALUES 
('Ciência da Computação'),
('Engenharia da Computação'),
('Ciência de Dados e Inteligência Artificial'),
('Engenharia de Computação');

-- ================================================
-- MONITORS TABLE INSERTS  
-- ================================================
INSERT INTO monitors (name) VALUES 
('Rafael Assis Carvalho Lacerda'),
('Bernardo Barbosa Heronville'),
('Pedro Henrique Lopes De Melo'),
('Lucas Teixeira Reis'),
('Gabriel Henrique Costa Soares'),
('Thiago Domingos Venturim Ribeiro dos Santos'),
('Theo Diniz Viana'),
('Eduardo Henrique Aniceto Teixeira'),
('Alex de Castro Mendes Marques'),
('Talita Justo Fernandes'),
('Adriano Araújo Domingos dos Santos'),
('João Gabriel Mendonça Geraime Teodoro'),
('João Victor Martins dos Anjos'),
('Augusto Henrique Gonçalves Valbonetti'),
('Thayná Andrade Caldeira Antunes'),
('João Pedro de Meireles Alves'),
('Álvaro Oliveira Soares de Souza'),
('Matheus Filipe Rocha Viana'),
('Rafael Portilho de Andrade'),
('Lucas Abreu Lopes'),
('Fernando Augusto Palhares Barbosa'),
('Vitor Martins Gonçalves'),
('Enzo Alves Barcelos Gripp'),
('Monitor Extra');

-- ================================================
-- SUBJECTS TABLE INSERTS
-- ================================================
INSERT INTO subjects (name, subjectAbreviation, subjectSemester, courseName) VALUES 
('Algoritmos e Estruturas de Dados 1', 'AEDS1', 1, 'Ciência da Computação'),
('Algoritmos e Estruturas de Dados 1', 'AEDS1', 1, 'Engenharia da Computação'),
('Algoritmos e Estruturas de Dados 1', 'AEDS1', 1, 'Ciência de Dados e Inteligência Artificial'),
('Algoritmos e Estruturas de Dados 2', 'AEDS2', 2, 'Ciência da Computação'),
('Algoritmos e Estruturas de Dados 2', 'AEDS2', 2, 'Engenharia de Computação'),
('Algoritmos e Estruturas de Dados 3', 'AEDS3', 2, 'Engenharia de Computação'),
('Arquitetura de Computadores 1', 'AC1', 2, 'Ciência da Computação'),
('Arquitetura de Computadores 2', 'AC2', 3, 'Engenharia da Computação'),
('Bancos de Dados', 'BD', 3, 'Ciência da Computação'),
('Bancos de Dados', 'BD', 3, 'Engenharia de Computação'),
('Cálculo 1', 'CAL1', 1, 'Ciência de Dados e Inteligência Artificial'),
('Cálculo 1', 'CAL1', 1, 'Ciência da Computação'),
('Cálculo 2', 'CAL2', 3, 'Ciência da Computação'),
('Desenvolvimento de Interfaces Web', 'DIW', 1, 'Ciência da Computação'),
('Fundamentos Teóricos da Computação', 'FTC', 6, 'Ciência da Computação'),
('Geometria Analítica e Álgebra Linear', 'GAAL', 2, 'Engenharia de Computação'),
('Laboratório de Introdução à Eng. de Computação', 'LIEC', 1, 'Engenharia de Computação'),
('Projeto em Ciência de Dados I: Sistemas Inteligentes', 'P1', 1, 'Ciência de Dados e Inteligência Artificial'),
('Projeto Integrado I: Desenvolvimento Móvel', 'PI1', 4, 'Engenharia de Computação'),
('Teoria dos Grafos e Computabilidade', 'TCG', 4, 'Ciência da Computação'),
('Aulão', 'ME', 1, 'Ciência de Dados e Inteligência Artificial');

-- ================================================
-- EVENTS TABLE INSERTS
-- ================================================
INSERT INTO events (id, location, recurrence, startTime, endTime, subject, monitor) VALUES 
('1', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T20:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Rafael Assis Carvalho Lacerda'),
('2', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T13:40:00.000Z', '1900-01-04T15:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Rafael Assis Carvalho Lacerda'),
('3', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:40:00.000Z', '1900-01-05T15:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Rafael Assis Carvalho Lacerda'),
('4', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T20:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Rafael Assis Carvalho Lacerda'),
('5', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T20:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Bernardo Barbosa Heronville'),
('6', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T13:30:00.000Z', '1900-01-04T15:20:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Bernardo Barbosa Heronville'),
('7', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:30:00.000Z', '1900-01-05T16:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Bernardo Barbosa Heronville'),
('8', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T18:00:00.000Z', '1900-01-05T19:40:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Bernardo Barbosa Heronville'),
('9', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T13:40:00.000Z', '1900-01-02T15:40:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Pedro Henrique Lopes De Melo'),
('10', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T10:00:00.000Z', '1900-01-03T12:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Pedro Henrique Lopes De Melo'),
('11', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T13:40:00.000Z', '1900-01-04T15:40:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Pedro Henrique Lopes De Melo'),
('12', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:40:00.000Z', '1900-01-05T15:40:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Pedro Henrique Lopes De Melo'),
('13', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T16:00:00.000Z', '1900-01-06T18:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Pedro Henrique Lopes De Melo'),
('14', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T21:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Lucas Teixeira Reis'),
('15', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T18:00:00.000Z', '1900-01-04T21:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Lucas Teixeira Reis'),
('16', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T18:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Lucas Teixeira Reis'),
('17', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T17:20:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Gabriel Henrique Costa Soares'),
('18', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T11:50:00.000Z', '1900-01-03T15:20:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Gabriel Henrique Costa Soares'),
('19', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T17:40:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Gabriel Henrique Costa Soares'),
('20', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T11:50:00.000Z', '1900-01-06T15:20:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Gabriel Henrique Costa Soares'),
('21', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T13:50:00.000Z', '1900-01-02T15:50:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Thiago Domingos Venturim Ribeiro dos Santos'),
('22', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T11:50:00.000Z', '1900-01-03T13:10:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Thiago Domingos Venturim Ribeiro dos Santos'),
('23', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T11:50:00.000Z', '1900-01-05T15:50:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Thiago Domingos Venturim Ribeiro dos Santos'),
('24', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T11:00:00.000Z', '1900-01-06T15:00:00.000Z', 'Algoritmos e Estruturas de Dados 1', 'Thiago Domingos Venturim Ribeiro dos Santos'),
('25', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:30:00.000Z', '1900-01-03T21:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Theo Diniz Viana'),
('26', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:30:00.000Z', '1900-01-05T15:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Theo Diniz Viana'),
('27', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:30:00.000Z', '1900-01-05T19:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Theo Diniz Viana'),
('28', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:30:00.000Z', '1900-01-02T18:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Eduardo Henrique Aniceto Teixeira'),
('29', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:30:00.000Z', '1900-01-04T18:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Eduardo Henrique Aniceto Teixeira'),
('30', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:30:00.000Z', '1900-01-05T15:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Eduardo Henrique Aniceto Teixeira'),
('31', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:30:00.000Z', '1900-01-05T20:30:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Eduardo Henrique Aniceto Teixeira'),
('32', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T21:00:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Alex de Castro Mendes Marques'),
('33', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T22:00:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Alex de Castro Mendes Marques'),
('34', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T12:00:00.000Z', '1900-01-04T13:00:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Alex de Castro Mendes Marques'),
('35', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:00:00.000Z', '1900-01-04T21:00:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Alex de Castro Mendes Marques'),
('36', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T14:00:00.000Z', '1900-01-05T15:00:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Alex de Castro Mendes Marques'),
('37', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T18:00:00.000Z', 'Algoritmos e Estruturas de Dados 2', 'Alex de Castro Mendes Marques'),
('38', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T12:00:00.000Z', '1900-01-02T19:00:00.000Z', 'Algoritmos e Estruturas de Dados 3', 'Talita Justo Fernandes'),
('39', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T19:00:00.000Z', 'Algoritmos e Estruturas de Dados 3', 'Talita Justo Fernandes'),
('40', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:00:00.000Z', '1900-01-04T19:00:00.000Z', 'Algoritmos e Estruturas de Dados 3', 'Talita Justo Fernandes'),
('41', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T12:00:00.000Z', '1900-01-05T19:00:00.000Z', 'Algoritmos e Estruturas de Dados 3', 'Talita Justo Fernandes'),
('42', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T11:40:00.000Z', '1900-01-02T13:40:00.000Z', 'Arquitetura de Computadores 1', 'Adriano Araújo Domingos dos Santos'),
('43', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:00:00.000Z', '1900-01-04T18:10:00.000Z', 'Arquitetura de Computadores 1', 'Adriano Araújo Domingos dos Santos'),
('44', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:30:00.000Z', '1900-01-05T15:30:00.000Z', 'Arquitetura de Computadores 1', 'Adriano Araújo Domingos dos Santos'),
('45', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T10:00:00.000Z', '1900-01-06T11:50:00.000Z', 'Arquitetura de Computadores 1', 'Adriano Araújo Domingos dos Santos'),
('46', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T13:30:00.000Z', '1900-01-06T15:30:00.000Z', 'Arquitetura de Computadores 1', 'Adriano Araújo Domingos dos Santos'),
('47', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T15:40:00.000Z', '1900-01-02T20:40:00.000Z', 'Arquitetura de Computadores 2', 'João Gabriel Mendonça Geraime Teodoro'),
('48', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T15:40:00.000Z', '1900-01-03T20:40:00.000Z', 'Arquitetura de Computadores 2', 'João Gabriel Mendonça Geraime Teodoro'),
('49', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T15:40:00.000Z', '1900-01-04T20:40:00.000Z', 'Arquitetura de Computadores 2', 'João Gabriel Mendonça Geraime Teodoro'),
('50', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T15:40:00.000Z', '1900-01-05T20:40:00.000Z', 'Arquitetura de Computadores 2', 'João Gabriel Mendonça Geraime Teodoro'),
('51', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T13:30:00.000Z', '1900-01-02T15:30:00.000Z', 'Bancos de Dados', 'João Victor Martins dos Anjos'),
('52', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T18:00:00.000Z', '1900-01-03T22:00:00.000Z', 'Bancos de Dados', 'João Victor Martins dos Anjos'),
('53', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T18:00:00.000Z', '1900-01-05T22:00:00.000Z', 'Bancos de Dados', 'João Victor Martins dos Anjos'),
('54', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T12:00:00.000Z', '1900-01-02T19:00:00.000Z', 'Bancos de Dados', 'Talita Justo Fernandes'),
('55', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T19:00:00.000Z', 'Bancos de Dados', 'Talita Justo Fernandes'),
('56', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:00:00.000Z', '1900-01-04T19:00:00.000Z', 'Bancos de Dados', 'Talita Justo Fernandes'),
('57', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T12:00:00.000Z', '1900-01-05T19:00:00.000Z', 'Bancos de Dados', 'Talita Justo Fernandes'),
('58', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:30:00.000Z', '1900-01-03T21:30:00.000Z', 'Cálculo 1', 'Augusto Henrique Gonçalves Valbonetti'),
('59', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:30:00.000Z', '1900-01-05T21:30:00.000Z', 'Cálculo 1', 'Augusto Henrique Gonçalves Valbonetti'),
('60', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T18:00:00.000Z', 'Cálculo 1', 'Thayná Andrade Caldeira Antunes'),
('61', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T18:00:00.000Z', 'Cálculo 1', 'Thayná Andrade Caldeira Antunes'),
('62', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:00:00.000Z', '1900-01-04T18:00:00.000Z', 'Cálculo 1', 'Thayná Andrade Caldeira Antunes'),
('63', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:20:00.000Z', '1900-01-05T15:20:00.000Z', 'Cálculo 1', 'Thayná Andrade Caldeira Antunes'),
('64', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T18:00:00.000Z', 'Cálculo 1', 'Thayná Andrade Caldeira Antunes'),
('65', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T13:30:00.000Z', '1900-01-03T15:30:00.000Z', 'Cálculo 1', 'João Pedro de Meireles Alves'),
('66', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T19:00:00.000Z', 'Cálculo 1', 'João Pedro de Meireles Alves'),
('67', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:30:00.000Z', '1900-01-05T15:30:00.000Z', 'Cálculo 1', 'João Pedro de Meireles Alves'),
('68', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T19:00:00.000Z', 'Cálculo 1', 'João Pedro de Meireles Alves'),
('69', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:30:00.000Z', '1900-01-02T20:30:00.000Z', 'Cálculo 1', 'Álvaro Oliveira Soares de Souza'),
('70', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:30:00.000Z', '1900-01-04T20:30:00.000Z', 'Cálculo 1', 'Álvaro Oliveira Soares de Souza'),
('71', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:30:00.000Z', '1900-01-05T18:30:00.000Z', 'Cálculo 1', 'Álvaro Oliveira Soares de Souza'),
('72', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T10:00:00.000Z', '1900-01-02T13:40:00.000Z', 'Cálculo 2', 'Matheus Filipe Rocha Viana'),
('73', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T10:00:00.000Z', '1900-01-04T13:40:00.000Z', 'Cálculo 2', 'Matheus Filipe Rocha Viana'),
('74', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T10:40:00.000Z', '1900-01-06T11:50:00.000Z', 'Cálculo 2', 'Matheus Filipe Rocha Viana'),
('75', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T13:30:00.000Z', '1900-01-06T15:00:00.000Z', 'Cálculo 2', 'Matheus Filipe Rocha Viana'),
('76', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T10:00:00.000Z', '1900-01-02T11:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('77', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T16:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('78', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T10:00:00.000Z', '1900-01-03T11:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('79', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T16:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('80', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T10:00:00.000Z', '1900-01-04T11:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('81', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T10:00:00.000Z', '1900-01-05T11:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('82', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T14:00:00.000Z', '1900-01-05T15:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('83', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T10:00:00.000Z', '1900-01-06T11:30:00.000Z', 'Desenvolvimento de Interfaces Web', 'Rafael Portilho de Andrade'),
('84', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T10:00:00.000Z', '1900-01-02T11:30:00.000Z', 'Fundamentos Teóricos da Computação', 'Lucas Abreu Lopes'),
('85', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T15:30:00.000Z', '1900-01-03T16:30:00.000Z', 'Fundamentos Teóricos da Computação', 'Lucas Abreu Lopes'),
('86', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T15:30:00.000Z', '1900-01-04T16:30:00.000Z', 'Fundamentos Teóricos da Computação', 'Lucas Abreu Lopes'),
('87', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T21:30:00.000Z', '1900-01-06T02:00:00.000Z', 'Fundamentos Teóricos da Computação', 'Lucas Abreu Lopes'),
('88', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-06T13:30:00.000Z', '1900-01-06T15:30:00.000Z', 'Fundamentos Teóricos da Computação', 'Lucas Abreu Lopes'),
('89', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T15:40:00.000Z', '1900-01-02T20:40:00.000Z', 'Geometria Analítica e Álgebra Linear', 'João Gabriel Mendonça Geraime Teodoro'),
('90', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T15:40:00.000Z', '1900-01-03T20:40:00.000Z', 'Geometria Analítica e Álgebra Linear', 'João Gabriel Mendonça Geraime Teodoro'),
('91', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T15:40:00.000Z', '1900-01-04T20:40:00.000Z', 'Geometria Analítica e Álgebra Linear', 'João Gabriel Mendonça Geraime Teodoro'),
('92', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T15:40:00.000Z', '1900-01-05T20:40:00.000Z', 'Geometria Analítica e Álgebra Linear', 'João Gabriel Mendonça Geraime Teodoro'),
('93', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T15:30:00.000Z', '1900-01-03T19:30:00.000Z', 'Laboratório de Introdução à Eng. de Computação', 'Fernando Augusto Palhares Barbosa'),
('94', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T15:30:00.000Z', '1900-01-04T16:30:00.000Z', 'Laboratório de Introdução à Eng. de Computação', 'Fernando Augusto Palhares Barbosa'),
('95', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T15:30:00.000Z', '1900-01-05T19:30:00.000Z', 'Laboratório de Introdução à Eng. de Computação', 'Fernando Augusto Palhares Barbosa'),
('96', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:30:00.000Z', '1900-01-03T21:30:00.000Z', 'Projeto em Ciência de Dados I: Sistemas Inteligentes', 'Vitor Martins Gonçalves'),
('97', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:30:00.000Z', '1900-01-05T21:30:00.000Z', 'Projeto em Ciência de Dados I: Sistemas Inteligentes', 'Vitor Martins Gonçalves'),
('98', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:30:00.000Z', '1900-01-02T21:30:00.000Z', 'Projeto em Ciência de Dados I: Sistemas Inteligentes', 'Enzo Alves Barcelos Gripp'),
('99', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:30:00.000Z', '1900-01-04T21:30:00.000Z', 'Projeto em Ciência de Dados I: Sistemas Inteligentes', 'Enzo Alves Barcelos Gripp'),
('100', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-02T16:00:00.000Z', '1900-01-02T21:00:00.000Z', 'Projeto Integrado I: Desenvolvimento Móvel', 'Alex de Castro Mendes Marques'),
('101', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T22:00:00.000Z', 'Projeto Integrado I: Desenvolvimento Móvel', 'Alex de Castro Mendes Marques'),
('102', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T12:00:00.000Z', '1900-01-04T13:00:00.000Z', 'Projeto Integrado I: Desenvolvimento Móvel', 'Alex de Castro Mendes Marques'),
('103', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-04T16:00:00.000Z', '1900-01-04T21:00:00.000Z', 'Projeto Integrado I: Desenvolvimento Móvel', 'Alex de Castro Mendes Marques'),
('104', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T14:00:00.000Z', '1900-01-05T15:00:00.000Z', 'Projeto Integrado I: Desenvolvimento Móvel', 'Alex de Castro Mendes Marques'),
('105', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T18:00:00.000Z', 'Projeto Integrado I: Desenvolvimento Móvel', 'Alex de Castro Mendes Marques'),
('106', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T13:30:00.000Z', '1900-01-03T15:30:00.000Z', 'Teoria dos Grafos e Computabilidade', 'João Pedro de Meireles Alves'),
('107', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-03T16:00:00.000Z', '1900-01-03T19:00:00.000Z', 'Teoria dos Grafos e Computabilidade', 'João Pedro de Meireles Alves'),
('108', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T13:30:00.000Z', '1900-01-05T15:30:00.000Z', 'Teoria dos Grafos e Computabilidade', 'João Pedro de Meireles Alves'),
('109', 'Lab. 1101, prédio 4 - Lourdes', 'null', '1900-01-05T16:00:00.000Z', '1900-01-05T19:00:00.000Z', 'Teoria dos Grafos e Computabilidade', 'João Pedro de Meireles Alves');

-- ================================================
-- SUMMARY
-- ================================================
-- Total Courses: 4
-- Total Monitors: 24  
-- Total Subjects: 21
-- Total Events: 109
-- 
-- Note: Foreign keys should be properly referenced based on your database schema
-- Some fields may need data type adjustments (e.g., DATETIME, VARCHAR lengths)
-- Consider adding proper constraints and indexes for production use
-- ================================================