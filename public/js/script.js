document.addEventListener('DOMContentLoaded', () => {
    console.log('InstruMusic: Frontend JavaScript carregado.');

    // Função para exibir mensagens na tela
    function showMessage(container, message, type = 'success') {
        container.innerText = message;
        container.className = `message ${type}`; 
        container.style.display = 'block';
        setTimeout(() => container.style.display = 'none', 4000); 
    }

    // --- Lógica do Formulário de Login ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        const loginMsg = document.createElement('div');
        loginMsg.className = 'message';
        loginForm.appendChild(loginMsg);

        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = loginForm.email.value;
            const password = loginForm.password.value;

            try {
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    showMessage(loginMsg, `Bem-vindo(a), ${data.user.name}!`, 'success');
                    setTimeout(() => window.location.href = data.redirect, 1000);
                } else {
                    showMessage(loginMsg, `Erro no login: ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Erro na requisição de login:', error);
                showMessage(loginMsg, 'Erro de comunicação com o servidor.', 'error');
            }
        });
    }

    // --- Lógica do Formulário de Cadastro ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        const registerMsg = document.createElement('div');
        registerMsg.className = 'message';
        registerForm.appendChild(registerMsg);

        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = registerForm.name.value;
            const email = registerForm.email.value;
            const password = registerForm.password.value;
            const confirmPassword = registerForm.confirmPassword.value;

            if (password !== confirmPassword) {
                showMessage(registerMsg, 'As senhas não coincidem!', 'error');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (data.success) {
                    showMessage(registerMsg, 'Cadastro realizado com sucesso! Redirecionando para login...', 'success');
                    setTimeout(() => window.location.href = 'login.html', 1500);
                } else {
                    showMessage(registerMsg, `Erro no cadastro: ${data.message}`, 'error');
                }
            } catch (error) {
                console.error('Erro na requisição de cadastro:', error);
                showMessage(registerMsg, 'Erro ao conectar com o servidor.', 'error');
            }
        });
    }

    // --- Logout ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            showMessage(document.body, 'Você saiu da conta.', 'success');
            setTimeout(() => window.location.href = 'index.html', 1000);
        });
    }
});
