/**
 * Arquivo: public/js/auth.js
 * Descrição: Lógica de verificação de autenticação e Logout.
 */

document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Função de Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Remove o token e o nome do usuário
            localStorage.removeItem('userToken');
            localStorage.removeItem('userName'); 
            
            // Informa o usuário e redireciona
            alert('Você saiu da conta com sucesso!'); 
            window.location.href = '/public/pages/index.html'; 
        });
    }

    // 2. Função de Verificação de Autenticação para Proteger Páginas
    // Para usar esta função: adicione <script src="/public/js/auth.js"></script> no topo da página
    // e no BODY da página que você quer proteger (ex: perfil.html), adicione o atributo:
    // <body data-auth-required="true">
    
    const requiresAuth = document.body.getAttribute('data-auth-required') === 'true'; 
    const token = localStorage.getItem('userToken');

    if (requiresAuth) {
        if (!token) {
            // Se a página exige autenticação e o token não existe
            alert('Acesso negado. Faça login para acessar esta área.');
            window.location.href = '/public/pages/login.html'; 
        } 
        // Em um sistema mais complexo, você faria uma requisição ao backend
        // para validar se o token não expirou.
    }
    
    // 3. Redirecionamento de Páginas de Autenticação
    // Se o usuário já tem um token, ele não deve ver login/cadastro
    const authPages = ['login.html', 'register.html'];
    const currentPage = window.location.pathname.split('/').pop();

    if (authPages.includes(currentPage) && token) {
        // Se estiver em login ou cadastro E já estiver logado, redireciona para a home
        alert('Você já está logado!');
        window.location.href = '/public/pages/index.html'; 
    }
    
    // 4. Exibir nome do usuário (Opcional, se houver um elemento #userNameDisplay)
    const userNameDisplay = document.getElementById('userNameDisplay');
    const userName = localStorage.getItem('userName');
    if (userNameDisplay && userName) {
        userNameDisplay.textContent = `Olá, ${userName}`;
    }
});