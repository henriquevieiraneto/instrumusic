<?php
session_start();

// Protege a página: se não estiver logado, redireciona
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
  <title>Perfil do Usuário</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" />
</head>
<body class="bg-light">
  <div class="container mt-5">
    <div class="card mx-auto shadow" style="max-width: 500px;">
      <div class="card-body">
        <h3 class="card-title mb-4 text-center">👤 Meu Perfil</h3>

        <p><strong>Nome:</strong> <?php echo htmlspecialchars($usuario['nome']); ?></p>
        <p><strong>E-mail:</strong> <?php echo htmlspecialchars($usuario['email']); ?></p>
        <p><strong>ID do usuário:</strong> <?php echo $usuario['id']; ?></p>

        <div class="mt-4 d-flex justify-content-between">
          <a href="painel.php" class="btn btn-secondary">← Voltar ao Painel</a>
          <a href="logout.php" class="btn btn-danger">Sair</a>
        </div>
      </div>
    </div>
  </div>
</body>
</html>