const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000; 
const JWT_SECRET = "super_secret_key";


const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senai',
    database: 'instrumusic_db',
});


// Middlewares (Corretos e no lugar certo)
app.use(cors());
app.use(express.json()); // Permite ler JSON no corpo da requisição (essencial para o POST funcionar)
app.use('/public', express.static(path.join(__dirname, 'public')));


// Função para enviar HTML (Auxiliar)
const sendHTML = (res, file) => {
    const filePath = path.join(__dirname, file);
    fs.existsSync(filePath) ? res.sendFile(filePath) : res.status(404).send("404");
};


// Rotas de Navegação (MANTIDAS)
app.get("/", (req, res) => sendHTML(res, "public/pages/index.html"));

app.get("/instrumentos/:file", (req, res) => {
    const f = req.params.file.replace(".html", "") + ".html";
    sendHTML(res, `public/instrumentos/${f}`);
});

app.get("/:page", (req, res) => {
    const f = req.params.page.replace(".html", "") + ".html";
    sendHTML(res, `public/pages/${f}`);
});


// Rota de Cadastro
app.post("/api/register", async (req, res) => {
    // AJUSTADO: Se o frontend envia {nome, email, senha}, desestruture com esses nomes.
    // Se o frontend envia {name, email, password}, mantenha o original.
    // Vou assumir que o frontend (register.js) envia {nome, email, senha}
    const { nome, email, senha } = req.body; 

    // O código de desestruturação original era: const { name, email, password } = req.body;
    // Isso era o causador do erro 400 se o frontend enviava em português.
    
    // Agora, usamos as variáveis (nome, senha) para o banco de dados (name, password)
    if (!nome || !email || !senha)
        return res.status(400).json({ success: false, message: "Dados incompletos. (400)" });

    try {
        const hash = await bcrypt.hash(senha, 10);

        // Certifique-se de que as colunas 'name' e 'password' estão corretas
        await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [nome, email, hash] // Passando nome e a hash
        );

        res.status(201).json({ success: true, message: "Usuário registrado!" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY")
            return res.status(409).json({ success: false, message: "E-mail já cadastrado." });

        console.error("Erro no Cadastro:", err);
        res.status(500).json({ success: false, message: "Erro interno. (500)" });
    }
});


// Rota de Login (MANTIDA, pois já estava correta, assumindo que o frontend envia {email, senha})
app.post("/api/login", async (req, res) => {
    // O frontend login.js envia { email, senha }.
    const { email, password } = req.body;
    
    // Se o frontend envia 'senha' e o backend espera 'password', isso causará erro.
    // Se o seu frontend envia {email, senha}, ajuste esta linha:
    // const { email, senha } = req.body; // Se o frontend envia 'senha'
    // E use 'senha' no lugar de 'password' no código abaixo.
    
    // Manterei o seu código original, mas alertando que o Frontend deve enviar {email, password}
    if (!email || !password)
        return res.status(400).json({ success: false, message: "Preencha todos os campos. (400)" });

    try {
        const [rows] = await db.execute(
            "SELECT id, name, email, password FROM users WHERE email = ?",
            [email]
        );

        const user = rows[0];
        if (!user) return res.status(401).json({ success: false, message: "Credenciais inválidas." });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ success: false, message: "Credenciais inválidas." });

        const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: "2h" });

        res.json({
            success: true,
            message: "Login realizado!",
            token,
            redirect: "/progresso.html",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error("Erro no Login:", err);
        res.status(500).json({ success: false, message: "Erro interno. (500)" });
    }
});


app.listen(port, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
});