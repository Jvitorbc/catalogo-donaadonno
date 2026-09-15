/**
 * marcas.js
 * Dados das marcas trabalhadas pela loja.
 * Nomes das marcas já são os REAIS (confirmados por João). Descrição,
 * logo e demais detalhes de cada marca ainda são placeholder — troque por
 * texto oficial quando a loja mandar.
 *
 * Cada marca:
 * - id: usado nos produtos (produto.marca) e na URL de filtro (index.html?marca=id)
 * - nome: nome exibido
 * - descricao: frase curta sobre a marca (hoje sem uso visual, guardada para o futuro)
 */

const MARCAS = [
  {
    id: "fatima-scofield",
    nome: "Fátima Scofield",
    descricao: "Descrição da marca — aguardando texto oficial da loja."
  },
  {
    id: "kalandra",
    nome: "Kalandra",
    descricao: "Descrição da marca — aguardando texto oficial da loja."
  },
  {
    id: "arte-sacra",
    nome: "Arte Sacra",
    descricao: "Descrição da marca — aguardando texto oficial da loja."
  }
];

/** Retorna os dados de uma marca a partir do id. */
function buscarMarcaPorId(id) {
  return MARCAS.find((marca) => marca.id === id) || null;
}
