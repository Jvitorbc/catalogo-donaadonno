# Catálogo Donna Donno

Catálogo digital da Donna Donno — site simples, sem e-commerce tradicional, feito em HTML, CSS e JavaScript puro (sem frameworks, sem build). O visitante navega pelas peças, monta uma "Minha seleção" e envia a consulta pronta pelo WhatsApp.

Este é o estado do projeto na **Versão 19** (a mesma que está publicada no link de visualização usado durante o desenvolvimento).

## Estrutura de pastas

```
catalogo-roupas/
├── index.html         → página inicial — já é o catálogo completo, com busca e filtros
├── produto.html         → página de detalhes de uma peça
├── selecao.html          → "Minha seleção" (lista de consulta)
│
├── css/
│   ├── style.css         → base do site (cores, tipografia, header, rodapé)
│   ├── componentes.css    → botões, cards, filtros, galeria, página de produto
│   └── responsivo.css     → ajustes para telas maiores (tablet/desktop)
│
├── js/
│   ├── app.js            → configuração da loja, funções compartilhadas (WhatsApp, "Minha seleção")
│   ├── marcas.js          → lista das marcas parceiras
│   ├── produtos.js        → dados de cada peça (nome, marca, preço, fotos, vídeo, tamanhos, cores...)
│   ├── catalogo.js        → lógica da página inicial/catálogo (busca, filtros) — carregado por index.html
│   ├── produto.js         → lógica da página de detalhes
│   └── selecao.js         → lógica da "Minha seleção"
│
└── assets/
    ├── icones/            → logo (versão ameixa e versão branca) em SVG
    └── imagens/            → fotos das peças (hoje só 5 fotos de exemplo — o resto é placeholder)
```

Até a Versão 18, a home (`index.html`) e o catálogo completo viviam em arquivos separados (`index.html` e `catalogo.html`) e eram quase idênticos. Na Versão 19 eles viraram uma coisa só: `index.html` já é o catálogo completo (com busca e filtro), então `catalogo.html` não existe mais no projeto.

## Como rodar localmente

É um site estático — não precisa instalar nada. Duas formas simples:

1. **VS Code + Live Server**: instale a extensão "Live Server", clique com o botão direito em `index.html` e escolha "Open with Live Server".
2. **Terminal**: dentro da pasta do projeto, rode `python3 -m http.server` e abra `http://localhost:8000` no navegador.

## O que ainda é fictício (trocar antes de publicar de verdade)

- **WhatsApp da loja**: `CONFIG.whatsapp` em `js/app.js` (linha ~16) — hoje é um número de exemplo.
- **Nome da loja / textos gerais**: também em `CONFIG`, no topo de `js/app.js`.
- **Marcas**: `js/marcas.js` — hoje só Fátima Scofield, Kalandra e Arte Sacra, sem descrição oficial.
- **Peças (produtos)**: `js/produtos.js` — nomes, preços, descrições, tecido/caimento, tamanhos, cores e fotos/vídeo de cada peça. Cada peça tem um campo `fotos` (array de caminhos, ou `null` onde ainda não há foto real) e `video` (true/false).
- **Instagram e endereço no rodapé**: os links de Instagram e mapa em todas as páginas (procure por `rodape__icone`) e o texto "Petrolina, PE" (`rodape__endereco`) são fictícios.
- **Fotos atuais**: as 5 fotos em `assets/imagens/` são só exemplo visual (não são da Donna Donno) — precisam ser trocadas por fotos que a loja tenha direito de usar antes de publicar de verdade.

## Subindo para o GitHub

```bash
git init
git add .
git commit -m "Primeira versão do catálogo Donna Donno"
git branch -M main
git remote add origin <URL_DO_SEU_REPOSITORIO>
git push -u origin main
```

Depois disso, dá para publicar de graça em **GitHub Pages**, **Netlify** ou **Vercel** — qualquer um deles serve bem, já que é um site estático (sem backend).

## Fotos e vídeos: usando um serviço de armazenamento (opcional)

Hoje as fotos ficam dentro da própria pasta `assets/imagens/`, referenciadas por caminho local (ex: `"assets/imagens/vestido-lora-01.jpg"`). Isso funciona, mas deixa o repositório pesado conforme mais fotos e vídeos forem entrando.

Uma alternativa é hospedar as mídias em um serviço como o **Supabase Storage** e trocar, em `js/produtos.js`, o caminho local pela URL pública do arquivo (ex: `"https://xxxxx.supabase.co/storage/v1/object/public/produtos/vestido-lora-01.jpg"`). O código do site não precisa de nenhuma outra mudança — ele já trata `fotos`/`video` como um caminho de string, seja local ou uma URL completa.
