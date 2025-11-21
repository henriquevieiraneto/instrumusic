-- Arquivo: instrumusic_db.sql
-- Script para configurar o banco de dados MySQL para o projeto InstruMusic

-- 1. Cria a Tabela de Usuários (users)
-- Armazenará as informações de login e cadastro.
CREATE TABLE IF NOT EXISTS users (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,     -- UNIQUE: Garante que cada e-mail seja único
    password VARCHAR(255) NOT NULL,         -- Use 255 para armazenar HASHes de senha (segurança)
    is_admin BOOLEAN DEFAULT FALSE,         -- Campo opcional para controle de acesso
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. Cria a Tabela de Instrumentos (instruments)
-- Armazena dados mestres sobre os instrumentos (para fins de listagem, etc.)
CREATE TABLE IF NOT EXISTS instruments (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE,
    slug VARCHAR(50) NOT NULL UNIQUE,       -- Ex: 'guitarra'
    description TEXT,
    icon_path VARCHAR(255)                  -- Caminho para o ícone/imagem principal
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. Popula a Tabela de Instrumentos com dados iniciais
INSERT INTO instruments (name, slug, description, icon_path) VALUES
('Guitarra', 'guitarra', 'O instrumento mais popular do mundo, essencial em rock, blues e pop.', 'public/img/guitarra.png'),
('Bateria', 'bateria', 'O coração rítmico de qualquer banda, fornecendo base e energia.', 'public/img/bateria.webp'),
('Teclado', 'teclado', 'Permite criar harmonias complexas e melodias ricas, de piano a sintetizador.', 'public/img/teclado.png'),
('Violino', 'violino', 'A voz orquestral por excelência, conhecida por seu som emocionante.', 'public/img/violino.png'),
('Flauta', 'flauta', 'Instrumento de sopro melódico, oferece uma melodia suave e cristalina.', 'public/img/flauta.png'),
('Trompete', 'trompete', 'Conhecido por seu som brilhante e poderoso, chave em jazz e música clássica.', 'public/img/trompete.png');

-- 4. Cria a Tabela de Cursos (courses)
-- Armazena os diferentes cursos que os usuários podem se inscrever
CREATE TABLE IF NOT EXISTS courses (
    id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    instrument_id INT UNSIGNED,
    level ENUM('Iniciante', 'Intermediário', 'Avançado') NOT NULL,
    price DECIMAL(6, 2) DEFAULT 0.00,
    FOREIGN KEY (instrument_id) REFERENCES instruments(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. Cria Tabela de Matrículas (enrollments)
-- Relacionamento N:N entre Usuários e Cursos
CREATE TABLE IF NOT EXISTS enrollments (
    user_id INT UNSIGNED,
    course_id INT UNSIGNED,
    enrollment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    progress DECIMAL(5, 2) DEFAULT 0.00, -- Progresso do aluno no curso (0.00 a 100.00)
    PRIMARY KEY (user_id, course_id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;