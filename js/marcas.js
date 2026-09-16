/**
 * marcas.js
 * Antes, as marcas ficavam escritas fixas aqui. Agora esse array começa
 * vazio e é preenchido pelo banco de dados assim que a página carrega —
 * ver carregarCatalogo() em supabase.js. O resto do site (filtro, cards,
 * página de produto) continua usando MARCAS e buscarMarcaPorId() do
 * mesmo jeito de sempre, sem precisar saber de onde os dados vieram.
 */

let MARCAS = [];

/** Retorna os dados de uma marca a partir do id (na prática, o slug: "kalandra"). */
function buscarMarcaPorId(id) {
  return MARCAS.find((marca) => marca.id === id) || null;
}
