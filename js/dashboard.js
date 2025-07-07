let graficosCriados = 0;
let graficoSelecionado = null;

// Atualiza colunas nos selects
function atualizarColunasDashboard() {
  const colunaX = document.getElementById("colunaX");
  const colunaY = document.getElementById("colunaY");

  if (!colunas || colunas.length === 0) return;

  colunaX.innerHTML = "";
  colunaY.innerHTML = "";

  colunas.forEach((col, i) => {
    const optX = document.createElement("option");
    optX.value = i;
    optX.textContent = col;
    colunaX.appendChild(optX);

    const optY = document.createElement("option");
    optY.value = i;
    optY.textContent = col;
    colunaY.appendChild(optY);
  });
}

function criarPainelGrafico() {
  const tipo = document.getElementById("tipoGrafico").value;
  const colX = parseInt(document.getElementById("colunaX").value);
  const colY = parseInt(document.getElementById("colunaY").value);
  const operacao = document.getElementById("tipoAgregacao").value.toLowerCase();

  if (isNaN(colX) || isNaN(colY) || tabela.length <= 1) {
    alert("Dados ou colunas inválidas.");
    return;
  }

  const agrupado = {};
  for (let i = 1; i < tabela.length; i++) {
    const x = tabela[i][colX];
    const valY = parseFloat((tabela[i][colY] + "").replace(/[^\d.-]/g, ""));
    if (isNaN(valY)) continue;
    if (!agrupado[x]) agrupado[x] = [];
    agrupado[x].push(valY);
  }

  const categorias = [];
  const valores = [];

  for (const x in agrupado) {
    categorias.push(x);
    const nums = agrupado[x];
    let resultado = 0;
    if (operacao === "soma") resultado = nums.reduce((a, b) => a + b, 0);
    else if (operacao === "média") resultado = nums.reduce((a, b) => a + b, 0) / nums.length;
    else if (operacao === "máximo") resultado = Math.max(...nums);
    else if (operacao === "mínimo") resultado = Math.min(...nums);
    else if (operacao === "contagem") resultado = nums.length;
    valores.push(parseFloat(resultado.toFixed(2)));
  }

  const div = document.createElement("div");
  div.className = "grafico-painel";
  div.id = "grafico_" + graficosCriados;
  div.style.width = "500px";
  div.style.height = "350px";
  div.style.position = "relative";

  const chartDiv = document.createElement("div");
  chartDiv.style.width = "100%";
  chartDiv.style.height = "100%";
  div.appendChild(chartDiv);

  const btns = document.createElement("div");
  btns.className = "controle-grafico";
  btns.innerHTML = `
    <button onclick="abrirConfiguracao(this)">⚙️</button>
    <button onclick="exportarComoImagem(this)">🖼️</button>
    <button onclick="this.parentElement.parentElement.remove()">❌</button>
  `;
  div.appendChild(btns);

  document.getElementById("area-graficos").appendChild(div);

  const chart = echarts.init(chartDiv);
  const option = {
    title: { text: colunas[colY] + " por " + colunas[colX], left: "center" },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: categorias },
    yAxis: { type: "value" },
    series: [{
      name: operacao,
      type: tipo,
      data: valores,
      label: { show: true, position: "top" }
    }]
  };
  chart.setOption(option);
  div.setAttribute("data-opcao", JSON.stringify({ tipo, colX, colY, operacao }));
  graficosCriados++;

  new ResizeObserver(() => chart.resize()).observe(div);
  enableDrag(div);
  enableResize(div);
}

function abrirConfiguracao(botao) {
  const graficoDiv = botao.parentElement.parentElement;
  graficoSelecionado = graficoDiv;

  const config = JSON.parse(graficoDiv.getAttribute("data-opcao"));

  document.getElementById("editTitulo").value = graficoDiv.querySelector(".echarts-title")?.textContent || "";
  document.getElementById("editTipoGrafico").value = config.tipo;

  const selectX = document.getElementById("editColunaX");
  const selectY = document.getElementById("editColunaY");
  selectX.innerHTML = "";
  selectY.innerHTML = "";

  colunas.forEach((col, i) => {
    const optX = new Option(col, i);
    const optY = new Option(col, i);
    selectX.appendChild(optX);
    selectY.appendChild(optY);
  });

  selectX.value = config.colX;
  selectY.value = config.colY;
  document.getElementById("editAgregacao").value = capitalizar(config.operacao);
  document.getElementById("painelConfiguracao").style.display = "block";
}

function aplicarConfiguracaoGrafico() {
  if (!graficoSelecionado) return;

  const tipo = document.getElementById("editTipoGrafico").value;
  const colX = parseInt(document.getElementById("editColunaX").value);
  const colY = parseInt(document.getElementById("editColunaY").value);
  const operacao = document.getElementById("editAgregacao").value.toLowerCase();
  const titulo = document.getElementById("editTitulo").value;
  const corGrafico = document.getElementById("editCorGrafico").value;
  const corTitulo = document.getElementById("editCorTitulo").value;
  const tamanhoTitulo = parseInt(document.getElementById("editTamanhoTitulo").value);
  const corRotulo = document.getElementById("editCorRotulo").value;
  const tamanhoRotulo = parseInt(document.getElementById("editTamanhoRotulo").value);

  const agrupado = {};
  for (let i = 1; i < tabela.length; i++) {
    const x = tabela[i][colX];
    const valY = parseFloat((tabela[i][colY] + "").replace(/[^\d.-]/g, ""));
    if (isNaN(valY)) continue;
    if (!agrupado[x]) agrupado[x] = [];
    agrupado[x].push(valY);
  }

  const categorias = [], valores = [];
  for (const x in agrupado) {
    categorias.push(x);
    const nums = agrupado[x];
    let resultado = 0;
    if (operacao === "soma") resultado = nums.reduce((a, b) => a + b, 0);
    else if (operacao === "média") resultado = nums.reduce((a, b) => a + b, 0) / nums.length;
    else if (operacao === "máximo") resultado = Math.max(...nums);
    else if (operacao === "mínimo") resultado = Math.min(...nums);
    else if (operacao === "contagem") resultado = nums.length;
    valores.push(parseFloat(resultado.toFixed(2)));
  }

  const chartDiv = graficoSelecionado.querySelector("div");
  const chart = echarts.getInstanceByDom(chartDiv);

  const option = {
    title: {
      text: titulo,
      left: "center",
      textStyle: { color: corTitulo, fontSize: tamanhoTitulo }
    },
    tooltip: { trigger: "axis" },
    xAxis: { type: "category", data: categorias },
    yAxis: { type: "value" },
    series: [{
      name: operacao,
      type: tipo,
      data: valores,
      label: {
        show: true,
        position: "top",
        color: corRotulo,
        fontSize: tamanhoRotulo
      },
      itemStyle: { color: corGrafico }
    }]
  };
  chart.setOption(option);
  graficoSelecionado.setAttribute("data-opcao", JSON.stringify({ tipo, colX, colY, operacao }));
  fecharPainelConfiguracao();
}

function fecharPainelConfiguracao() {
  document.getElementById("painelConfiguracao").style.display = "none";
  graficoSelecionado = null;
}

function exportarComoImagem(btn) {
  const chartDiv = btn.parentElement.parentElement.querySelector("div");
  const chart = echarts.getInstanceByDom(chartDiv);
  const base64 = chart.getDataURL({ type: "png" });
  const link = document.createElement("a");
  link.href = base64;
  link.download = "grafico.png";
  link.click();
}

function criarCartaoIndicador() {
  const div = document.createElement("div");
  div.className = "cartao-indicador";
  div.innerHTML = `
    <h3>Total de Registros</h3>
    <p>${tabela.length - 1}</p>
    <button onclick="this.parentElement.remove()">❌</button>
  `;
  document.getElementById("area-graficos").appendChild(div);
}

function enableDrag(element) {
  interact(element).draggable({
    modifiers: [interact.modifiers.restrictRect({ restriction: 'parent', endOnly: true })],
    listeners: {
      move(event) {
        const target = event.target;
        const x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
        const y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;
        target.style.transform = `translate(${x}px, ${y}px)`;
        target.setAttribute('data-x', x);
        target.setAttribute('data-y', y);
      }
    }
  });
}

function enableResize(element) {
  interact(element).resizable({
    edges: { top: true, left: true, right: true, bottom: true },
    listeners: {
      move(event) {
        let { x, y } = event.target.dataset;
        x = parseFloat(x) || 0;
        y = parseFloat(y) || 0;

        event.target.style.width = event.rect.width + "px";
        event.target.style.height = event.rect.height + "px";
        x += event.deltaRect.left;
        y += event.deltaRect.top;

        event.target.style.transform = `translate(${x}px, ${y}px)`;
        event.target.setAttribute("data-x", x);
        event.target.setAttribute("data-y", y);

        const chart = echarts.getInstanceByDom(event.target.querySelector("div"));
        if (chart) chart.resize();
      }
    }
  });
}

function desfazerUltimoGrafico() {
  const area = document.getElementById("area-graficos");
  if (area.lastChild) {
    area.removeChild(area.lastChild);
    graficosCriados = Math.max(0, graficosCriados - 1);
  }
}

function capitalizar(txt) {
  return txt.charAt(0).toUpperCase() + txt.slice(1);
}
