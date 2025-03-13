document.addEventListener("DOMContentLoaded", () => {
    const cartItemsContainer = document.getElementById("cart-items");
    const cartTotal = document.getElementById("cart-total");
    const clearCartBtn = document.getElementById("clear-cart-btn");
    const cartCount = document.getElementById("cart-count");
    const checkoutModal = document.getElementById("checkout-modal");
    const checkoutForm = document.getElementById("checkout-form");
    const closeCheckoutModalBtn = document.getElementById("close-checkout-modal");
    const checkoutBtn = document.getElementById("checkout-btn");
    const orderItemsList = document.getElementById("order-items");
    const totalPriceEl = document.getElementById("total-price");
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    // Function to update cart display
    function updateCartDisplay() {
        cartItemsContainer.innerHTML = "";
        let total = 0;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
            cartTotal.textContent = "$0.00";
            if (cartCount) cartCount.textContent = "0";
            return;
        }

        cart.forEach((item, index) => {
            const cartItem = document.createElement("div");
            cartItem.classList.add("cart-item");

            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" width="50">
                <div>
                    <h3>${item.name}</h3>
                    <p>$${item.price.toFixed(2)} x <span class="quantity-value">${item.quantity}</span></p>
                </div>
                <div class="quantity-controls">
                    <button class="quantity-btn minus-btn" data-index="${index}">-</button>
                    <button class="quantity-btn plus-btn" data-index="${index}">+</button>
                </div>
                <button class="remove-btn" data-index="${index}">Remove</button>
            `;
            cartItemsContainer.appendChild(cartItem);
            total += item.price * item.quantity;
        });

        cartTotal.textContent = `${total.toFixed(2)}`;
        if (cartCount) cartCount.textContent = cart.reduce((sum, item) => sum + item.quantity, 0);

        localStorage.setItem("cart", JSON.stringify(cart));
    }

    
    // Handle quantity increase/decrease
    cartItemsContainer.addEventListener("click", (event) => {
        const index = event.target.dataset.index;

        if (event.target.classList.contains("plus-btn")) {
            cart[index].quantity++;
        } else if (event.target.classList.contains("minus-btn")) {
            if (cart[index].quantity > 1) {
                cart[index].quantity--;
            }
        } else if (event.target.classList.contains("remove-btn")) {
            cart.splice(index, 1);
        }

        updateCartDisplay();
    });
    checkoutBtn.addEventListener("click", () => {
        updateOrderSummary();
        checkoutModal.style.display = "flex";
    });
    function updateCartUI() {
        cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
        cartTotal.textContent = "0.00";
        cartCount.textContent = "0";
    }

    // Function to clear the cart
    clearCartBtn.addEventListener("click", () => {
        cart = []; // Reset cart array
        localStorage.removeItem("cart"); // Clear from localStorage
        updateCartUI(); // Update UI
    });
    function updateOrderSummary() {
        orderItemsList.innerHTML = ""; // Clear previous list
        let totalPrice = 0;

        if (cart.length === 0) {
            orderItemsList.innerHTML = "<p>Your cart is empty.</p>";
            totalPriceEl.textContent = "0.00";
            return;
        }

        cart.forEach(item => {
            const listItem = document.createElement("li");
            listItem.innerHTML = `
                <span>${item.name} x ${item.quantity}</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            orderItemsList.appendChild(listItem);
            totalPrice += item.price * item.quantity;
        });

        totalPriceEl.textContent = totalPrice.toFixed(2);
    }

    // Close modal when clicking outside or on close button
    closeCheckoutModalBtn.addEventListener("click", closeCheckoutModal);
    checkoutModal.addEventListener("click", (e) => {
        if (e.target === checkoutModal) {
            closeCheckoutModal();
        }
    });

    function closeCheckoutModal() {
        checkoutModal.style.display = "none";
    }

    // Checkout Form Validation
    checkoutForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const address = document.getElementById("address").value.trim();
        const payment = document.getElementById("payment").value;

        if (name === "" || email === "" || address === "" || payment === "") {
            alert("Please fill in all fields before proceeding.");
            return;
        }

        // Fake order processing
        setTimeout(() => {
            alert("Order placed successfully!");
            localStorage.removeItem("cart"); // Clear cart after checkout
            window.location.reload(); // Refresh the cart page
        }, 1500);
    });
    // Initialize
    updateCartDisplay();
});
