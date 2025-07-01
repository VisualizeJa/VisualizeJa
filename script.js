
// Troca de abas
document.querySelectorAll(".tablink").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".tablink").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active"));
    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active");
  });
});

const fileInput = document.getElementById("fileInput");
const inserirBtn = document.getElementById("inserirManual");
const statusDiv = document.getElementById("uploadStatus");

fileInput.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (e) {
    let data = e.target.result;
    let workbook = XLSX.read(data, { type: "binary" });
    let sheet = workbook.Sheets[workbook.SheetNames[0]];
    let json = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    carregarTabela(json);
    statusDiv.innerText = "✅ Arquivo carregado com sucesso!";
  };
  reader.readAsBinaryString(file);
});

inserirBtn.addEventListener("click", () => {
  const exemplo = [
    ["Produto", "Categoria", "Valor", "Data", "Observação"],
    ["Arroz", "Alimento", 12.5, "2025-06-01", "Item básico"],
    ["Óleo", "Alimento", 8.9, "2025-06-02", "Vegetal"]
  ];
  carregarTabela(exemplo);
  statusDiv.innerText = "✅ Dados manuais carregados!";
});

function carregarTabela(dados) {
  const tabelaContainer = document.getElementById("tabelaBase");
  if (!tabelaContainer) return;

  let html = `<table id="tabelaDados">`;
  dados.forEach((linha, i) => {
    html += `<tr>`;
    linha.forEach((celula, j) => {
      if (i === 0) {
        html += `<th contenteditable="true">${celula}
          <br><small style="font-size: 0.75rem; color: #888;">Tipo: <select>
            <option>Texto</option>
            <option>Número</option>
            <option>Moeda</option>
            <option>Data</option>
          </select></small>
        </th>`;
      } else {
        html += `<td contenteditable="true">${celula}</td>`;
      }
    });
    html += `</tr>`;
  });
  html += `</table>`;
  tabelaContainer.innerHTML = html;
  document.getElementById("transformarContent").innerHTML = tabelaContainer.innerHTML;
}

function adicionarLinha() {
  const tabela = document.querySelector("#tabelaDados");
  if (!tabela) return;

  const novaLinha = tabela.insertRow();
  const colunas = tabela.rows[0].cells.length;

  for (let i = 0; i < colunas; i++) {
    const novaCelula = novaLinha.insertCell(i);
    novaCelula.contentEditable = "true";
    novaCelula.textContent = "";
  }
}

function criarGrafico() {
  const container = document.getElementById("graficosContainer");
  const chartId = "grafico_" + Date.now();
  const div = document.createElement("div");
  div.style.width = "400px";
  div.style.height = "300px";
  div.id = chartId;
  container.appendChild(div);

  const chart = echarts.init(div);
  chart.setOption({
    title: { text: "Gráfico Exemplo" },
    tooltip: {},
    xAxis: { type: "category", data: ["A", "B", "C"] },
    yAxis: { type: "value" },
    series: [{ type: "bar", data: [5, 20, 36] }]
  });
}

function exportarTodos() {
  const charts = document.querySelectorAll("#graficosContainer > div");
  charts.forEach((el, idx) => {
    const chart = echarts.getInstanceByDom(el);
    const img = chart.getDataURL({ type: "png" });
    const link = document.createElement("a");
    link.href = img;
    link.download = `grafico_${idx + 1}.png`;
    link.click();
  });
}
