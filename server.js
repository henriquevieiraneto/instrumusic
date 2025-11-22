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
    // Leitura robusta das variáveis de ambiente do Railway
    host: process.env.MYSQLHOST || 'localhost',
    user: process.env.MYSQLUSER || 'root',
    password: process.env.MYSQLPASSWORD || 'local_password', 
    database: process.env.MYSQLDATABASE || 'instrumusic_db',
    
    // CORREÇÃO CRÍTICA: Converte a porta para número inteiro
    port: parseInt(process.env.MYSQLPORT || 3306, 10), 
    
    // Adiciona SSL/TLS para ambiente de nuvem
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : undefined
};

let dbPool;

async function initializeDatabase() {
    try {
        dbPool = mysql.createPool(dbConfig);
        await dbPool.getConnection();
        console.log('✅ Conexão com o banco de dados estabelecida com sucesso!');
    } catch (error) {
        console.error('❌ ERRO CRÍTICO: Falha ao conectar/testar o banco de dados:', error.message);
    }
}

initializeDatabase();

// --- Configuração do Middleware ---
app.use(cors());
app.use(express.json());

// 3. Middleware para servir arquivos estáticos (CSS, JS, Imagens, Instrumentos HTML)
// Isso garante que links como /public/css/styles.css funcionem
app.use('/public', express.static(path.join(__dirname, 'public')));

// --- Rotas para as Páginas HTML (Localizadas em public/pages) ---

// Rota principal (GET /)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'pages', 'index.html'));
});

// Rota DEDICADA para servir os arquivos HTML que estão em public/instrumentos/
// Permite acessar URLs como: /instrumentos/guitarra.html
app.get('/instrumentos/:instrumento', (req, res) => {
    const instrumentName = req.params.instrumento.endsWith('.html') ? req.params.instrumento : `${req.params.instrumento}.html`;
    const filePath = path.join(__dirname, 'public', 'instrumentos', instrumentName);
    
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('404 | Instrumento não encontrado.');
    }
});

// Rota curinga para servir qualquer HTML em /public/pages/
app.get('/:page', (req, res) => {
    const pageName = req.params.page.endsWith('.html') ? req.params.page : `${req.params.page}.html`;
    const filePath = path.join(__dirname, 'public', 'pages', pageName);

    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('404 | Página não encontrada.');
    }
});

// --- Rotas de API (Backend) ---

// POST /api/register (Cadastro)
app.post('/api/register', async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({ success: false, message: 'Dados incompletos.' });
    if (!dbPool) return res.status(503).json({ success: false, message: 'Banco de dados indisponível. Verifique a conexão.' });

    try {
        const query = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
        await dbPool.execute(query, [name, email, password]);
        res.status(201).json({ success: true, message: 'Usuário registrado!' });
    } catch (error) {
        console.error('❌ Erro no registro de usuário:', error.message); 
        if (error.code === 'ER_DUP_ENTRY') return res.status(409).json({ success: false, message: 'E-mail já cadastrado.' });
        // Se o erro for "Table 'users' doesn't exist", significa que o SQL não foi rodado!
        res.status(500).json({ success: false, message: `Erro interno no servidor: ${error.message}` });
    }
});

// POST /api/login (Login)
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
                redirect: '/dashboard.html'
            });
        } else {
            res.status(401).json({ success: false, message: 'Credenciais inválidas.' });
        }
    } catch (error) {
        console.error('❌ Erro no login:', error.message);
        res.status(500).json({ success: false, message: `Erro interno no servidor: ${error.message}` });
    }
});

// --- Inicialização do Servidor ---
app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
});