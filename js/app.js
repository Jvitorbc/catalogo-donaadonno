/**
 * app.js
 * Configuração central e funções compartilhadas por TODAS as páginas.
 * Este arquivo precisa ser carregado antes de marcas.js/produtos.js e dos
 * scripts específicos de cada página (catalogo.js, produto.js, etc).
 */

/* ------------------------------------------------------------------ */
/* CONFIGURAÇÃO DA LOJA — troque pelos dados reais quando a loja confirmar */
/* ------------------------------------------------------------------ */
const CONFIG = {
  nomeLoja: "Donna Donno",
  slogan: "Curadoria de marcas autorais",
  // Número fictício, formato internacional sem símbolos (DDI+DDD+número).
  // Troque pelo número real da loja antes de publicar de verdade.
  whatsapp: "5587999999999",
  cidade: "Petrolina, PE"
};

/* ------------------------------------------------------------------ */
/* PLACEHOLDER DE IMAGEM (enquanto não temos fotos/vídeos reais)       */
/* ------------------------------------------------------------------ */

const PALETA_PLACEHOLDER = ["#e9e4dc", "#ded6c9", "#e3ded6", "#d9d2c4"];

function corPlaceholder(semente) {
  let hash = 0;
  for (let i = 0; i < semente.length; i++) {
    hash = semente.charCodeAt(i) + ((hash << 5) - hash);
  }
  const indice = Math.abs(hash) % PALETA_PLACEHOLDER.length;
  return PALETA_PLACEHOLDER[indice];
}

/**
 * Gera uma imagem placeholder (SVG em data URI) para simular a foto de um
 * produto enquanto as fotos reais não chegam. "rotulo" aparece como legenda.
 */
function placeholderImg(rotulo, semente = rotulo, largura = 600, altura = 800) {
  const cor = corPlaceholder(String(semente));
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${largura}" height="${altura}" viewBox="0 0 ${largura} ${altura}">
      <rect width="${largura}" height="${altura}" fill="${cor}" />
      <g stroke="#00000012" stroke-width="1">
        <line x1="0" y1="0" x2="${largura}" y2="${altura}" />
        <line x1="${largura}" y1="0" x2="0" y2="${altura}" />
      </g>
      <rect x="0" y="${altura - 64}" width="${largura}" height="64" fill="#00000014" />
      <text x="24" y="${altura - 26}" font-family="Helvetica, Arial, sans-serif" font-size="20" fill="#3a352c" letter-spacing="0.5">
        ${escaparXml(String(rotulo).toUpperCase())}
      </text>
    </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

function escaparXml(texto) {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/* ------------------------------------------------------------------ */
/* FORMATAÇÃO                                                          */
/* ------------------------------------------------------------------ */

function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/* ------------------------------------------------------------------ */
/* LISTA DE CONSULTA / "MINHA SELEÇÃO" (localStorage)                  */
/* ------------------------------------------------------------------ */

const CHAVE_SELECAO = "catalogo_selecao";

function obterSelecao() {
  try {
    const dados = JSON.parse(localStorage.getItem(CHAVE_SELECAO));
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    return [];
  }
}

function salvarSelecao(lista) {
  localStorage.setItem(CHAVE_SELECAO, JSON.stringify(lista));
  atualizarContadores();
}

/** item: { produtoId, tamanho } — sem cor: a cor de cada peça já aparece na foto. */
function adicionarNaSelecao(item) {
  const selecao = obterSelecao();
  const jaExiste = selecao.some((i) => i.produtoId === item.produtoId && i.tamanho === item.tamanho);
  if (jaExiste) {
    mostrarToast("Essa peça já está na sua seleção");
    return;
  }
  selecao.push(item);
  salvarSelecao(selecao);
  mostrarToast("Adicionado à sua seleção");
}

function removerDaSelecao(indice) {
  const selecao = obterSelecao();
  selecao.splice(indice, 1);
  salvarSelecao(selecao);
}

/* ------------------------------------------------------------------ */
/* WHATSAPP                                                             */
/* ------------------------------------------------------------------ */

function gerarLinkWhatsApp(mensagem) {
  return `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(mensagem)}`;
}

function montarMensagemProdutoUnico(produto, tamanho) {
  const marca = buscarMarcaPorId(produto.marca);
  let msg = `Olá! Gostaria de consultar a disponibilidade da peça ${produto.nome}`;
  msg += marca ? `, da marca ${marca.nome}` : "";
  if (tamanho) msg += `, no tamanho ${tamanho}`;
  msg += ". Poderiam me ajudar?";
  return msg;
}

/** Mensagem genérica, usada pelo botão flutuante (não é sobre uma peça específica). */
function montarMensagemGeral() {
  return `Olá! Estou vendo o catálogo digital da ${CONFIG.nomeLoja} e gostaria de mais informações.`;
}

function montarMensagemSelecao(itensDetalhados) {
  let msg = "Olá! Gostaria de consultar algumas peças do catálogo:\n\n";
  itensDetalhados.forEach((item, indice) => {
    const marca = buscarMarcaPorId(item.produto.marca);
    const partes = [item.produto.nome];
    if (marca) partes.push(marca.nome);
    if (item.tamanho) partes.push(`Tamanho ${item.tamanho}`);
    msg += `${indice + 1}. ${partes.join(" — ")}.\n`;
  });
  msg += "\nPoderiam me informar a disponibilidade e como posso realizar a compra?";
  return msg;
}

/* ------------------------------------------------------------------ */
/* TOAST (feedback visual leve, sem usar alert()/confirm())            */
/* ------------------------------------------------------------------ */

let toastTimeoutId = null;

function mostrarToast(texto) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.textContent = texto;
  toast.classList.add("toast--visivel");
  clearTimeout(toastTimeoutId);
  toastTimeoutId = setTimeout(() => toast.classList.remove("toast--visivel"), 2200);
}

/* ------------------------------------------------------------------ */
/* HEADER: contadores, menu mobile, link ativo                         */
/* ------------------------------------------------------------------ */

function atualizarContadores() {
  const badgeSelecao = document.querySelector("[data-contador-selecao]");
  const totalSelecao = obterSelecao().length;

  if (badgeSelecao) {
    badgeSelecao.textContent = totalSelecao;
    badgeSelecao.hidden = totalSelecao === 0;
  }
}

function marcarLinkAtivo() {
  const paginaAtual = document.body.dataset.pagina;
  if (!paginaAtual) return;
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.dataset.navLink === paginaAtual) {
      link.setAttribute("aria-current", "page");
    }
  });
}

function preencherNomeLoja() {
  document.querySelectorAll("[data-nome-loja]").forEach((el) => {
    el.textContent = CONFIG.nomeLoja;
  });
}

/* ------------------------------------------------------------------ */
/* URL                                                                  */
/* ------------------------------------------------------------------ */

function obterParametroUrl(nome) {
  return new URLSearchParams(window.location.search).get(nome);
}

/* ------------------------------------------------------------------ */
/* BOTÃO DE WHATSAPP FLUTUANTE (aparece em todas as páginas)           */
/* ------------------------------------------------------------------ */

function criarBotaoWhatsappFlutuante() {
  if (document.querySelector(".whatsapp-flutuante")) return;

  const link = document.createElement("a");
  link.className = "whatsapp-flutuante";
  link.href = gerarLinkWhatsApp(montarMensagemGeral());
  link.target = "_blank";
  link.rel = "noopener";
  link.setAttribute("aria-label", `Falar com a ${CONFIG.nomeLoja} pelo WhatsApp`);
  link.innerHTML = `
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" />
    </svg>`;
  document.body.appendChild(link);
}

/* ------------------------------------------------------------------ */
/* CARD DE PRODUTO (reaproveitado na home e no catálogo)               */
/* ------------------------------------------------------------------ */

function criarCardProduto(produto) {
  const marca = buscarMarcaPorId(produto.marca);
  // Usa a foto real (fotos[0]) quando já existe; enquanto não tem, cai no placeholder desenhado.
  const fotoCapa = (produto.fotos && produto.fotos[0]) || placeholderImg("Foto 1", produto.nome);
  const li = document.createElement("li");
  li.className = "cartao-produto";
  li.innerHTML = `
    <div class="cartao-produto__imagem-wrap">
      ${produto.novidade ? '<span class="etiqueta-novidade">Novidade</span>' : ""}
      <a href="produto.html?id=${produto.id}" class="cartao-produto__link" aria-label="Ver detalhes de ${produto.nome}">
        <img src="${fotoCapa}" alt="${produto.nome}, ${marca ? marca.nome : ""}" loading="lazy" width="600" height="800" />
      </a>
    </div>
    <a href="produto.html?id=${produto.id}" class="cartao-produto__link">
      <p class="cartao-produto__marca">${marca ? marca.nome : ""}</p>
      <p class="cartao-produto__nome">${produto.nome}</p>
      <p class="cartao-produto__preco">${formatarPreco(produto.preco)}</p>
    </a>
  `;
  return li;
}

/* ------------------------------------------------------------------ */
/* FILTRO (cor, marca, tamanho e faixa de preço) — painel reaproveitado */
/* na home e no catálogo. Cada página guarda seu próprio "estado" de    */
/* filtro e decide o que fazer quando o visitante aplica (cada uma      */
/* re-renderiza a sua própria grade de produtos).                       */
/* ------------------------------------------------------------------ */

/**
 * Cor aproximada de cada nome de cor usado em produtos.js — só para
 * desenhar a bolinha de amostra ao lado do nome no filtro. Puramente
 * visual; se a loja usar um nome de cor novo que não está aqui, o filtro
 * continua funcionando normalmente, só sem a bolinha colorida.
 */
const CORES_HEX = {
  Terracota: "#c1502e",
  Preto: "#1a1a1a",
  Branco: "#f5f2ee",
  Vinho: "#5c1a2e",
  Grafite: "#4a4a4a",
  Areia: "#d8c7a1",
  Dourado: "#cdb074",
  Caramelo: "#b06a35",
  "Azul claro": "#a9c6d8"
};

/** Estado inicial de filtro: nada selecionado, faixa de preço completa. */
function criarEstadoFiltro() {
  return { busca: "", marcas: [], cores: [], tamanhos: [], precoMin: PRECO_MIN, precoMax: PRECO_MAX };
}

function produtoPassaNoFiltro(produto, estado) {
  const buscaNormalizada = (estado.busca || "").trim().toLowerCase();
  const combinaBusca = !buscaNormalizada || produto.nome.toLowerCase().includes(buscaNormalizada);
  const combinaMarca = estado.marcas.length === 0 || estado.marcas.includes(produto.marca);
  const combinaCor = estado.cores.length === 0 || (produto.cores || []).some((cor) => estado.cores.includes(cor));
  const combinaTamanho =
    estado.tamanhos.length === 0 || (produto.tamanhos || []).some((tam) => estado.tamanhos.includes(tam));
  const combinaPreco = produto.preco >= estado.precoMin && produto.preco <= estado.precoMax;
  return combinaBusca && combinaMarca && combinaCor && combinaTamanho && combinaPreco;
}

function filtrarProdutos(estado) {
  return PRODUTOS.filter((produto) => produtoPassaNoFiltro(produto, estado));
}

/** Monta uma pílula de checkbox dentro de um grupo do filtro (cor, marca ou tamanho). */
function criarOpcaoFiltro(container, valor, rotulo, corHex) {
  const label = document.createElement("label");
  label.className = "filtro-opcao";
  const bolinha = corHex
    ? `<span class="filtro-opcao__swatch" style="background:${corHex}" aria-hidden="true"></span>`
    : "";
  label.innerHTML = `<input type="checkbox" value="${valor}" />${bolinha}<span>${rotulo}</span>`;
  container.appendChild(label);
}

/**
 * Liga o painel de filtro (cor, marca, tamanho e faixa de preço) de uma
 * página: monta as opções a partir de MARCAS/listarCores()/listarTamanhos(),
 * abre/fecha o painel (uma gaveta que desliza da direita, com cada grupo em
 * acordeão) e atualiza `estado` conforme o visitante interage. `aoAplicar`
 * é chamado sempre que o filtro muda (botão "Ver peças" ou "Limpar
 * filtros") — cada página decide como reagir (normalmente, re-renderizar
 * sua grade). Retorna { limpar } para a página poder limpar o filtro de
 * fora do painel (ex: botão "Limpar filtros" do estado vazio).
 */
function initFiltro(estado, aoAplicar) {
  const camada = document.getElementById("filtro-camada");
  const botaoAbrir = document.getElementById("botao-abrir-filtro");
  if (!camada || !botaoAbrir) return { limpar: () => {} };

  const painel = document.getElementById("filtro-painel");
  const listaCores = document.getElementById("filtro-cores");
  const listaMarcas = document.getElementById("filtro-marcas");
  const listaTamanhos = document.getElementById("filtro-tamanhos");
  const contagem = document.getElementById("filtro-contagem");

  const inputPrecoMin = document.getElementById("filtro-preco-min");
  const inputPrecoMax = document.getElementById("filtro-preco-max");
  const rotuloPrecoMin = document.getElementById("filtro-preco-min-rotulo");
  const rotuloPrecoMax = document.getElementById("filtro-preco-max-rotulo");
  const trilhoIntervalo = document.getElementById("filtro-slider-intervalo");

  listarCores().forEach((cor) => criarOpcaoFiltro(listaCores, cor, cor, CORES_HEX[cor]));
  MARCAS.forEach((marca) => criarOpcaoFiltro(listaMarcas, marca.id, marca.nome));
  listarTamanhos().forEach((tamanho) => criarOpcaoFiltro(listaTamanhos, tamanho, tamanho));

  inputPrecoMin.min = inputPrecoMax.min = String(PRECO_MIN);
  inputPrecoMin.max = inputPrecoMax.max = String(PRECO_MAX);
  inputPrecoMin.value = String(PRECO_MIN);
  inputPrecoMax.value = String(PRECO_MAX);

  function formatarPrecoCurto(valor) {
    return `R$ ${Number(valor).toLocaleString("pt-BR")}`;
  }

  function atualizarVisualSlider() {
    const min = PRECO_MIN;
    const max = PRECO_MAX;
    const valMin = Number(inputPrecoMin.value);
    const valMax = Number(inputPrecoMax.value);
    const pctMin = ((valMin - min) / (max - min)) * 100;
    const pctMax = ((valMax - min) / (max - min)) * 100;
    trilhoIntervalo.style.left = `${pctMin}%`;
    trilhoIntervalo.style.right = `${100 - pctMax}%`;
    rotuloPrecoMin.textContent = formatarPrecoCurto(valMin);
    rotuloPrecoMax.textContent = formatarPrecoCurto(valMax);
  }

  function atualizarContagemBotao() {
    const precoAlterado = estado.precoMin > PRECO_MIN || estado.precoMax < PRECO_MAX;
    const total = estado.marcas.length + estado.cores.length + estado.tamanhos.length + (precoAlterado ? 1 : 0);
    contagem.textContent = String(total);
    contagem.hidden = total === 0;
  }

  function abrir() {
    camada.classList.add("filtro-camada--aberta");
    document.body.style.overflow = "hidden";
    painel.focus();
  }

  function fechar() {
    camada.classList.remove("filtro-camada--aberta");
    document.body.style.overflow = "";
    botaoAbrir.focus();
  }

  function limpar() {
    estado.marcas = [];
    estado.cores = [];
    estado.tamanhos = [];
    estado.precoMin = PRECO_MIN;
    estado.precoMax = PRECO_MAX;
    camada.querySelectorAll('input[type="checkbox"]').forEach((input) => {
      input.checked = false;
    });
    inputPrecoMin.value = String(PRECO_MIN);
    inputPrecoMax.value = String(PRECO_MAX);
    atualizarVisualSlider();
    atualizarContagemBotao();
    aoAplicar();
  }

  botaoAbrir.addEventListener("click", abrir);
  camada.querySelectorAll("[data-filtro-fechar]").forEach((el) => el.addEventListener("click", fechar));
  document.addEventListener("keydown", (evento) => {
    if (evento.key === "Escape" && camada.classList.contains("filtro-camada--aberta")) fechar();
  });

  listaCores.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => {
      estado.cores = Array.from(listaCores.querySelectorAll('input[type="checkbox"]:checked')).map((i) => i.value);
    });
  });

  listaMarcas.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => {
      estado.marcas = Array.from(listaMarcas.querySelectorAll('input[type="checkbox"]:checked')).map(
        (i) => i.value
      );
    });
  });

  listaTamanhos.querySelectorAll('input[type="checkbox"]').forEach((input) => {
    input.addEventListener("change", () => {
      estado.tamanhos = Array.from(listaTamanhos.querySelectorAll('input[type="checkbox"]:checked')).map(
        (i) => i.value
      );
    });
  });

  // Alça de mínimo não pode passar da de máximo, e vice-versa.
  inputPrecoMin.addEventListener("input", () => {
    if (Number(inputPrecoMin.value) > Number(inputPrecoMax.value)) {
      inputPrecoMin.value = inputPrecoMax.value;
    }
    estado.precoMin = Number(inputPrecoMin.value);
    atualizarVisualSlider();
  });

  inputPrecoMax.addEventListener("input", () => {
    if (Number(inputPrecoMax.value) < Number(inputPrecoMin.value)) {
      inputPrecoMax.value = inputPrecoMin.value;
    }
    estado.precoMax = Number(inputPrecoMax.value);
    atualizarVisualSlider();
  });

  document.getElementById("filtro-limpar").addEventListener("click", () => {
    limpar();
    fechar();
  });

  document.getElementById("filtro-aplicar").addEventListener("click", () => {
    atualizarContagemBotao();
    aoAplicar();
    fechar();
  });

  // Link vindo de fora com ?marca=... (ex: rodapé) já chega com a marca
  // marcada, e o grupo "Marca" já abre expandido pra deixar isso visível.
  const marcaUrl = obterParametroUrl("marca");
  if (marcaUrl && buscarMarcaPorId(marcaUrl)) {
    estado.marcas = [marcaUrl];
    const input = listaMarcas.querySelector(`input[value="${marcaUrl}"]`);
    if (input) input.checked = true;
    const grupoMarca = document.getElementById("filtro-grupo-marca");
    if (grupoMarca) grupoMarca.open = true;
    atualizarContagemBotao();
  }

  atualizarVisualSlider();

  return { limpar };
}

/* ------------------------------------------------------------------ */
/* INICIALIZAÇÃO COMUM A TODAS AS PÁGINAS                              */
/* ------------------------------------------------------------------ */

document.addEventListener("DOMContentLoaded", () => {
  preencherNomeLoja();
  atualizarContadores();
  marcarLinkAtivo();
  criarBotaoWhatsappFlutuante();
});
