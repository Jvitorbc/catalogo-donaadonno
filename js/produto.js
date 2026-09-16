/**
 * produto.js — lógica da página de detalhes (produto.html?id=...).
 * Galeria de fotos + vídeo, seleção de tamanho, adicionar à lista de
 * consulta e consulta individual pelo WhatsApp.
 *
 * Não tem seleção de cor aqui de propósito: a cor da peça já aparece na
 * própria foto, então pedir pra escolher de novo seria repetir informação.
 * Categoria, tecido e caimento também saíram da ficha — o catálogo é só de
 * vestidos (a categoria nunca muda) e detalhes de tecido/caimento ficam
 * pra conversa no WhatsApp, quando fizer sentido. Os campos continuam
 * existindo em produtos.js (não fazem mal ali) e a cor de cada peça segue
 * sendo usada pelo filtro por cor do catálogo (ver CORES_HEX em app.js) —
 * só não aparece mais nesta página.
 */

let produtoAtual = null;
let indiceSlideAtual = 0;
let tamanhoSelecionado = null;

/**
 * Galeria em dois painéis fixos, lado a lado: FOTO à esquerda e VÍDEO à
 * direita (quando a peça tiver vídeo). As miniaturas abaixo só navegam
 * entre as fotos — o painel de vídeo é fixo, sempre visível junto da foto.
 */
function renderizarGaleria(produto) {
  const painelFoto = document.getElementById("painel-foto");
  const painelVideo = document.getElementById("painel-video");
  const miniaturas = document.getElementById("galeria-miniaturas");
  const fotos = produto.fotos || [];

  // Caminho real da foto (quando já existe) ou um placeholder desenhado no lugar.
  function origemFoto(indice, largura, altura) {
    const rotulo = `Foto ${indice + 1}`;
    return fotos[indice] || placeholderImg(rotulo, produto.nome + rotulo, largura, altura);
  }

  function mostrarFoto(indice) {
    const rotulo = `Foto ${indice + 1}`;
    painelFoto.innerHTML = `<img src="${origemFoto(indice, 700, 875)}" alt="${produto.nome} — ${rotulo}" width="700" height="875" />`;
  }

  // O painel de vídeo aparece SEMPRE ao lado da foto, em toda peça. Quando
  // já existe um vídeo real cadastrado pelo painel administrativo
  // (produto.video, vindo de video_url no banco), ele toca de verdade,
  // com os controles nativos do navegador; sem vídeo ainda, mostra um
  // aviso discreto no lugar, sem quebrar o layout.
  painelVideo.hidden = false;
  painelVideo.innerHTML = produto.video
    ? `<video src="${produto.video}" controls playsinline aria-label="Vídeo da modelo usando ${produto.nome}"></video>`
    : `<div class="video-placeholder">
        <span class="video-placeholder__icone">
          <svg viewBox="0 0 24 24"><path d="M9 7l9 5-9 5V7z"/></svg>
        </span>
        <strong>Vídeo da modelo</strong>
        <small>O vídeo real desta peça entra aqui assim que a loja enviar o arquivo pelo painel administrativo.</small>
      </div>`;

  miniaturas.innerHTML = "";
  fotos.forEach((_, indice) => {
    const rotulo = `Foto ${indice + 1}`;
    const botao = document.createElement("button");
    botao.type = "button";
    botao.setAttribute("aria-current", String(indice === 0));
    botao.setAttribute("aria-label", `Ver ${rotulo}`);
    botao.innerHTML = `<img src="${origemFoto(indice, 200, 260)}" alt="" />`;
    botao.addEventListener("click", () => {
      indiceSlideAtual = indice;
      mostrarFoto(indice);
      miniaturas.querySelectorAll("button").forEach((b, i) => b.setAttribute("aria-current", String(i === indice)));
    });
    miniaturas.appendChild(botao);
  });

  mostrarFoto(0);
}

function renderizarPilulas(container, opcoes, valorSelecionadoInicial, aoSelecionar) {
  container.innerHTML = "";
  opcoes.forEach((opcao, indice) => {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "pilula";
    botao.textContent = opcao;
    const selecionado = indice === 0;
    botao.setAttribute("aria-pressed", String(selecionado));
    if (selecionado) aoSelecionar(opcao);
    botao.addEventListener("click", () => {
      container.querySelectorAll(".pilula").forEach((p) => p.setAttribute("aria-pressed", "false"));
      botao.setAttribute("aria-pressed", "true");
      aoSelecionar(opcao);
    });
    container.appendChild(botao);
  });
}

function renderizarProduto(produto) {
  const marca = buscarMarcaPorId(produto.marca);

  document.title = `${produto.nome} — Donna Donno`;
  document.getElementById("trilha-marca").textContent = marca ? marca.nome : "";
  document.getElementById("trilha-marca").href = marca ? `index.html?marca=${marca.id}` : "index.html";
  document.getElementById("trilha-produto").textContent = produto.nome;

  document.getElementById("produto-marca").textContent = marca ? marca.nome : "";
  document.getElementById("produto-marca").href = marca ? `index.html?marca=${marca.id}` : "index.html";
  document.getElementById("produto-nome").textContent = produto.nome;
  document.getElementById("produto-preco").textContent = formatarPreco(produto.preco);
  document.getElementById("produto-descricao").textContent = produto.descricao;

  const etiquetaNovidade = document.getElementById("produto-etiqueta-novidade");
  if (etiquetaNovidade) etiquetaNovidade.hidden = !produto.novidade;

  renderizarGaleria(produto);

  const blocoTamanhos = document.getElementById("bloco-tamanhos");

  if (produto.tamanhos && produto.tamanhos.length && produto.tamanhos[0] !== "Único") {
    blocoTamanhos.hidden = false;
    renderizarPilulas(document.getElementById("pilulas-tamanho"), produto.tamanhos, null, (valor) => {
      tamanhoSelecionado = valor;
    });
  } else {
    tamanhoSelecionado = null;
    blocoTamanhos.hidden = true;
  }

  document.getElementById("botao-adicionar-selecao").addEventListener("click", () => {
    adicionarNaSelecao({
      produtoId: produto.id,
      tamanho: tamanhoSelecionado
    });
  });

  const linkWhatsApp = document.getElementById("botao-whatsapp-produto");
  linkWhatsApp.addEventListener("click", (evento) => {
    evento.preventDefault();
    const mensagem = montarMensagemProdutoUnico(produto, tamanhoSelecionado);
    window.open(gerarLinkWhatsApp(mensagem), "_blank", "noopener");
  });

  renderizarBotaoCompartilhar(produto);
}

/**
 * Botão "Compartilhar": usa o compartilhamento nativo do celular/navegador
 * quando disponível (Web Share API) e, se não houver suporte (a maioria dos
 * navegadores de desktop), copia o link da peça para a área de transferência.
 */
function renderizarBotaoCompartilhar(produto) {
  const botao = document.getElementById("botao-compartilhar");
  if (!botao) return;

  const marca = buscarMarcaPorId(produto.marca);
  const url = `${window.location.origin}${window.location.pathname}?id=${produto.id}`;
  const texto = `${produto.nome}${marca ? " — " + marca.nome : ""} — confira no catálogo da ${CONFIG.nomeLoja}`;

  botao.addEventListener("click", async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title: produto.nome, text: texto, url });
      } catch (erro) {
        // Usuário cancelou o compartilhamento — não é um erro, não precisa de feedback.
      }
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
      mostrarToast("Link copiado!");
    } catch (erro) {
      mostrarToast("Não foi possível copiar o link");
    }
  });
}

function renderizarProdutoNaoEncontrado() {
  document.getElementById("produto-conteudo").hidden = true;
  document.getElementById("produto-nao-encontrado").hidden = false;
}

document.addEventListener("DOMContentLoaded", async () => {
  try {
    await carregarCatalogo();
  } catch (erro) {
    renderizarProdutoNaoEncontrado();
    return;
  }

  const id = obterParametroUrl("id");
  produtoAtual = buscarProdutoPorId(id);
  if (!produtoAtual) {
    renderizarProdutoNaoEncontrado();
    return;
  }
  renderizarProduto(produtoAtual);
});
