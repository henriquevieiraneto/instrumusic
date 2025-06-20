<?php
session_start(); // Inicia a sessão (caso ainda não esteja ativa)
session_unset(); // Limpa todas as variáveis da sessão
session_destroy(); // Destroi a sessão

// Redireciona para a página de login
header("Location: login.html");
exit;
?>