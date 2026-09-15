/**
 * catalogo.js — lógica do catálogo completo, que hoje É a página inicial
 * (index.html) — não existe mais um catalogo.html separado; a home e o
 * catálogo eram quase idênticos, então viraram uma coisa só.
 * Busca por nome (campo próprio) + filtro por marca e faixa de preço (no
 * painel compartilhado, ver initFiltro() em app.js) + filtro por categoria
 * (abas, só aparecem se houver mais de uma categoria).
 * O filtro de marca também funciona como a "página de catálogo por marca":
 * index.html?marca=kalandra já chega com o filtro aplicado.
 */

const estadoFiltro = criarEstadoFiltro();
estadoFiltro.categoria = "";

function renderizarAbasCategoria() {
  const nav = document.getElementById("abas-categoria");
  const categoriasExistentes = listarCategorias();

  // Com uma única categoria (hoje, só "Vestidos"), as abas não têm o que
  // filtrar — ficam escondidas. Assim que houver uma segunda categoria,
  // elas voltam a aparecer sozinhas, sem precisar mexer neste arquivo.
  if (categoriasExistentes.length <= 1) {
    nav.innerHTML = "";
    nav.hidden = true;
    return;
  }
  nav.hidden = false;

  const categorias = ["", ...categoriasExistentes];
  nav.innerHTML = "";
  categorias.forEach((categoria) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "aba-categoria";
    botao.textContent = categoria || "Todas";
    botao.setAttribute("aria-current", String(categoria === estadoFiltro.categoria));
    botao.addEventListener("click", () => {
      estadoFiltro.categoria = categoria;
      nav.querySelectorAll(".aba-categoria").forEach((b) => b.setAttribute("aria-current", "false"));
      botao.setAttribute("aria-current", "true");
      renderizarCatalogo();
    });
    nav.appendChild(botao);
  });
}

function filtrarProdutosCatalogo() {
  return filtrarProdutos(estadoFiltro).filter(
    (produto) => !estadoFiltro.categoria || produto.categoria === estadoFiltro.categoria
  );
}

function atualizarCabecalho() {
  const olho = document.getElementById("catalogo-olho");
  const titulo = document.getElementById("catalogo-titulo");
  // Com uma marca só selecionada, a página funciona como "catálogo da marca X".
  const marca = estadoFiltro.marcas.length === 1 ? buscarMarcaPorId(estadoFiltro.marcas[0]) : null;
  if (marca) {
    olho.textContent = "Marca";
    titulo.textContent = marca.nome;
  } else {
    olho.textContent = "Catálogo";
    titulo.textContent = "Todas as peças";
  }
}

function renderizarCatalogo() {
  const lista = document.getElementById("grade-catalogo");
  const estadoVazio = document.getElementById("estado-vazio");
  const resultadoInfo = document.getElementById("resultado-info");
  const resultados = filtrarProdutosCatalogo();

  lista.innerHTML = "";
  resultados.forEach((produto) => lista.appendChild(criarCardProduto(produto)));

  const semResultado = resultados.length === 0;
  estadoVazio.hidden = !semResultado;
  lista.hidden = semResultado;

  resultadoInfo.textContent =
    resultados.length === 1 ? "1 peça encontrada" : `${resultados.length} peças encontradas`;

  atualizarCabecalho();
}

function initFiltros(filtro) {
  document.getElementById("campo-busca").addEventListener("input", (evento) => {
    estadoFiltro.busca = evento.target.value;
    renderizarCatalogo();
  });

  document.getElementById("botao-limpar-filtros").addEventListener("click", () => {
    estadoFiltro.busca = "";
    estadoFiltro.categoria = "";
    document.getElementById("campo-busca").value = "";
    renderizarAbasCategoria();
    filtro.limpar();
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const filtro = initFiltro(estadoFiltro, renderizarCatalogo);
  renderizarAbasCategoria();
  initFiltros(filtro);
  renderizarCatalogo();
});
