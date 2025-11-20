// server.js
const express = require('express');
const path = require('path');
const fs = require('fs'); // Módulo nativo para verificar se o arquivo existe
const cors = require('cors');
const mysql = require('mysql2/promise'); // Usamos o mysql2 com promises
const app = express();
const port = 3000;

// --- Configuração do Banco de Dados MySQL ---
// ATENÇÃO: SUBSTITUA PELA SUA SENHA REAL DO MYSQL!
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: 'senai', // <-- CORRIJA ISSO!
    database: 'instrumusic_db'
};

let dbPool;
async function initializeDatabase() {
    try {
        dbPool = mysql.createPool(dbConfig);
        // Tenta fazer uma query simples (GET CONNECTION) para confirmar a conexão
        await dbPool.getConnection();
        console.log('✅ MySQL Pool de conexões criado e conexão testada com sucesso!');
    } catch (error) {
        // Se houver um erro aqui (geralmente senha ou DB inexistente), o log ajudará a depurar.
        console.error('❌ ERRO CRÍTICO: Falha ao conectar/testar o banco de dados:', error.message);
        // O servidor continuará rodando para servir o frontend, mas as rotas de API falharão.
    }
}
initializeDatabase();

// --- Configuração do Middleware ---

// Habilita CORS para todas as rotas
app.use(cors());

// Permite que o Express processe dados JSON do corpo da requisição
app.use(express.json());

// Middleware para servir arquivos estáticos da pasta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// --- Rotas para as Páginas HTML na Raiz ---

// Rota principal (GET /) - Envia o index.html da raiz
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Rota curinga para servir qualquer HTML na raiz
app.get('/:page', (req, res) => {
    const filePath = path.join(__dirname, 'public', 'pages', `${req.params.page}.html`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('404 | Página não encontrada.');
    }
});

// --- Rotas de API (Autenticação) ---

// POST /api/register (Cadastro de Novo Usuário)
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Dados incompletos.' });
    }

    // Verifica se a conexão com o DB foi estabelecida
    if (!dbPool) {
        return res.status(503).json({ success: false, message: 'Serviço de banco de dados indisponível.' });
    }

    try {
        // ATENÇÃO: A senha não está hasheada. Em produção, use bcrypt.
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await dbPool.execute(query, [name, email, password]);

        res.status(201).json({ success: true, message: 'Usuário registrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao registrar usuário:', error.message);
        // Tratamento para e-mail duplicado (código de erro comum do MySQL)
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
        }
        res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
});


// POST /api/login (Login de Usuário)
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
    }

    if (!dbPool) {
        return res.status(503).json({ success: false, message: 'Serviço de banco de dados indisponível.' });
    }

    try {
        // Busca o usuário pelo e-mail
        const [rows] = await dbPool.execute('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (!user) {
            return res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
        }

        // Compara a senha (SEM HASHING)
        if (password === user.password) {
            // Sucesso no login
            res.status(200).json({
                success: true,
                message: 'Login bem-sucedido!',
                user: { id: user.id, name: user.name, email: user.email },
                redirect: '/dashboard.html'
            });
        } else {
            // Senha incorreta
            res.status(401).json({ success: false, message: 'E-mail ou senha inválidos.' });
        }

    } catch (error) {
        console.error('Erro ao realizar login:', error.message);
        res.status(500).json({ success: false, message: 'Erro interno no servidor.' });
    }
});


// --- Inicialização do Servidor ---
app.listen(port, () => {
    console.log(`
============================================
 Servidor InstruMusic rodando!
 Acesse: http://localhost:${port}
============================================
    `);
});