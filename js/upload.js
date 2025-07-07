// Arquivo: js/upload.js — Upload real + base de exemplo com escopo global

window.inserirBaseExemplo = function () {
  console.log("🟢 Inserindo base de exemplo...");

  const exemplo = [
    ["Produto", "Quantidade", "Categoria", "Valor", "Data"],
    ["Maçã", "100", "Frutas", "2.50", "2023-05-01"],
    ["Banana", "150", "Frutas", "1.80", "2023-05-03"],
    ["Cenoura", "80", "Legumes", "3.20", "2023-05-05"],
    ["Alface", "50", "Verduras", "1.50", "2023-05-06"]
  ];

  if (typeof montarTabela === "function") {
    montarTabela(exemplo);
  } else {
    console.error("❌ Função montarTabela não está disponível.");
  }
};

document.getElementById("inputExcel").addEventListener("change", function (e) {
  const file = e.target.files[0];
  if (!file) {
    console.warn("⚠️ Nenhum arquivo selecionado.");
    return;
  }

  console.log("📁 Lendo arquivo Excel:", file.name);

  const reader = new FileReader();

  reader.onload = function (e) {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: "array" });

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    if (json && json.length > 0) {
      console.log("✅ Dados carregados da planilha:", json);
      montarTabela(json);
    } else {
      alert("⚠️ Arquivo vazio ou inválido.");
    }
  };

  reader.onerror = function () {
    console.error("❌ Erro ao ler o arquivo.");
    alert("Erro ao ler o arquivo. Tente novamente.");
  };

  reader.readAsArrayBuffer(file);
});
