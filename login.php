<?php
session_start();
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $email = $_POST['email'];
  $senha = $_POST['senha'];

  $sql = "SELECT * FROM usuarios WHERE email = ?";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("s", $email);
  $stmt->execute();
  $resultado = $stmt->get_result();
  $usuario = $resultado->fetch_assoc();

  if ($usuario && password_verify($senha, $usuario['senha'])) {
    $_SESSION['usuario'] = [
      "id" => $usuario['id'],
      "nome" => $usuario['nome'],
      "email" => $usuario['email']
    ];
    header("Location: painel.php");
    exit;
  } else {
    echo "❌ E-mail ou senha incorretos.";
  }

  $stmt->close();
  $conn->close();
} else {
  echo "Acesso inválido.";
}
?>