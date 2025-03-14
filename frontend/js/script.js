document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const cartCount = document.getElementById("cart-count");
    const categoryFilter = document.getElementById("category-filter");
    const searchBar = document.getElementById("search-bar");

    if (!productList || !cartCount || !categoryFilter || !searchBar) {
        console.error("Required elements are missing in the DOM.");
        return;
    }

    let products = []; // Initialize an empty array

    // Fetch products from JSON file
    fetch("assets/data/products.json")
        .then(response => response.json())
        .then(data => {
            products = data;
            renderProducts();
        })
        .catch(error => console.error("Error loading products:", error));


    function renderProducts(filterCategory = "all", searchTerm = "") {
        productList.innerHTML = "";
        const filteredProducts = products.filter(product => {
            const matchesCategory = filterCategory === "all" || product.category === filterCategory;
            const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        if (filteredProducts.length === 0) {
            productList.innerHTML = "<p>No products found.</p>";
            return;
        }

        filteredProducts.forEach(product => {
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");
            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>${product.category}</p>
                <p><strong>$${product.price.toFixed(2)}</strong></p>
                <div class="button-container">
                    <button class="add-to-cart-btn">Add to Cart</button>
                    <button class="view-details-btn">View Details</button>
                </div>
            `;

            // Add event listeners
            productCard.querySelector(".add-to-cart-btn").addEventListener("click", () => addToCart(product.id));
            productCard.querySelector(".view-details-btn").addEventListener("click", () => openModal(product));

            productList.appendChild(productCard);
        });
    }

    function openModal(product) {
        const modal = document.getElementById("product-modal");
        const modalImage = document.getElementById("modal-product-image");
        const modalName = document.getElementById("modal-product-name");
        const modalDescription = document.getElementById("modal-product-description");
        const modalPrice = document.getElementById("modal-product-price");
        const addToCartBtn = document.getElementById("add-to-cart-btn");
    
        // Fill modal with product details
        modalImage.src = product.image;
        modalImage.alt = product.name;
        modalName.textContent = product.name;
        modalDescription.textContent = product.description;
        modalPrice.textContent = `$${product.price.toFixed(2)}`;
    
        // Update the "Add to Cart" button in the modal
        addToCartBtn.onclick = () => {
            addToCart(product.id);
            alert(`${product.name} added to cart!`);
            closeModal();
        };
    
        // Show the modal
        modal.style.display = "flex";
    
        // Close modal when clicking outside
        modal.addEventListener("click", (event) => {
            if (event.target === modal) {
                closeModal();
            }
        });
    }
    
    function closeModal() {
        const modal = document.getElementById("product-modal");
        modal.style.display = "none";
    }
// Ensure the close button also works
document.querySelector(".close").addEventListener("click", closeModal);    

    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    function addToCart(productId) {
        const product = products.find(p => p.id === productId);
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity++;
        } else {
            cart.push({ ...product, quantity: 1 });
        }

        updateCart();
    }

    function updateCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }

    categoryFilter.addEventListener("change", () => {
        renderProducts(categoryFilter.value, searchBar.value);
    });

    searchBar.addEventListener("input", () => {
        renderProducts(categoryFilter.value, searchBar.value);
    });

    renderProducts();
    updateCart();
});
