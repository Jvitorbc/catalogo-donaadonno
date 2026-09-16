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

// Quantas peças aparecem por página — quando o catálogo tiver mais peças
// que isso, a paginação aparece sozinha lá embaixo (com poucas peças, o
// catálogo inteiro cabe numa página só e a paginação fica escondida).
const PRODUTOS_POR_PAGINA = 12;
let paginaAtual = 1;

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
      aplicarFiltroDoZero();
    });
    nav.appendChild(botao);
  });
}

function filtrarProdutosCatalogo() {
  const resultados = filtrarProdutos(estadoFiltro).filter(
    (produto) => !estadoFiltro.categoria || produto.categoria === estadoFiltro.categoria
  );
  // Peças marcadas como novidade (campo "novidade" em produtos.js) sempre
  // aparecem primeiro, entre as primeiras da grade — sort() do JavaScript é
  // estável, então dentro de cada grupo (novidade / não-novidade) a ordem
  // original de produtos.js é mantida, só os dois grupos são reordenados.
  return resultados.sort((a, b) => Number(!!b.novidade) - Number(!!a.novidade));
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

  // Só a página atual entra na grade — o resto das peças filtradas fica
  // "guardado" nas próximas páginas (ver renderizarPaginacao() abaixo).
  const totalPaginas = Math.max(1, Math.ceil(resultados.length / PRODUTOS_POR_PAGINA));
  if (paginaAtual > totalPaginas) paginaAtual = totalPaginas;
  if (paginaAtual < 1) paginaAtual = 1;
  const inicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
  const resultadosDaPagina = resultados.slice(inicio, inicio + PRODUTOS_POR_PAGINA);

  lista.innerHTML = "";
  resultadosDaPagina.forEach((produto) => lista.appendChild(criarCardProduto(produto)));

  const semResultado = resultados.length === 0;
  estadoVazio.hidden = !semResultado;
  lista.hidden = semResultado;

  resultadoInfo.textContent =
    resultados.length === 1 ? "1 peça encontrada" : `${resultados.length} peças encontradas`;

  atualizarCabecalho();
  renderizarPaginacao(totalPaginas);
}

/**
 * Monta os botões de página lá embaixo da grade (‹ 1 2 3 › ...). Só
 * aparece quando há mais de uma página — com poucas peças, o catálogo
 * inteiro cabe numa página só e a paginação fica escondida sozinha.
 */
function renderizarPaginacao(totalPaginas) {
  const nav = document.getElementById("paginacao");
  if (!nav) return;

  if (totalPaginas <= 1) {
    nav.hidden = true;
    nav.innerHTML = "";
    return;
  }
  nav.hidden = false;
  nav.innerHTML = "";

  function criarBotaoPagina(rotulo, pagina, opcoes = {}) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "paginacao__botao";
    botao.textContent = rotulo;
    if (opcoes.atual) {
      botao.classList.add("paginacao__botao--atual");
      botao.setAttribute("aria-current", "page");
    }
    if (opcoes.desabilitado) botao.disabled = true;
    if (opcoes.rotuloAcessivel) botao.setAttribute("aria-label", opcoes.rotuloAcessivel);
    botao.addEventListener("click", () => irParaPagina(pagina));
    return botao;
  }

  nav.appendChild(
    criarBotaoPagina("‹", paginaAtual - 1, {
      desabilitado: paginaAtual === 1,
      rotuloAcessivel: "Página anterior"
    })
  );

  for (let pagina = 1; pagina <= totalPaginas; pagina++) {
    nav.appendChild(
      criarBotaoPagina(String(pagina), pagina, {
        atual: pagina === paginaAtual,
        rotuloAcessivel: `Ir para a página ${pagina}`
      })
    );
  }

  nav.appendChild(
    criarBotaoPagina("›", paginaAtual + 1, {
      desabilitado: paginaAtual === totalPaginas,
      rotuloAcessivel: "Próxima página"
    })
  );
}

/** Troca de página e sobe a tela até o topo da grade, sem recarregar nada. */
function irParaPagina(pagina) {
  paginaAtual = pagina;
  renderizarCatalogo();
  const grade = document.getElementById("grade-catalogo");
  if (!grade) return;
  const reduzMovimento = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  grade.scrollIntoView({ behavior: reduzMovimento ? "auto" : "smooth", block: "start" });
}

/** Toda vez que a busca, a categoria ou o filtro mudam, volta pra página 1. */
function aplicarFiltroDoZero() {
  paginaAtual = 1;
  renderizarCatalogo();
}

function initFiltros(filtro) {
  document.getElementById("campo-busca").addEventListener("input", (evento) => {
    estadoFiltro.busca = evento.target.value;
    aplicarFiltroDoZero();
  });

  document.getElementById("botao-limpar-filtros").addEventListener("click", () => {
    estadoFiltro.busca = "";
    estadoFiltro.categoria = "";
    document.getElementById("campo-busca").value = "";
    renderizarAbasCategoria();
    filtro.limpar();
  });
}

document.addEventListener("DOMContentLoaded", async () => {
  const grade = document.getElementById("grade-catalogo");
  grade.innerHTML = '<li class="carregando-catalogo">Carregando peças…</li>';

  try {
    await carregarCatalogo();
  } catch (erro) {
    grade.innerHTML =
      '<li class="carregando-catalogo">Não foi possível carregar o catálogo agora. Tente atualizar a página em instantes.</li>';
    return;
  }

  const filtro = initFiltro(estadoFiltro, aplicarFiltroDoZero);
  renderizarAbasCategoria();
  initFiltros(filtro);
  renderizarCatalogo();
});
