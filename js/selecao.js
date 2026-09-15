/**
 * selecao.js — lógica da página selecao.html ("lista de consulta"),
 * o substituto do carrinho de compra tradicional neste projeto.
 */

function obterItensDetalhados() {
  return obterSelecao()
    .map((item, indice) => {
      const produto = buscarProdutoPorId(item.produtoId);
      return produto ? { ...item, produto, indice } : null;
    })
    .filter(Boolean);
}

function criarItemSelecao(itemDetalhado) {
  const { produto, tamanho, indice } = itemDetalhado;
  const marca = buscarMarcaPorId(produto.marca);
  const opcoes = tamanho ? `Tamanho ${tamanho}` : "";
  // Usa a foto real (fotos[0]) quando já existe, igual ao card do catálogo.
  const fotoCapa = (produto.fotos && produto.fotos[0]) || placeholderImg("Foto 1", produto.nome);

  const li = document.createElement("li");
  li.className = "item-lista";
  li.innerHTML = `
    <a href="produto.html?id=${produto.id}" class="item-lista__imagem">
      <img src="${fotoCapa}" alt="${produto.nome}" loading="lazy" />
    </a>
    <a href="produto.html?id=${produto.id}">
      <p class="item-lista__marca">${marca ? marca.nome : ""}</p>
      <p class="item-lista__nome">${produto.nome}</p>
      ${opcoes ? `<p class="item-lista__opcoes">${opcoes}</p>` : ""}
      <p class="item-lista__preco">${formatarPreco(produto.preco)}</p>
    </a>
  `;
  const botaoRemover = document.createElement("button");
  botaoRemover.type = "button";
  botaoRemover.className = "item-lista__remover";
  botaoRemover.setAttribute("aria-label", `Remover ${produto.nome} da seleção`);
  botaoRemover.innerHTML =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>';
  botaoRemover.addEventListener("click", () => {
    removerDaSelecao(indice);
    renderizarSelecao();
  });
  li.appendChild(botaoRemover);
  return li;
}

function renderizarSelecao() {
  const lista = document.getElementById("lista-selecao");
  const resumo = document.getElementById("resumo-selecao");
  const vazio = document.getElementById("selecao-vazio");
  const itens = obterItensDetalhados();

  lista.innerHTML = "";
  itens.forEach((item) => lista.appendChild(criarItemSelecao(item)));

  const semItens = itens.length === 0;
  lista.hidden = semItens;
  resumo.hidden = semItens;
  vazio.hidden = !semItens;

  if (semItens) return;

  const total = itens.reduce((soma, item) => soma + item.produto.preco, 0);
  document.getElementById("resumo-quantidade").textContent = itens.length;
  document.getElementById("resumo-total").textContent = formatarPreco(total);

  document.getElementById("botao-whatsapp-selecao").onclick = (evento) => {
    evento.preventDefault();
    const mensagem = montarMensagemSelecao(itens);
    window.open(gerarLinkWhatsApp(mensagem), "_blank", "noopener");
  };
}

document.addEventListener("DOMContentLoaded", renderizarSelecao);
