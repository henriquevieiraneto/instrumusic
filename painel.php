<?php
session_start();

// Verifica se o usuário está logado
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
  <title>Painel do Usuário - IntruMusic</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light">
  <div class="container mt-5">
    <div class="text-center">
      <h2>🎵 Olá, <?php echo htmlspecialchars($usuario['nome']); ?>!</h2>
      <p>Seja bem-vindo à sua área na IntruMusic.</p>
      <div class="mt-4">
        <a href="perfil.php" class="btn btn-outline-primary">Ver Perfil</a>
        <a href="logout.php" class="btn btn-outline-danger">Sair</a>
      </div>
    </div>
  </div>
</body>
</html>