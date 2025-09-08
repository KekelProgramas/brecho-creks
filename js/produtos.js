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
    <div class="produto" onclick="irParaProduto(${produto.id})">
      <div class="produto_img">
        <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy">
      </div>
      <div class="produto_info">
        <h4 class="produto_nome">${produto.nome}</h4>
        <p class="produto_valor">${formatarPreco(produto.valor)}</p>
        <button class="botao" onclick="event.stopPropagation(); irParaProduto(${produto.id})">COMPRAR</button>
      </div>
    </div>
  `;
}

// ⋆.ೃ࿔*:･ 𝔑𝔞𝔳𝔢𝔤𝔞çã𝔬 𝔞𝔬 𝔭𝔯𝔬𝔡𝔲𝔱𝔬
function irParaProduto(id) {
  window.location.href = `/pages/produto.html?id=${id}`;
}

// ⋆.ೃ࿔*:･ 𝔏𝔬𝔞𝔡 𝔞 𝔭á𝔤𝔦𝔫𝔞 𝔡𝔬 𝔭𝔯𝔬𝔡𝔲𝔱𝔬
async function carregarPaginaProduto() {
  const urlParams = new URLSearchParams(window.location.search);
  const produtoId = parseInt(urlParams.get('id'));
  
  if (!produtoId) {
    console.error('ID do produto não encontrado na URL');
    return;
  }

  try {
    const response = await fetch('/js/produtos.json');
    const data = await response.json();
    const produto = data.produtos.find(p => p.id === produtoId);
    
    if (!produto) {
      console.error('Produto não encontrado');
      return;
    }

    // Atualizar título da página
    document.title = `Brechó Dos Creks - ${produto.nome}`;

    // Atualizar imagem do produto
    const imgProduto = document.querySelector('.page_produto_img img');
    if (imgProduto) {
      imgProduto.src = produto.imagem;
      imgProduto.alt = produto.nome;
    }

    // Atualizar nome do produto
    const nomeProduto = document.querySelector('.page_produto_nome');
    if (nomeProduto) {
      nomeProduto.textContent = produto.nome;
    }

    // Atualizar código do produto
    const idProduto = document.querySelector('.page_produto_id');
    if (idProduto) {
      idProduto.textContent = `Codigo: ${produto.id}`;
    }

    // Atualizar preços
    const precoPromocional = document.querySelector('.page_produto_preco_promo');
    const preco = document.querySelector('.page_produto_preco');
    const parcelas = document.querySelector('.page_produto_parcelas');
    
    if (preco) {
      preco.textContent = formatarPreco(produto.valor);
    }
    
    // Simular preço promocional (15% de desconto)
    if (precoPromocional) {
      const precoOriginal = produto.valor * 1.15;
      precoPromocional.textContent = formatarPreco(precoOriginal);
    }
    
    // Calcular parcelas
    if (parcelas) {
      const valorParcela = produto.valor / 3;
      parcelas.textContent = `3x de ${formatarPreco(valorParcela)}* sem juros`;
    }

    // Atualizar cores disponíveis
    atualizarCores(produto.cores);

    // Atualizar tamanhos disponíveis
    atualizarTamanhos(produto.tamanhos);

    // Adicionar descrição básica
    adicionarDescricao(produto);

  } catch (error) {
    console.error('Erro ao carregar produto:', error);
  }
}

function atualizarCores(cores) {
  const coresContainer = document.querySelector('.cores_produto');
  if (!coresContainer || !cores) return;

  coresContainer.innerHTML = '';
  
  cores.forEach((cor, index) => {
    const radioId = `cor${index + 1}`;
    const isChecked = index === 0 ? 'checked' : '';
    
    coresContainer.innerHTML += `
      <input type="radio" name="cor" id="${radioId}" ${isChecked}>
      <label for="${radioId}" class="cor" style="--cor:${cor};" title="Cor ${index + 1}"></label>
    `;
  });
}

function atualizarTamanhos(tamanhos) {
  const tamanhosContainer = document.querySelector('.page_produtos_tamanho');
  if (!tamanhosContainer || !tamanhos) return;

  // Todos os tamanhos possíveis
  const todosTamanhos = ['PP', 'P', 'M', 'G', 'GG'];
  tamanhosContainer.innerHTML = '';

  todosTamanhos.forEach((tamanho, index) => {
    const radioId = `tam${tamanho}`;
    const disponivel = tamanhos.includes(tamanho) || tamanhos.includes('tamanho único');
    const isChecked = disponivel && index === tamanhos.findIndex(t => todosTamanhos.includes(t)) ? 'checked' : '';
    const disabled = !disponivel ? 'disabled' : '';
    const classeIndisponivel = !disponivel ? 'indisponivel' : '';

    tamanhosContainer.innerHTML += `
      <input type="radio" name="tamanho" id="${radioId}" ${disabled} ${isChecked}>
      <label for="${radioId}" class="${classeIndisponivel}">${tamanho}</label>
    `;
  });

  // Se for tamanho único, mostrar apenas um tamanho
  if (tamanhos.includes('tamanho único')) {
    tamanhosContainer.innerHTML = `
      <input type="radio" name="tamanho" id="tamUnico" checked>
      <label for="tamUnico">Único</label>
    `;
  }
}

function adicionarDescricao(produto) {
  const descricaoContainer = document.querySelector('.produto_desc_conteudo p');
  if (!descricaoContainer) return;

  // Gerar descrição baseada na categoria e nome
  let descricao = '';
  
  switch (produto.categoria) {
    case 'tops':
      descricao = `${produto.nome} - Peça versátil e estilosa, perfeita para compor looks únicos. Confeccionada com materiais de qualidade, oferece conforto e durabilidade. Ideal para quem busca expressar sua personalidade através da moda.`;
      break;
    case 'bottoms':
      descricao = `${produto.nome} - Peça essencial para o seu guarda-roupa. Design moderno e confortável, adequada para diversas ocasiões. Combina estilo e praticidade em uma única peça.`;
      break;
    case 'acessorios':
      descricao = `${produto.nome} - Acessório que adiciona personalidade ao seu visual. Produto cuidadosamente selecionado para complementar seu estilo único. Perfeito para quem valoriza os detalhes.`;
      break;
    case 'pecasu':
      descricao = `${produto.nome} - Peça única e exclusiva, impossível de encontrar em outro lugar. Design diferenciado que destaca sua individualidade e bom gosto.`;
      break;
    default:
      descricao = `${produto.nome} - Produto selecionado especialmente para nossos clientes que buscam qualidade e estilo. Uma peça que fará a diferença no seu visual.`;
  }
  
  descricaoContainer.textContent = descricao;
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

// ⋆.ೃ࿔*:･ 𝔇𝔞𝔱𝔞 𝔩𝔦𝔪𝔦𝔦𝔱 𝔞 𝔞 𝔞
async function carregarProdutosPorIds(ids) {
  try {
    const response = await fetch("/js/produtos.json");
    const data = await response.json();
    
    return data.produtos.filter(produto => ids.includes(produto.id));
  } catch (error) {
    console.error("Erro ao carregar produtos por IDs:", error);
    return [];
  }
}

// ⋆.ೃ࿔*:･ 𝔇𝔬𝔪 𝔠𝔬𝔫𝔱𝔢𝔫𝔱 𝔩𝔬𝔞𝔡𝔢𝔡
document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname;

  if (path.includes("/pages/produto.html")) {
    carregarPaginaProduto();
    configurarCalculadoraCEP();
    configurarBotaoComprar();
    configurarBotaoFavoritar();
  } else if (path.includes("/pages/category/")) {
    const categoria = path.split("/").pop().replace(".html", "");
    carregarProdutos(categoria);
  } else if (path.includes("/pages/produtos.html")) {
    carregarProdutos();
  } else if (path === "/index.html" || path === "/") {
    carregarProdutosDestaque();
  }
});