-- =====================================================================
-- Dati di esempio, in SQL puro. Va in: src/main/resources/import.sql
--
-- IMPORTANTE: ogni istruzione DEVE stare su una singola riga, terminata da
-- ";". Il parser di import.sql di Hibernate (diverso da quello di Spring
-- usato per data.sql) divide il file riga per riga, non istruzione per
-- istruzione: un INSERT con i VALUES spezzati su più righe viene troncato
-- a meta' e genera un errore di sintassi per ogni riga.
-- =====================================================================

-- === Utenti (profilo) ===
INSERT INTO users (id, name, surname, email) VALUES (1, 'Admin', 'System', 'admin@siwmovie.it');
INSERT INTO users (id, name, surname, email) VALUES (2, 'Mario', 'Rossi', 'mario.rossi@example.com');

-- === Credenziali (password gia' cifrate con BCrypt: admin123 / password) ===
INSERT INTO credentials (id, user_id, username, password, role) VALUES (1, 1, 'admin', '$2a$10$kIvsTejyDpnDEjs88SLldefDXb39EDMZdbP6hce/8mcJOoYEXGqpq', 'ADMIN');
INSERT INTO credentials (id, user_id, username, password, role) VALUES (2, 2, 'mario', '$2a$10$zK.zdEm8S4dUud2E/WHtiOr1rSekCCi3e35chhcXm90IV/JL2R7Hq', 'USER');

-- === Registi ===
INSERT INTO director (id, name, surname, birth_date, nationality) VALUES (1, 'Christopher', 'Nolan', '1970-07-30', 'British');
INSERT INTO director (id, name, surname, birth_date, nationality) VALUES (2, 'Hayao', 'Miyazaki', '1941-01-05', 'Japanese');
INSERT INTO director (id, name, surname, birth_date, nationality) VALUES (3, 'Giuseppe', 'Tornatore', '1956-05-27', 'Italian');

-- === Sale ===
INSERT INTO hall (id, name, address, capacity) VALUES (1, 'Main Hall', 'Via Roma 1, Rome', 300);
INSERT INTO hall (id, name, address, capacity) VALUES (2, 'Blue Hall', 'Via Roma 1, Rome', 120);

-- === Festival ===
INSERT INTO festival (id, name, year, city, start_date, end_date, description) VALUES (1, 'Rome Film Fest', 2026, 'Rome', '2026-10-10', '2026-10-18', 'International film festival in Rome.');
INSERT INTO festival (id, name, year, city, start_date, end_date, description) VALUES (2, 'Naples Indie Fest', 2026, 'Naples', '2026-11-05', '2026-11-09', 'Independent cinema festival.');

-- === Film ===
INSERT INTO movie (id, title, year, duration, genre, contry_production, director_id) VALUES (1, 'Oppenheimer', 2023, 180, 'Drama', 'USA', 1);
INSERT INTO movie (id, title, year, duration, genre, contry_production, director_id) VALUES (2, 'Spirited Away', 2001, 125, 'Animation', 'Japan', 2);
INSERT INTO movie (id, title, year, duration, genre, contry_production, director_id) VALUES (3, 'Cinema Paradiso', 1988, 155, 'Drama', 'Italy', 3);
INSERT INTO movie (id, title, year, duration, genre, contry_production, director_id) VALUES (4, 'Interstellar', 2014, 169, 'Sci-Fi', 'USA', 1);

-- === Associazione film <-> festival (relazione molti-a-molti) ===
INSERT INTO festival_movie (festival_id, movie_id) VALUES (1, 1);
INSERT INTO festival_movie (festival_id, movie_id) VALUES (1, 2);
INSERT INTO festival_movie (festival_id, movie_id) VALUES (1, 3);
INSERT INTO festival_movie (festival_id, movie_id) VALUES (2, 4);

-- === Proiezioni ===
INSERT INTO screening (id, date, time, festival_id, hall_id, movie_id, status) VALUES (1, '2026-10-10', '20:30:00', 1, 1, 1, 'SCHEDULED');
INSERT INTO screening (id, date, time, festival_id, hall_id, movie_id, status) VALUES (2, '2026-10-11', '18:00:00', 1, 2, 2, 'SCHEDULED');
INSERT INTO screening (id, date, time, festival_id, hall_id, movie_id, status) VALUES (3, '2026-10-12', '21:00:00', 1, 1, 3, 'SCHEDULED');
INSERT INTO screening (id, date, time, festival_id, hall_id, movie_id, status) VALUES (4, '2026-11-06', '19:30:00', 2, 2, 4, 'SCHEDULED');

-- =====================================================================
-- Allinea le sequence oltre gli id usati sopra (max: 4), cosi' la prossima
-- entita' creata dall'applicazione (es. una registrazione) non rischia di
-- ricevere un id gia' occupato.
-- =====================================================================
SELECT setval('users_seq', 1000);
SELECT setval('credentials_seq', 1000);
SELECT setval('director_seq', 1000);
SELECT setval('hall_seq', 1000);
SELECT setval('festival_seq', 1000);
SELECT setval('movie_seq', 1000);
SELECT setval('screening_seq', 1000);
SELECT setval('reviews_seq', 1000);