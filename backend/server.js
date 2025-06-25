// server.js
const express = require('express'); // Importa o Express.js
const app = express(); // Cria uma  ância do aplicativo Express
const PORT = process.env.PORT || 3000; // Define a porta do servidor, usando a variável de ambiente ou 3000 por padrão

// Middleware para parsear JSON no corpo das requisições (importante para receber dados do frontend)
app.use(express.json());

// --- Rotas da API (Endpoints) ---

// Rota de exemplo: GET para a raiz (/)
app.get('/', (req, res) => {
    res.send('Bem-vindo ao backend da IntruMusic! O servidor está funcionando.');
});

// Rota de exemplo para cadastro de usuário (POST)
// ESTA É UMA SIMULAÇÃO MUITO BÁSICA. EM UM CASO REAL, AQUI TERIA VALIDAÇÃO, HASH DE SENHA E SALVAMENTO NO BANCO DE DADOS.
app.post('/api/register', (req, res) => {
    const { name, email, password } = req.body; // Pega os dados do corpo da requisição

    if (!name || !email || !password) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    console.log(`Tentativa de cadastro: Nome - ${name}, Email - ${email}, Senha - ${password}`);

    // Simulação de salvamento bem-sucedido (sem banco de dados real aqui)
    // Em um sistema real, você salvaria isso em um DB e geraria um ID de usuário, etc.
    res.status(201).json({ message: 'Usuário cadastrado com sucesso (simulado)!', user: { name, email } });
});

// Rota de exemplo para login de usuário (POST)
// ESTA É UMA SIMULAÇÃO MUITO BÁSICA. EM UM CASO REAL, AQUI TERIA VERIFICAÇÃO DE SENHA HASHEADA E GERAÇÃO DE TOKEN.
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'E-mail e senha são obrigatórios.' });
    }

    console.log(`Tentativa de login: Email - ${email}, Senha - ${password}`);

    // Simulação de um usuário existente para teste
    const testUserEmail = 'test@example.com';
    const testUserPassword = 'password123'; // Lembre-se: em produção, nunca armazene senhas em texto puro!

    if (email === testUserEmail && password === testUserPassword) {
        res.status(200).json({ message: 'Login bem-sucedido (simulado)!', token: 'fake-jwt-token-123', user: { name: 'Usuário Teste', email } });
    } else {
        res.status(401).json({ message: 'Credenciais inválidas (simulado).' });
    }
});


// Inicia o servidor e o faz "escutar" requisições na porta definida
app.listen(PORT, () => {
    console.log(`Servidor backend rodando em http://localhost:${PORT}`);
    console.log('Use Ctrl+C para parar o servidor.');
});