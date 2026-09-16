/**
 * produtos.js
 * Antes, as peças do catálogo ficavam escritas fixas aqui (era o
 * "esboço" do projeto). Agora esse array começa vazio e é preenchido a
 * partir do banco de dados (Supabase) assim que a página carrega — ver
 * carregarCatalogo() em supabase.js. É o mesmo banco que o painel
 * administrativo usa: uma peça cadastrada ou editada por lá aparece aqui
 * automaticamente, sem precisar mexer em nenhum arquivo.
 *
 * O resto do site (cards, filtro, página de produto, "Minha seleção")
 * continua usando PRODUTOS e as funções abaixo exatamente como antes —
 * só a ORIGEM dos dados mudou.
 */

let PRODUTOS = [];

/**
 * Limites do controle de faixa de preço (o "slider" de duas alças) no
 * painel de filtro — ver js/app.js.
 */
const PRECO_MIN = 100;
const PRECO_MAX = 1500;

/** Retorna um produto a partir do id. */
function buscarProdutoPorId(id) {
  return PRODUTOS.find((produto) => String(produto.id) === String(id)) || null;
}

/** Lista de categorias únicas, na ordem em que aparecem nos produtos. */
function listarCategorias() {
  return [...new Set(PRODUTOS.map((produto) => produto.categoria))];
}

/** Lista de cores únicas usadas no catálogo, na ordem em que aparecem. */
function listarCores() {
  return [...new Set(PRODUTOS.flatMap((produto) => produto.cores || []))];
}

/**
 * Lista de tamanhos únicos usados no catálogo, numa ordem lógica de
 * tamanho (não alfabética). Só entram tamanhos que alguma peça realmente usa.
 */
const ORDEM_TAMANHOS = ["PP", "P", "M", "G", "GG"];
function listarTamanhos() {
  const usados = new Set(PRODUTOS.flatMap((produto) => produto.tamanhos || []));
  return ORDEM_TAMANHOS.filter((tamanho) => usados.has(tamanho));
}
