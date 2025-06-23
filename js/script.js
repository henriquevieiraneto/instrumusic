document.addEventListener('DOMContentLoaded', () => {

    // --- Funções Auxiliares para LocalStorage ---

    // Função para carregar usuários existentes ou iniciar um array vazio
    function loadUsers() {
        // Tenta pegar os usuários do localStorage. Se não houver, retorna um array vazio.
        const usersJSON = localStorage.getItem('intrumusicUsers');
        return usersJSON ? JSON.parse(usersJSON) : [];
    }

    // Função para salvar o array de usuários no localStorage
    function saveUsers(users) {
        // Converte o array de usuários para string JSON e salva no localStorage.
        localStorage.setItem('intrumusicUsers', JSON.stringify(users));
    }

    // Função para salvar o usuário atualmente logado (simulação de sessão)
    function saveLoggedInUser(user) {
        // Salva as informações do usuário logado no localStorage.
        localStorage.setItem('loggedInUser', JSON.stringify(user));
    }

    // Função para carregar o usuário logado
    function loadLoggedInUser() {
        // Tenta pegar o usuário logado do localStorage. Se não houver, retorna null.
        const userJSON = localStorage.getItem('loggedInUser');
        return userJSON ? JSON.parse(userJSON) : null;
    }

    // Função para remover o usuário logado (logout)
    function clearLoggedInUser() {
        // Remove a entrada do usuário logado do localStorage.
        localStorage.removeItem('loggedInUser');
    }

    // --- Lógica para a Página de Cadastro (register.html) ---
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;

            // Validação de senhas
            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return; // Impede o cadastro
            }

            // Carrega a lista atual de usuários
            let users = loadUsers();

            // Verificar se o email já está cadastrado (simulação)
            const userExists = users.some(user => user.email === email);
            if (userExists) {
                alert('Este e-mail já está cadastrado. Tente fazer login.');
                return; // Impede o cadastro
            }

            // Adiciona o novo usuário ao array (em um sistema real, a senha seria hashed aqui!)
            const newUser = { name, email, password };
            users.push(newUser);
            saveUsers(users); // Salva o array atualizado de volta no localStorage

            alert(`Cadastro de ${name} realizado com sucesso! Agora você pode fazer login.`);
            window.location.href = 'login.html'; // Redireciona para a página de login
        });
    }

    // --- Lógica para a Página de Login (login.html) ---
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Impede o envio padrão do formulário

            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;

            const users = loadUsers(); // Carrega a lista de usuários cadastrados

            // Simula a autenticação: busca um usuário com o email e senha correspondentes
            // (Em um sistema real, você compararia a senha fornecida com a senha HASHEADA do banco de dados)
            const foundUser = users.find(user => user.email === email && user.password === password);

            if (foundUser) {
                saveLoggedInUser(foundUser); // Salva o usuário logado no localStorage para "manter a sessão"
                alert(`Login bem-sucedido! Bem-vindo(a), ${foundUser.name}. Redirecionando para o painel...`);
                window.location.href = 'dashboard.html'; // Redireciona para o painel
            } else {
                alert('E-mail ou senha incorretos.');
            }
        });
    }

    // --- Lógica para a Página do Dashboard (dashboard.html) ---
    const dashboardUsernameSpan = document.getElementById('dashboard-username');
    const logoutBtn = document.getElementById('logout-btn');

    // Verifica se estamos na página do dashboard e se o span do nome existe
    if (dashboardUsernameSpan) {
        const loggedInUser = loadLoggedInUser(); // Tenta carregar o usuário logado

        if (loggedInUser) {
            // Se houver um usuário logado, exibe o nome dele
            dashboardUsernameSpan.textContent = loggedInUser.name;
        } else {
            // Se não houver usuário logado, impede o acesso ao dashboard
            alert('Você não está logado. Por favor, faça login para acessar o painel.');
            window.location.href = 'entry.html'; // Redireciona para a página de entrada
        }
    }

    // Lógica para o botão de Sair (Logout)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(event) {
            event.preventDefault(); // Impede o comportamento padrão do link
            clearLoggedInUser(); // Limpa as informações do usuário logado do localStorage
            alert('Você foi desconectado.');
            window.location.href = 'index.html'; // Redireciona para a página inicial
        });
    }
});