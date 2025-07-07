// base.js COMPLETO E FUNCIONAL

let tabela = [];
let colunas = [];
let tiposColuna = [];
let tabelaOriginal = [];
let colunaSelecionadaIndex = null;
let historico = [];

function salvarHistorico() {
  historico.push(JSON.stringify(tabela));
}

function montarTabela(dados) {
  
  tabela = dados;
  colunas = tabela[0];
  atualizarColunasDashboard(); //
  tabela = JSON.parse(JSON.stringify(dados));
  if (tabelaOriginal.length === 0) tabelaOriginal = JSON.parse(JSON.stringify(dados));
  colunas = tabela[0];
  tiposColuna = colunas.map(() => "texto");

  const thead = document.getElementById("thead-row");
  const tbody = document.getElementById("tbody-dados");
  const campoExtra = document.getElementById("campoExtra");
  const filtroCol = document.getElementById("colunaSubstituir");
  const selectColuna = document.getElementById("selecionarColuna");
  const filtroDrop = document.getElementById("colunaFiltro");

  thead.innerHTML = "";
  tbody.innerHTML = "";
  filtroCol.innerHTML = "";
  selectColuna.innerHTML = '<option value="">-- Selecione uma coluna --</option>';
  filtroDrop.innerHTML = "";

  const rowHead = document.createDocumentFragment();
  colunas.forEach((col, i) => {
    const th = document.createElement("th");
    th.textContent = col;
    rowHead.appendChild(th);

    [selectColuna, filtroDrop, filtroCol].forEach(sel => {
      const opt = document.createElement("option");
      opt.value = i;
      opt.textContent = col;
      sel.appendChild(opt);
    });
  });
  thead.appendChild(rowHead);

  for (let i = 1; i < tabela.length; i++) {
    const row = document.createElement("tr");
    for (let j = 0; j < colunas.length; j++) {
      const cell = document.createElement("td");
      cell.contentEditable = true;
      cell.textContent = tabela[i][j] ?? "";
      row.appendChild(cell);
    }
    tbody.appendChild(row);
  }

  atualizarEstatisticas();
  if (typeof atualizarDashboard === "function") atualizarDashboard(tabela);
  if (typeof atualizarColunasDashboard === "function") atualizarColunasDashboard();
}

function selecionarColunaManual(index) {
  colunaSelecionadaIndex = parseInt(index);
  atualizarEstatisticas();
}

function aplicarTransformacao() {
  if (colunaSelecionadaIndex === null) return;
  salvarHistorico();
  const tipo = document.getElementById("tipoDado").value;
  const extra = document.getElementById("campoExtra").value;

  for (let i = 1; i < tabela.length; i++) {
    let val = tabela[i][colunaSelecionadaIndex].toString().replace(/[^\d.-]/g, "");
    let num = parseFloat(val);

    if (!isNaN(num)) {
      if (tipo === "moeda") {
        if (extra === "mil") num = (num / 1000).toFixed(2) + "K";
        else if (extra === "milhao") num = (num / 1000000).toFixed(2) + "M";
        else if (extra === "bilhao") num = (num / 1000000000).toFixed(2) + "B";
        else num = num.toFixed(2);
        tabela[i][colunaSelecionadaIndex] = num;
      } else if (tipo === "peso") {
        if (extra === "mil") num *= 1000;
        else if (extra === "milhao") num *= 1000000;
        else if (extra === "bilhao") num *= 1000000000;
        tabela[i][colunaSelecionadaIndex] = num;
      } else if (tipo === "percentual") {
        tabela[i][colunaSelecionadaIndex] = num.toFixed(2) + "%";
      }
    } else if (tipo === "data") {
      const date = new Date(tabela[i][colunaSelecionadaIndex]);
      if (!isNaN(date)) {
        if (extra === "dd/mm/yyyy") val = date.toLocaleDateString("pt-BR");
        else if (extra === "mm/yyyy") val = `${date.getMonth() + 1}/${date.getFullYear()}`;
        else if (extra === "yyyy") val = `${date.getFullYear()}`;
        tabela[i][colunaSelecionadaIndex] = val;
      }
    }
  }
  montarTabela(tabela);
}

function arredondarColuna() {
  if (colunaSelecionadaIndex === null) return;
  salvarHistorico();
  for (let i = 1; i < tabela.length; i++) {
    let val = parseFloat(tabela[i][colunaSelecionadaIndex]);
    if (!isNaN(val)) tabela[i][colunaSelecionadaIndex] = Math.round(val);
  }
  montarTabela(tabela);
}

function desfazerTransformacoes() {
  if (historico.length === 0) return;
  const anterior = historico.pop();
  tabela = JSON.parse(anterior);
  montarTabela(tabela);
}

document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.key === "z") desfazerTransformacoes();
});

function abrirSubstituir() {
  document.getElementById("modalSubstituir").style.display = "block";
}
function fecharSubstituir() {
  document.getElementById("modalSubstituir").style.display = "none";
}
function aplicarSubstituicao() {
  const colIndex = parseInt(document.getElementById("colunaSubstituir").value);
  const de = document.getElementById("valorDe").value;
  const para = document.getElementById("valorPara").value;
  salvarHistorico();
  for (let i = 1; i < tabela.length; i++) {
    if (tabela[i][colIndex] == de) tabela[i][colIndex] = para;
  }
  montarTabela(tabela);
  fecharSubstituir();
}

function limparSelecaoManual() {
  colunaSelecionadaIndex = null;
  document.getElementById("selecionarColuna").value = "";
}

function aplicarFiltro() {
  const index = document.getElementById("colunaFiltro").value;
  const valor = document.getElementById("valorFiltro").value.toLowerCase();
  if (!index || !valor) return montarTabela(tabelaOriginal);
  const filtrada = tabelaOriginal.filter((linha, i) => {
    if (i === 0) return true;
    return (linha[index] + "").toLowerCase().includes(valor);
  });
  montarTabela(filtrada);
}
function limparFiltro() {
  document.getElementById("valorFiltro").value = "";
  montarTabela(tabelaOriginal);
}

function exportarExcel() {
  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.aoa_to_sheet(tabela);
  XLSX.utils.book_append_sheet(wb, ws, "Base");
  XLSX.writeFile(wb, "VisualizeJa_Base.xlsx");
}

function adicionarLinha() {
  salvarHistorico();
  const nova = new Array(colunas.length).fill("");
  tabela.push(nova);
  montarTabela(tabela);
}
function removerLinhaSelecionada() {
  salvarHistorico();
  if (tabela.length > 1) tabela.pop();
  montarTabela(tabela);
}

function adicionarColuna() {
  salvarHistorico();
  const nome = prompt("Nome da nova coluna:");
  if (!nome) return;
  colunas.push(nome);
  tiposColuna.push("texto");
  for (let i = 1; i < tabela.length; i++) {
    tabela[i].push("");
  }
  montarTabela(tabela);
}
function removerColunaSelecionada() {
  if (colunaSelecionadaIndex === null) return;
  salvarHistorico();
  colunas.splice(colunaSelecionadaIndex, 1);
  tiposColuna.splice(colunaSelecionadaIndex, 1);
  for (let i = 1; i < tabela.length; i++) {
    tabela[i].splice(colunaSelecionadaIndex, 1);
  }
  colunaSelecionadaIndex = null;
  montarTabela(tabela);
}

function atualizarEstatisticas() {
  const painel = document.getElementById("painelEstatisticas");
  painel.innerHTML = "";

  const totalRegistros = tabela.length - 1;
  const cardRegistros = document.createElement("div");
  cardRegistros.className = "cartao-estatistica";
  cardRegistros.innerHTML = `<h4>📁 Registros</h4><p><strong>${totalRegistros}</strong></p>`;
  painel.appendChild(cardRegistros);

  if (colunaSelecionadaIndex === null) return;

  const valores = [];
  for (let i = 1; i < tabela.length; i++) {
    const val = parseFloat(tabela[i][colunaSelecionadaIndex].toString().replace(/[^\d.-]/g, ""));
    if (!isNaN(val)) valores.push(val);
  }

  if (valores.length > 0) {
    const total = valores.reduce((a, b) => a + b, 0);
    const max = Math.max(...valores);
    const min = Math.min(...valores);
    const mediana = calcularMediana(valores);
    const card = document.createElement("div");
    card.className = "cartao-estatistica";
    card.innerHTML = `
      <h4>${colunas[colunaSelecionadaIndex]}</h4>
      <p>🔢 Total: ${total.toFixed(2)}</p>
      <p>🔼 Máx: ${max.toFixed(2)}</p>
      <p>🔽 Mín: ${min.toFixed(2)}</p>
      <p>📊 Mediana: ${mediana.toFixed(2)}</p>
    `;
    painel.appendChild(card);
  }
}

function calcularMediana(lista) {
  lista.sort((a, b) => a - b);
  const meio = Math.floor(lista.length / 2);
  return lista.length % 2 === 0 ? (lista[meio - 1] + lista[meio]) / 2 : lista[meio];
}

function preencherCampoExtra() {
  const tipo = document.getElementById("tipoDado").value;
  const campoExtra = document.getElementById("campoExtra");
  campoExtra.innerHTML = "";

  if (["moeda", "peso"].includes(tipo)) {
    ["", "mil", "milhao", "bilhao"].forEach(opt => {
      const o = document.createElement("option");
      o.value = opt;
      o.textContent = opt.charAt(0).toUpperCase() + opt.slice(1);
      campoExtra.appendChild(o);
    });
  } else if (tipo === "data") {
    ["dd/mm/yyyy", "mm/yyyy", "yyyy"].forEach(f => {
      const opt = document.createElement("option");
      opt.value = f;
      opt.textContent = f;
      campoExtra.appendChild(opt);
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const tipo = document.getElementById("tipoDado");
  if (tipo) tipo.addEventListener("change", preencherCampoExtra);
});
