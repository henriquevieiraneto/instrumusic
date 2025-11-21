// server.js
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2/promise');
const app = express();

// 1. A porta deve vir do ambiente (Railway) ou usar 3000 como fallback local
const port = process.env.PORT || 3000;

// 2. Configuração do Banco de Dados usando Variáveis de Ambiente
const dbConfig = {
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'senai',
    database: process.env.MYSQLDATABASE || 'instrumusic_db',
    port: process.env.MYSQLPORT || 3306
};

let dbPool;

async function initializeDatabase() {
    try {
        dbPool = mysql.createPool(dbConfig);
        await dbPool.getConnection();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ Erro ao conectar ao banco de dados:', error.message);
    }
}

initializeDatabase();

// --- Configuração do Middleware ---
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve arquivos estáticos

// --- Rotas para as Páginas HTML ---

// Rota principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Rota curinga para outras páginas
app.get('/:page', (req, res) => {
    // Impede que tentem acessar arquivos fora da pasta pages
    const pageName = req.params.page.replace(/[^a-zA-Z0-9_-]/g, '');
    const filePath = path.join(__dirname, 'public', 'pages', `${pageName}.html`);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('404 | Página não encontrada.');
    }
});

// --- Rotas de API (Backend) ---

// Cadastro
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Dados incompletos.' });
    if (!dbPool) return res.status(503).json({ success: false, message: 'Banco de dados indisponível.' });

    try {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await dbPool.execute(query, [name, email, password]);
        res.status(201).json({ success: true, message: 'Usuário registrado!' });
    } catch (error) {
        console.error('Erro cadastro:', error);
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'E-mail já cadastrado.' });
        res.status(500).json({ success: false, message: 'Erro interno.' });
    }
});

// Login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ success: false, message: 'Preencha todos os campos.' });
    if (!dbPool) return res.status(503).json({ success: false, message: 'Banco de dados indisponível.' });

    try {
        const [rows] = await dbPool.execute('SELECT id, name, email, password FROM users WHERE email = ?', [email]);
        const user = rows[0];

        if (user && user.password === password) {
            res.status(200).json({
                success: true,
                message: 'Login realizado!',
                user: { id: user.id, name: user.name, email: user.email },
                redirect: '/dashboard' // Corrigido para rota sem .html se preferir, ou mantenha .html
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
    } catch (error) {
        console.error('Erro login:', error);
        res.status(500).json({ success: false, message: 'Erro interno.' });
    }
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});