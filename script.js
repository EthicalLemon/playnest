const games = [
  { id: 1, name: "Cloudline Courier", category: "Adventure", description: "Explore islands and deliver packages in the sky.", price: 4.99 },
  { id: 2, name: "Mosslight", category: "Adventure", description: "Explore a forest and find hidden paths.", price: 7.99 },
  { id: 3, name: "Tiny Orbit", category: "Puzzle", description: "Solve puzzles in a small space garden.", price: 0 },
  { id: 4, name: "Night Arcade", category: "Racing", description: "Race through a city at night.", price: 3.99 },
  { id: 5, name: "Paperback Cafe", category: "Simulation", description: "Run a small cafe and bookshop.", price: 6.99 }
];

let cart = JSON.parse(localStorage.getItem("playnestCart") || "[]");
let library = JSON.parse(localStorage.getItem("playnestLibrary") || "[]");
let selectedCategory = "All";

const gameList = document.getElementById("game-list");
const cartList = document.getElementById("cart-list");
const libraryList = document.getElementById("library-list");
const searchInput = document.getElementById("search");

function saveData() {
  localStorage.setItem("playnestCart", JSON.stringify(cart));
  localStorage.setItem("playnestLibrary", JSON.stringify(library));
}

function formatPrice(price) {
  return price === 0 ? "Free" : "$" + price.toFixed(2);
}

function showGames() {
  const searchText = searchInput.value.toLowerCase();
  const filteredGames = games.filter(function(game) {
    const matchesCategory = selectedCategory === "All" || game.category === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchText);
    return matchesCategory && matchesSearch;
  });

  gameList.innerHTML = "";

  if (filteredGames.length === 0) {
    gameList.innerHTML = '<p class="empty-message">No games found.</p>';
    return;
  }

  filteredGames.forEach(function(game) {
    const alreadyOwned = library.includes(game.id);
    const alreadyInCart = cart.includes(game.id);
    let buttonText = "Add to Cart";

    if (alreadyOwned) buttonText = "In Library";
    else if (alreadyInCart) buttonText = "In Cart";
    else if (game.price === 0) buttonText = "Get Game";

    gameList.innerHTML += `
      <article class="game-card">
        <span class="game-type">${game.category}</span>
        <h3>${game.name}</h3>
        <p>${game.description}</p>
        <div class="game-bottom">
          <strong>${formatPrice(game.price)}</strong>
          <button data-game-id="${game.id}" ${alreadyOwned || alreadyInCart ? "disabled" : ""}>${buttonText}</button>
        </div>
      </article>
    `;
  });
}

function showCart() {
  cartList.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    cartList.innerHTML = '<p class="empty-message">Your cart is empty.</p>';
  }

  cart.forEach(function(id) {
    const game = games.find(function(item) {
      return item.id === id;
    });

    if (!game) return;
    total += game.price;
    cartList.innerHTML += `
      <div class="list-item">
        <div><strong>${game.name}</strong><p>${formatPrice(game.price)}</p></div>
        <button class="remove-button" data-remove-id="${game.id}">Remove</button>
      </div>
    `;
  });

  document.getElementById("total").textContent = "Total: $" + total.toFixed(2);
  document.getElementById("cart-count").textContent = cart.length;
}

function showLibrary() {
  libraryList.innerHTML = "";

  if (library.length === 0) {
    libraryList.innerHTML = '<p class="empty-message">You have not added any games yet.</p>';
    return;
  }

  library.forEach(function(id) {
    const game = games.find(function(item) {
      return item.id === id;
    });

    if (game) {
      libraryList.innerHTML += `<div class="list-item"><strong>${game.name}</strong><span>${game.category}</span></div>`;
    }
  });
}

function updatePage() {
  showGames();
  showCart();
  showLibrary();
}

gameList.addEventListener("click", function(event) {
  const button = event.target.closest("button[data-game-id]");
  if (!button) return;

  const id = Number(button.dataset.gameId);
  if (!cart.includes(id) && !library.includes(id)) {
    const game = games.find(function(item) {
      return item.id === id;
    });

    if (game.price === 0) library.push(id);
    else cart.push(id);

    saveData();
    updatePage();
  }
});

cartList.addEventListener("click", function(event) {
  const button = event.target.closest("button[data-remove-id]");
  if (!button) return;

  const id = Number(button.dataset.removeId);
  cart = cart.filter(function(item) {
    return item !== id;
  });

  saveData();
  updatePage();
});

searchInput.addEventListener("input", showGames);

document.querySelectorAll(".filter").forEach(function(button) {
  button.addEventListener("click", function() {
    document.querySelectorAll(".filter").forEach(function(item) {
      item.classList.remove("active");
    });

    button.classList.add("active");
    selectedCategory = button.dataset.filter;
    showGames();
  });
});

document.getElementById("checkout").addEventListener("click", function() {
  if (cart.length === 0) {
    alert("Your cart is empty.");
    return;
  }

  cart.forEach(function(id) {
    if (!library.includes(id)) library.push(id);
  });

  cart = [];
  saveData();
  updatePage();
  alert("Demo order completed. No payment was made.");
});

updatePage();
