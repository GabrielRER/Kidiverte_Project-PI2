import { Component } from '@angular/core';

@Component({
  selector: 'app-plp',
  templateUrl: './plp.html',
  styleUrl: './plp.css',
})
export class Plp {}

type Produto = {
  id: number;
  nome: string;
  preco: number;
  img: string;
};

// BASE DE PRODUTOS (mock)
const produtos: Produto[] = [
  {
    id: 1,
    nome: "Carrinho Hot Wheels",
    preco: 30,
    img: "https://via.placeholder.com/150"
  },
  {
    id: 2,
    nome: "Lego Minecraft",
    preco: 280,
    img: "https://via.placeholder.com/150"
  }
];

// simular até 38 produtos
while (produtos.length < 38) {
  const copia: Produto[] = produtos.map((p, index) => ({
    ...p,
    id: produtos.length + index + 1
  }));
  produtos.push(...copia);
}
produtos.length = 38;

// CONTROLE DE EXIBIÇÃO
let quantidadeVisivel: number = 12;

// ELEMENTOS DOM
const lista = document.getElementById("listaProdutos") as HTMLDivElement;
const btn = document.getElementById("btnVerMais") as HTMLButtonElement;
const range = document.getElementById("rangePreco") as HTMLInputElement;
const valorPreco = document.getElementById("valorPreco") as HTMLParagraphElement;

// RENDERIZAÇÃO DOS PRODUTOS
function renderProdutos(): void {
  lista.innerHTML = "";

  const precoMax: number = parseFloat(range.value);

  const filtrados: Produto[] = produtos.filter(
    (p) => p.preco <= precoMax
  );

  const produtosVisiveis = filtrados.slice(0, quantidadeVisivel);

  produtosVisiveis.forEach((prod) => {
    // LINK (PDP)
    const link = document.createElement("a");
    link.href = `/pdp.html?id=${prod.id}`;
    link.classList.add("card-link");

    // CARD
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <div class="card-img">
        <img src="${prod.img}" alt="${prod.nome}">
      </div>
      <div class="card-info">
        <h4 class="card-titulo">${prod.nome}</h4>
        <p class="card-preco">R$ ${prod.preco.toFixed(2)}</p>
      </div>
    `;

    link.appendChild(card);
    lista.appendChild(link);
  });

  // CONTROLE DO BOTÃO
  if (quantidadeVisivel >= filtrados.length) {
    btn.style.display = "none";
  } else {
    btn.style.display = "block";
  }
}

// BOTÃO "VER MAIS"
btn.addEventListener("click", (): void => {
  quantidadeVisivel += 12;
  renderProdutos();
});

// FILTRO DE PREÇO
range.addEventListener("input", (): void => {
  valorPreco.textContent = `Até R$ ${range.value}`;
  quantidadeVisivel = 12;
  renderProdutos();
});

// INIT
renderProdutos();

