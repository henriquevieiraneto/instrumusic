// Espera o carregamento do conteúdo da página
document.addEventListener('DOMContentLoaded', () => {
  // Saudação personalizada na index
  const nome = localStorage.getItem('nomeUsuario');
  if (nome && document.title.includes('IntruMusic')) {
    const saudacao = document.createElement('div');
    saudacao.className = 'alert alert-success text-center';
    saudacao.innerText = `🎵 Olá, ${nome}! Que bom te ver de novo.`;
    document.body.prepend(saudacao);
  }

  // Validação básica de formulários
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', (event) => {
    const nomeInput = document.querySelector('#nome');
    const emailInput = document.querySelector('#email') || document.querySelector('#emailCadastro');
    const senhaInput = document.querySelector('#senha') || document.querySelector('#senhaCadastro');

    if (!emailInput.value || !senhaInput.value) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      event.preventDefault();
      return;
    }

    if (nomeInput && nomeInput.value) {
      localStorage.setItem('nomeUsuario', nomeInput.value.trim());
      alert(`Cadastro realizado! Bem-vindo(a), ${nomeInput.value.trim()}!`);
    } else {
      alert('Login realizado com sucesso!');
    }
  });
});