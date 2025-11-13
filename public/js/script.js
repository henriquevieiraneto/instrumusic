document.addEventListener('DOMContentLoaded', () => {
    console.log('InstruMusic: Frontend JavaScript carregado.');

    // --- Lógica do Formulário de Login ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            try {
                // Requisição POST para a rota de login no servidor
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Login bem-sucedido! Bem-vindo(a), ' + data.user.name + '!');
                    // Redireciona para o dashboard após o sucesso
                    window.location.href = data.redirect; 
                } else {
                    alert('Erro no Login: ' + data.message);
                }
            } catch (error) {
                console.error('Erro na requisição de login:', error);
                alert('Erro de comunicação com o servidor. Verifique o console.');
            }
        });
    }


    // --- Lógica do Formulário de Cadastro ---
    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('As senhas não coincidem!');
                return;
            }

            try {
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ name, email, password })
                });

                const data = await response.json();

                if (data.success) {
                    alert('Cadastro realizado com sucesso! Faça login para continuar.');
                    window.location.href = 'login.html'; 
                } else {
                    alert('Erro no Cadastro: ' + data.message);
                }
            } catch (error) {
                console.error('Erro na requisição de cadastro:', error);
                alert('Erro ao conectar com o servidor. Tente novamente mais tarde.');
            }
        });
    }

    // --- Outras lógicas (Dashboard - Sair) ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            // Lógica de logout simulada
            alert('Você saiu da conta.');
            window.location.href = 'index.html';
        });
    }
});