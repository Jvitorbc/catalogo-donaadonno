/**
 * supabase.js — conecta o catálogo público ao banco de dados (Supabase).
 *
 * Antes, os produtos e marcas viviam fixos aqui no código (produtos.js e
 * marcas.js). Agora eles vêm do mesmo banco de dados que o painel
 * administrativo usa — assim, quando a loja cadastra ou edita uma peça
 * pelo painel, ela aparece aqui automaticamente, sem precisar mexer em
 * nenhum arquivo.
 *
 * A chave abaixo (SUPABASE_ANON_KEY) é pública de propósito — ela só
 * consegue LER peças marcadas como ativas (essa regra está configurada no
 * próprio banco de dados, não aqui). Ninguém consegue criar, alterar ou
 * excluir nada através dela.
 */
const SUPABASE_URL = "https://xkewjkjldtfzsvqvxgte.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_RokuarBTLwKnLiIKF4AM0g_MyQwgqrN";
const LOJA_SLUG = "donna-donno";

async function consultarSupabase(caminho) {
  const resposta = await fetch(`${SUPABASE_URL}/rest/v1/${caminho}`, {
    headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` }
  });
  if (!resposta.ok) {
    throw new Error(`Erro ao buscar dados do catálogo (${resposta.status})`);
  }
  return resposta.json();
}

// Guarda a busca em andamento (ou já concluída) — se duas partes da página
// chamarem carregarCatalogo() ao mesmo tempo, a segunda reaproveita a
// mesma consulta em vez de bater no banco de novo.
let carregamentoCatalogo = null;

/**
 * Busca a loja, as marcas e as peças ativas no banco de dados e preenche
 * os arrays PRODUTOS e MARCAS (declarados em produtos.js e marcas.js) —
 * o resto do site continua lendo esses dois arrays exatamente como antes,
 * só que agora eles vêm do banco em vez de estarem escritos no código.
 */
function carregarCatalogo() {
  if (carregamentoCatalogo) return carregamentoCatalogo;

  carregamentoCatalogo = (async () => {
    const lojasEncontradas = await consultarSupabase(`lojas?slug=eq.${LOJA_SLUG}&select=id`);
    const lojaId = lojasEncontradas[0] && lojasEncontradas[0].id;
    if (!lojaId) throw new Error("Loja não encontrada no banco de dados.");

    const [marcasBanco, produtosBanco] = await Promise.all([
      consultarSupabase(`marcas?loja_id=eq.${lojaId}&select=nome,slug&order=nome.asc`),
      consultarSupabase(
        `produtos?loja_id=eq.${lojaId}&select=id,nome,preco,descricao,tamanhos,cores,video_url,novidade,` +
          `marcas(slug),categorias(nome),produto_fotos(url,ordem)&order=ordem.asc`
      )
    ]);

    // "id" de cada marca sempre foi o slug (ex: "kalandra") neste projeto,
    // não o identificador interno do banco — mantém todo o resto do site
    // (filtro, links de marca, etc.) funcionando sem precisar mudar nada.
    MARCAS.length = 0;
    marcasBanco.forEach((marca) => MARCAS.push({ id: marca.slug, nome: marca.nome }));

    PRODUTOS.length = 0;
    produtosBanco.forEach((produto) => {
      const fotosOrdenadas = [...(produto.produto_fotos || [])].sort((a, b) => a.ordem - b.ordem);
      PRODUTOS.push({
        id: produto.id,
        nome: produto.nome,
        marca: produto.marcas ? produto.marcas.slug : null,
        categoria: produto.categorias ? produto.categorias.nome : "",
        preco: Number(produto.preco),
        descricao: produto.descricao || "",
        tamanhos: produto.tamanhos || [],
        cores: produto.cores || [],
        fotos: fotosOrdenadas.map((foto) => foto.url),
        video: produto.video_url || null,
        novidade: Boolean(produto.novidade)
      });
    });
  })();

  return carregamentoCatalogo;
}
