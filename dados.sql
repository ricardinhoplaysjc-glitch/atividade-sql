
CREATE TABLE alunos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    curso TEXT NOT NULL,
    nota REAL
);

INSERT INTO alunos (nome, curso, nota)
VALUES ('Ana Silva', 'Informática', 8.5);

INSERT INTO alunos (nome, curso, nota)
VALUES ('Bruno Costa', 'Mecatrônica', 7.0);

INSERT INTO alunos (nome, curso, nota)
VALUES ('Carla Dias', 'Informática', 9.2);

INSERT INTO alunos (nome, curso, nota)
VALUES ('Diego Alves', 'Eletrônica', 6.8);
