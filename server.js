const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const mysql = require('mysql2/promise');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();
const port = 3000; // Porta local fixa
const JWT_SECRET = "super_secret_key"; // Chave fixa local


// 🔥 CONEXÃO DIRETA COM MYSQL LOCAL (SEM NUVEM)
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'senai',
    database: 'instrumusic_db',
    port: 3306
});


app.use(cors());
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));


// Função para enviar HTML
const sendHTML = (res, file) => {
    const filePath = path.join(__dirname, file);
    fs.existsSync(filePath) ? res.sendFile(filePath) : res.status(404).send("404");
};


// Rotas
app.get("/", (req, res) => sendHTML(res, "public/pages/index.html"));

app.get("/instrumentos/:file", (req, res) => {
    const f = req.params.file.replace(".html", "") + ".html";
    sendHTML(res, `public/instrumentos/${f}`);
});

app.get("/:page", (req, res) => {
    const f = req.params.page.replace(".html", "") + ".html";
    sendHTML(res, `public/pages/${f}`);
});


// 📌 Cadastro
app.post("/api/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ success: false, message: "Dados incompletos." });

    try {
        const hash = await bcrypt.hash(password, 10);

        await db.execute(
            "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
            [name, email, hash]
        );

        res.status(201).json({ success: true, message: "Usuário registrado!" });
    } catch (err) {
        if (err.code === "ER_DUP_ENTRY")
            return res.status(409).json({ success: false, message: "E-mail já cadastrado." });

        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno." });
    }
});


// 📌 Login
app.post("/api/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ success: false, message: "Preencha todos os campos." });

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
            redirect: "/dashboard.html",
            user: { id: user.id, name: user.name, email: user.email }
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: "Erro interno." });
    }
});


app.listen(port, () => {
    console.log(`🚀 Servidor rodando em: http://localhost:${port}`);
});
