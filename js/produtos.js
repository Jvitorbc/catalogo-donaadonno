/**
 * produtos.js
 * Dados das peças do catálogo.
 * TUDO FICTÍCIO (nomes, preços, descrições) — é o "esboço" do projeto.
 *
 * O catálogo da Donna Donno é só de VESTIDOS — cada peça é de uma marca
 * parceira diferente, por isso "categoria" continua existindo no modelo de
 * dados (é usada, por exemplo, na ficha técnica da página de produto), mas
 * como só há uma categoria hoje, as abas de filtro por categoria não são
 * exibidas no catálogo (ver catalogo.js). Se um dia entrar uma segunda
 * categoria, as abas voltam a aparecer sozinhas, sem precisar mexer em nada.
 *
 * Quando a loja mandar as peças reais, cada produto passa a ter:
 * - fotos: um array de CAMINHOS reais, ex: "assets/imagens/vestido-lora-01.jpg"
 * - video: o CAMINHO real do vídeo, ex: "assets/videos/vestido-lora.mp4" (ou null se não houver)
 *
 * Por enquanto:
 * - "fotos" é um array do MESMO TAMANHO que a peça teria de fotos — cada
 *   posição é um caminho real (string) quando já temos a foto, ou "null"
 *   quando ainda não temos (o site desenha um placeholder nesse lugar). Ex:
 *   fotos: ["assets/imagens/vestido-lora-01.jpg", null, null] → já tem a
 *   primeira foto, as outras duas ainda são placeholder. Dá pra ir
 *   preenchendo aos poucos, sem precisar ter todas de uma vez.
 * - "video" é true/false — só indica se aquela peça teria vídeo da modelo.
 * - "novidade" é true/false — controla a etiqueta discreta "Novidade" no card
 *   e na página da peça. É só marcar true/false aqui, sem mexer em mais nada,
 *   quando a loja quiser destacar uma peça recém-chegada (ou tirar o destaque
 *   depois de um tempo).
 */

const PRODUTOS = [
  {
    id: 1,
    nome: "Vestido Lora",
    marca: "fatima-scofield",
    categoria: "Vestidos",
    preco: 420.0,
    descricao:
      "Vestido longo em viscose fluida, caimento solto e decote em V. Peça leve para o dia e versátil para a noite.",
    tecido: "Viscose fluida",
    caimento: "Solto, comprimento longo",
    tamanhos: ["PP", "P", "M", "G"],
    cores: ["Terracota", "Preto"],
    fotos: ["assets/imagens/vestido-lora-01.jpg", null, null],
    video: true,
    novidade: false
  },
  {
    id: 2,
    nome: "Vestido Aya",
    marca: "fatima-scofield",
    categoria: "Vestidos",
    preco: 480.0,
    descricao:
      "Vestido midi em linho misto, caimento reto e abertura frontal discreta. Peça coringa para o verão.",
    tecido: "Linho misto",
    caimento: "Reto, comprimento midi",
    tamanhos: ["PP", "P", "M"],
    cores: ["Branco", "Terracota"],
    fotos: ["assets/imagens/vestido-aya-01.jpg", null, null],
    video: false,
    novidade: false
  },
  {
    id: 3,
    nome: "Vestido Nara",
    marca: "fatima-scofield",
    categoria: "Vestidos",
    preco: 460.0,
    descricao:
      "Vestido em tricot leve canelado, decote canoa e caimento justo ao corpo. Segunda pele para dias frios.",
    tecido: "Tricot leve canelado",
    caimento: "Justo, comprimento midi",
    tamanhos: ["P", "M", "G"],
    cores: ["Areia", "Grafite"],
    fotos: ["assets/imagens/vestido-nara-01.jpg", null, null],
    video: true,
    novidade: false
  },
  {
    id: 4,
    nome: "Vestido Kane",
    marca: "kalandra",
    categoria: "Vestidos",
    preco: 690.0,
    descricao:
      "Vestido em alfaiataria fluida, comprimento midi e fenda lateral discreta. Estrutura de terno com o caimento de vestido.",
    tecido: "Alfaiataria fluida",
    caimento: "Reto, comprimento midi",
    tamanhos: ["P", "M", "G"],
    cores: ["Preto", "Vinho"],
    fotos: ["assets/imagens/vestido-kane-01.jpg", null, null],
    video: true,
    novidade: false
  },
  {
    id: 5,
    nome: "Vestido Sena",
    marca: "kalandra",
    categoria: "Vestidos",
    preco: 720.0,
    descricao:
      "Vestido em crepe estruturado, decote assimétrico e cinto interno para marcar a cintura. Presença para eventos.",
    tecido: "Crepe estruturado",
    caimento: "Estruturado, comprimento midi",
    tamanhos: ["P", "M", "G"],
    cores: ["Grafite", "Areia"],
    fotos: ["assets/imagens/vestido-sena-01.jpg", null, null],
    video: false,
    novidade: false
  },
  {
    id: 6,
    nome: "Vestido Éter",
    marca: "kalandra",
    categoria: "Vestidos",
    preco: 540.0,
    descricao:
      "Vestido em malha canelada, comprimento longo e mangas justas. Minimalista, para o dia a dia com intenção.",
    tecido: "Malha canelada",
    caimento: "Justo, comprimento longo",
    tamanhos: ["P", "M", "G", "GG"],
    cores: ["Preto", "Grafite"],
    fotos: [null, null],
    video: true,
    novidade: true
  },
  {
    id: 7,
    nome: "Vestido Mira",
    marca: "arte-sacra",
    categoria: "Vestidos",
    preco: 380.0,
    descricao:
      "Vestido em algodão leve, caimento evasê e cintura marcada por elástico interno. Essencial e confortável.",
    tecido: "Algodão leve",
    caimento: "Evasê, comprimento midi",
    tamanhos: ["P", "M", "G"],
    cores: ["Bege", "Branco"],
    fotos: [null, null, null],
    video: false,
    novidade: false
  },
  {
    id: 8,
    nome: "Vestido Nice",
    marca: "arte-sacra",
    categoria: "Vestidos",
    preco: 410.0,
    descricao:
      "Vestido em linho puro, caimento solto e mangas amplas. Respira bem e amassa com elegância.",
    tecido: "Linho puro",
    caimento: "Solto, comprimento midi",
    tamanhos: ["P", "M", "G", "GG"],
    cores: ["Branco", "Azul claro"],
    fotos: [null, null],
    video: false,
    novidade: false
  },
  {
    id: 9,
    nome: "Vestido Duna",
    marca: "arte-sacra",
    categoria: "Vestidos",
    preco: 690.0,
    descricao:
      "Vestido longo em seda leve, decote em V e caimento fluido. Peça statement para ocasiões especiais.",
    tecido: "Seda leve",
    caimento: "Fluido, comprimento longo",
    tamanhos: ["P", "M"],
    cores: ["Dourado", "Preto"],
    fotos: [null, null, null],
    video: true,
    novidade: true
  },
  {
    id: 10,
    nome: "Vestido Lume",
    marca: "arte-sacra",
    categoria: "Vestidos",
    preco: 780.0,
    descricao:
      "Vestido em veludo molhado, caimento justo e manga longa. Brilho discreto para looks de noite.",
    tecido: "Veludo molhado",
    caimento: "Justo, comprimento midi",
    tamanhos: ["P", "M", "G"],
    cores: ["Caramelo", "Preto"],
    fotos: [null, null],
    video: true,
    novidade: false
  }
];

/**
 * Limites do controle de faixa de preço (o "slider" de duas alças) no
 * painel de filtro — ver js/app.js. Vão além dos preços fictícios de hoje
 * (R$ 380 a R$ 780) de propósito, pra já comportar peças mais caras no
 * futuro sem precisar editar aqui. Ajuste esses dois valores quando quiser
 * mudar os limites do controle.
 */
const PRECO_MIN = 100;
const PRECO_MAX = 1500;

/** Retorna um produto a partir do id (número ou string numérica). */
function buscarProdutoPorId(id) {
  const idNum = Number(id);
  return PRODUTOS.find((produto) => produto.id === idNum) || null;
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
 * tamanho (não alfabética — "G" viria antes de "M" por acaso, mas "GG"
 * ficaria fora de ordem). Só entram tamanhos que alguma peça realmente usa.
 */
const ORDEM_TAMANHOS = ["PP", "P", "M", "G", "GG"];
function listarTamanhos() {
  const usados = new Set(PRODUTOS.flatMap((produto) => produto.tamanhos || []));
  return ORDEM_TAMANHOS.filter((tamanho) => usados.has(tamanho));
}
