<?php
session_start(); // Inicia a sessão

require 'config.php';

// Verifica se os dados vieram via POST
if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST['email'];
  $senha = $_POST['senha'];

  // Consulta o banco pelo e-mail informado
  $sql = "SELECT * FROM usuarios WHERE email = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $resultado = $stmt->get_result();
  $usuario = $resultado->fetch_assoc();

  // Se encontrou o usuário e a senha está correta
  if ($usuario && password_verify($senha, $usuario['senha'])) {
    // Cria a sessão com os dados necessários
    $_SESSION['usuario'] = [
      "id" => $usuario['id'],
      "nome" => $usuario['nome'],
      "email" => $usuario['email']
    ];

    // Redireciona para o painel
    header("Location: painel.php");
    exit;
  } else {
    echo "❌ E-mail ou senha inválidos.";
  }

  $stmt->close();
  $conn->close();
} else {
  echo "Acesso inválido.";
}
?>