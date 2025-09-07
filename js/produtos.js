// index.js

// Formata preço em reais
function formatarPreco(valor) {
  return valor.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

// Cria o HTML de cada produto
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

// Carrega 6 produtos aleatórios
async function carregarProdutosDestaque() {
  try {
    const response = await fetch("/js/produtos.json");
    const data = await response.json();
    const container = document.querySelector(".produto_container"); // usa o mesmo container do index

    if (!container) return;

    const produtosAleatorios = data.produtos
      .filter((p) => p.nome && p.valor > 0) // evita bug com produto vazio
      .sort(() => 0.5 - Math.random()) // embaralha
      .slice(0, 6); // pega 6

    container.innerHTML = produtosAleatorios
      .map((produto) => criarProdutoHTML(produto))
      .join("");
  } catch (error) {
    console.error("Erro ao carregar produtos em destaque:", error);
  }
}

// Executa só quando a página carregar
document.addEventListener("DOMContentLoaded", carregarProdutosDestaque);
