<?php
session_start();
if (!isset($_SESSION['usuario'])) {
  header("Location: login.html");
  exit;
}
$usuario = $_SESSION['usuario'];
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
  <meta charset="UTF-8" />
  <title>Painel</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light text-center mt-5">
  <h2>🎵 Olá, <?php echo htmlspecialchars($usuario['nome']); ?>!</h2>
  <p>Bem-vindo ao seu painel.</p>
  <a href="perfil.php" class="btn btn-outline-primary me-2">Ver Perfil</a>
  <a href="logout.php" class="btn btn-outline-danger">Sair</a>
</body>
</html>