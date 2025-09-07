const PRODUTOS_POR_PAGINA = 10;
let paginaAtual = 1;
let totalPaginas = 1;
let produtosFiltrados = [];

// ⋆.ೃ࿔*:･ 𝕻𝖗𝖔𝖉𝖚𝖙𝖔𝖘
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function criarProdutoHTML(produto) {
  return `
    <div class="produto">
      <div class="produto_img">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
      </div>
      <div class="produto_info">
        <h4 class="produto_nome">${produto.nome}</h4>
        <p class="produto_valor">${formatarPreco(produto.valor)}</p>
        <button class="botao">COMPRAR</button>
      </div>
    </div>
  `;
}

// ⋆.ೃ࿔*:･ 𝕻𝖆𝖌𝖎𝖓𝖆𝖈̧𝖆̃𝖔
function criarPaginacao() {
  const paginacao = document.querySelector(".paginacao");
  if (!paginacao) return;

  let html = "";
  for (let i = 1; i <= totalPaginas; i++) {
    html += `<button class="pagina-btn ${i === paginaAtual ? "ativo" : ""}" data-pagina="${i}">${i}</button>`;
  }
  paginacao.innerHTML = html;

  document.querySelectorAll(".pagina-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      paginaAtual = parseInt(e.target.dataset.pagina);
      mostrarProdutosPagina();
      atualizarBotoesPaginacao();
    });
  });
}

function atualizarBotoesPaginacao() {
  document.querySelectorAll(".pagina-btn").forEach((btn) => {
    const pagina = parseInt(btn.dataset.pagina);
    btn.classList.toggle("ativo", pagina === paginaAtual);
  });
}

function mostrarProdutosPagina() {
  const inicio = (paginaAtual - 1) * PRODUTOS_POR_PAGINA;
  const fim = inicio + PRODUTOS_POR_PAGINA;
  const produtosPagina = produtosFiltrados.slice(inicio, fim);

  const container = document.querySelector(".produto_container");
  if (!container) return;

  container.innerHTML = produtosPagina.map(criarProdutoHTML).join("");
}

// ⋆.ೃ࿔*:･ 𝕮𝖆𝖗𝖗𝖊𝖌𝖆𝖗 𝕻𝖗𝖔𝖉𝖚𝖙𝖔𝖘
async function carregarProdutos(categoria = null) {
  try {
    const response = await fetch("/js/produtos.json");
    const data = await response.json();

    produtosFiltrados = data.produtos.filter(p => p.valor > 0);

    if (categoria) {
      produtosFiltrados = produtosFiltrados.filter(p => p.categoria === categoria);
    }

    totalPaginas = Math.ceil(produtosFiltrados.length / PRODUTOS_POR_PAGINA);
    paginaAtual = 1;

    mostrarProdutosPagina();
    criarPaginacao();
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// ⋆.ೃ࿔*:･ 𝕯𝖊𝖘𝖙𝖆𝖖𝖚𝖊𝖘 𝖕𝖆𝖗𝖆 𝕴𝖓𝖉𝖊𝖝
async function carregarProdutosDestaque() {
  try {
    const response = await fetch("/js/produtos.json");
    const data = await response.json();
    const container = document.querySelector(".produto_container");

    if (!container) return;

    const produtosAleatorios = data.produtos
      .filter(p => p.nome && p.valor > 0)
      .sort(() => 0.5 - Math.random())
      .slice(0, 6);

    container.innerHTML = produtosAleatorios.map(criarProdutoHTML).join("");
  } catch (error) {
    console.error("Erro ao carregar produtos em destaque:", error);
  }
}

// ⋆.ೃ࿔*:･ 𝕯𝖔𝖒 𝖈𝖔𝖓𝖙𝖊𝖓𝖙 𝖑𝖔𝖆𝖉𝖊𝖉
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("/pages/category/")) {
    const categoria = path.split("/").pop().replace(".html", "");
    carregarProdutos(categoria);
  } else if (path.includes("/pages/produtos.html")) {
    carregarProdutos();
  } else if (path === "/index.html" || path === "/") {
    carregarProdutosDestaque();
  }
});
