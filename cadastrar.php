<?php
require 'config.php';

if ($_SERVER["REQUEST_METHOD"] === "POST") {
  $nome = $_POST['nome'];
  $email = $_POST['emailCadastro'];
  $senha = password_hash($_POST['senhaCadastro'], PASSWORD_DEFAULT);

  $sql = "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)";
  $stmt = $conn->prepare($sql);
  $stmt->bind_param("sss", $nome, $email, $senha);

  if ($stmt->execute()) {
    echo "✅ Cadastro realizado com sucesso!";
  } else {
    echo "❌ Erro ao cadastrar: " . $stmt->error;
  }

  $stmt->close();
  $conn->close();
} else {
  echo "Acesso inválido.";
}
?>