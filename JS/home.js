
let currentFilters = {
  season: "",
  price: "",
  color: "",
  search: "",
};

document.addEventListener("DOMContentLoaded", function () {
  document
    .getElementById("filter-season")
    .addEventListener("change", applyFilters);
  document
    .getElementById("filter-price")
    .addEventListener("change", applyFilters);
  document
    .getElementById("filter-color")
    .addEventListener("change", applyFilters);

  applyFilters();
});

function searchProduct() {
  const searchInput = document
    .querySelector(".search-container input")
    .value.toLowerCase();
  currentFilters.search = searchInput;
  applyFilters();
}

function applyFilters() {
  currentFilters.season = document.getElementById("filter-season").value;
  currentFilters.price = document.getElementById("filter-price").value;
  currentFilters.color = document.getElementById("filter-color").value;

  const products = document.querySelectorAll("#products-container .product");

  products.forEach((product) => {
    let shouldShow = true;

    // Filter by season
    if (
      currentFilters.season &&
      product.dataset.season !== currentFilters.season &&
      product.dataset.season !== "all"
    ) {
      shouldShow = false;
    }

    // Filter by color
    if (
      currentFilters.color &&
      !product.dataset.color.includes(currentFilters.color)
    ) {
      shouldShow = false;
    }

    // Filter by price
    if (currentFilters.price) {
      const productPrice = parseFloat(product.dataset.price);

      if (currentFilters.price === "low-high") {
        // Products are sorted later, no filtering needed
      } else if (currentFilters.price === "high-low") {
        // Products are sorted later, no filtering needed
      }
    }

    // Filter by search text
    if (currentFilters.search) {
      const productName = product
        .querySelector(".product-name")
        .textContent.toLowerCase();
      if (!productName.includes(currentFilters.search)) {
        shouldShow = false;
      }
    }

    // Show or hide based on filters
    if (shouldShow) {
      product.classList.remove("hidden");
    } else {
      product.classList.add("hidden");
    }
  });

  // Sort by price if needed
  if (
    currentFilters.price === "low-high" ||
    currentFilters.price === "high-low"
  ) {
    sortProductsByPrice(currentFilters.price === "low-high");
  }
}

// Function to sort products by price
function sortProductsByPrice(ascending) {
  const productsContainer = document.getElementById("products-container");
  const products = Array.from(
    productsContainer.querySelectorAll(".product:not(.hidden)")
  );

  // Sort products by price
  products.sort((a, b) => {
    const priceA = parseFloat(a.dataset.price);
    const priceB = parseFloat(b.dataset.price);

    return ascending ? priceA - priceB : priceB - priceA;
  });

  // Remove all products from the container
  products.forEach((product) => productsContainer.removeChild(product));

  // Append them back in the sorted order
  products.forEach((product) => productsContainer.appendChild(product));
}

function displayProducts(products) {
  const productsContainer = document.querySelector(".products");
  productsContainer.innerHTML = "";
  products.forEach((product) => {
    const productElement = document.createElement("div");
    productElement.classList.add("product");
    productElement.innerHTML = `
            <img src="${product.image}" alt="${product.name}" />
            <h3>${product.name}</h3>
            <p>${product.price}</p>
        `;
    productsContainer.appendChild(productElement);
  });
  // load lại trag khi đăng nhập thành công
  window.addEventListener('DOMContentLoaded', () => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    const name = localStorage.getItem('name');
    const greeting = document.getElementById('greeting');
  
    if (isLoggedIn && name && greeting) {
      greeting.textContent = `👋 Xin chào, ${name}`;
    }
  });
  
}
