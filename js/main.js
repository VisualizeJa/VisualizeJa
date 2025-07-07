// main.js

// Alternar entre abas
function trocarAba(id) {
  document.querySelectorAll('.aba').forEach(aba => aba.classList.remove('ativa'));
  document.getElementById(id).classList.add('ativa');
}

// Menu de navegação
const linksMenu = document.querySelectorAll('nav.menu a');
linksMenu.forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const abaId = link.getAttribute('data-aba');
    trocarAba(abaId);
  });
});

// Iniciar na aba de upload por padrão
window.addEventListener('DOMContentLoaded', () => {
  trocarAba('upload');
});

// Base de exemplo manual (caso o usuário não envie arquivo)
function inserirBaseExemplo() {
  const exemplo = [
    ['Produto', 'Categoria', 'Valor', 'Data', 'Quantidade'],
    ['Camiseta', 'Vestuário', 49.9, '2024-06-01', 12],
    ['Calça', 'Vestuário', 99.9, '2024-06-02', 7],
    ['Notebook', 'Eletrônico', 2500, '2024-06-03', 2],
    ['Celular', 'Eletrônico', 1800, '2024-06-04', 4],
    ['Tênis', 'Calçados', 299.99, '2024-06-05', 10]
  ];
  montarTabela(exemplo);
}
// main.js

// Alternar tema claro/escuro
document.getElementById("toggleTheme").addEventListener("click", () => {
  const html = document.documentElement;
  const atual = html.getAttribute("data-theme");
  const novoTema = atual === "dark" ? "light" : "dark";
  html.setAttribute("data-theme", novoTema);
  localStorage.setItem("temaVisualizeJa", novoTema);
  document.getElementById("toggleTheme").innerText = novoTema === "dark" ? "🌙" : "☀️";
});

// Aplicar tema salvo
window.addEventListener("DOMContentLoaded", () => {
  const temaSalvo = localStorage.getItem("temaVisualizeJa") || "dark";
  document.documentElement.setAttribute("data-theme", temaSalvo);
  document.getElementById("toggleTheme").innerText = temaSalvo === "dark" ? "🌙" : "☀️";
});
document.addEventListener("DOMContentLoaded", () => {
  const linksMenu = document.querySelectorAll("nav.menu a");

  linksMenu.forEach(link => {
    link.addEventListener("click", () => {
      const abaSelecionada = link.getAttribute("data-aba");

      document.querySelectorAll(".aba").forEach(secao => {
        secao.classList.remove("ativa");
      });
      document.getElementById(abaSelecionada).classList.add("ativa");

      // Atualiza os selects do painel lateral ao abrir Dashboard
      if (abaSelecionada === "dashboard" && typeof atualizarColunasDashboard === "function") {
        atualizarColunasDashboard();
      }
    });
  });

  // Atualiza os selects do painel lateral ao abrir o site
  if (typeof atualizarColunasDashboard === "function") {
    atualizarColunasDashboard();
  }
});
