const body = document.querySelector("body");
const openCart = document.querySelector(".bx");
const cartContainer = document.querySelector(".x-cart-container");
const closeCart = document.querySelector(".x-sign-close");
const cartList = document.querySelector(".x-cart-order-list");
const addBtn = document.querySelectorAll(".x-button-add-to-cart");
const confirmBtn = document.querySelector(".x-cart-confirm-order");

// Click Cart Icon to Open Cart
openCart.addEventListener("click", (event) => {
    event.stopPropagation();
    body.classList.add("x-cart-active");
});

// Click Close Sign to Close Cart
closeCart.addEventListener("click", () => {
    body.classList.remove("x-cart-active");
});

// Click Outside Cart Container Will Close Cart
body.addEventListener("click", (event) => {
    if (!cartContainer.contains(event.target) && !event.target.classList.contains(openCart)) {
        body.classList.remove("x-cart-active");
    }
});

// Initialize an Empty Cart Object
const cart = JSON.parse(localStorage.getItem('cart')) || {};

// Call UpdateCartList
// Useful When There is Unfinished Work
updateCartList();

// Click Button to Add Product into Cart
addBtn.forEach(button => {
    button.addEventListener("click", () => {
        const id = button.getAttribute("data-x-product-id");
        const name = button.getAttribute("data-x-product-name");
        const price = button.getAttribute("data-x-product-price");
        const image = button.getAttribute("data-x-product-image");
        const success = document.querySelector(".x-success-add-to-cart-message");

        if (cart[id]) {
            cart[id].quantity++;
        }
        else {
            cart[id] = {
                image: image,
                name: name,
                price: price,
                quantity: 1
            }
        }

        // Save Updated Action to Localstorage
        localStorage.setItem("cart", JSON.stringify(cart));

        // Call Function To Update Item in Cart List
        updateCartList();

        // Call toastSuccess Function
        toastSuccess();

        // Function To Display Success Message When Success Add To Cart
        function toastSuccess() {
            let toastText = document.createElement("div");

            toastText.classList.add("x-toast-success-message");
            toastText.innerHTML = `<i class='bx bxs-check-circle'></i><span class="x-toast-success-message-text">Successful Add Product to Cart</span>`;
            success.appendChild(toastText);

            setTimeout(() => {
                toastText.remove();
            }, 2200);
            
        }
    });
});

// Event Minus Button in Cart List to Minus Quantity of Product
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("x-button-minus")) {
        const id = event.target.getAttribute("data-x-product-id");
        const quantityCartListText = document.querySelector(`[data-x-product-id="${id}"]`);

        if (cart[id] && cart[id].quantity > 1) {
            cart[id].quantity--;
            quantityCartListText.textContent = cart[id].quantity;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartList();
        }
    }
});

// Event Plus Button in Cart List to Add Quantity of Product
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("x-button-plus")) {
        const id = event.target.getAttribute("data-x-product-id");

        if (cart[id]) {
            cart[id].quantity++;
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartList();
        }
    }
});

// Event Delete Button in Cart List to Delete Each Product
document.addEventListener("click", (event) => {
    if (event.target.classList.contains("bxs-trash")) {
        const id = event.target.getAttribute("data-x-product-id");

        if (cart[id]) {
            delete cart[id];
            localStorage.setItem("cart", JSON.stringify(cart));
            updateCartList();
        }
    }
});

// Function to Update Cart List
function updateCartList() {
    // Clear The Existing Cart List
    cartList.innerHTML = "";

    // Initialize Total Product Price and Total Product Quantity
    let totalPrice = 0;
    let totalProductQuantity = 0;

    for (const id in cart) {
        const product = cart[id];
        const listItem = document.createElement("li");

        // Calculate The Total Price for Each of The Product Based on Quantity
        const totalEachProductPrice = product.price * product.quantity;

        listItem.innerHTML = `
            <div class="x-cart-list-product-image">
                <img src="${product.image}" alt="${product.name}" class="x-cart-list-image">
            </div>
            <div class="x-cart-list-product-name">
                <span class="x-cart-list-text">${product.name}</span>
            </div>
            <div class="x-cart-list-product-total-price">
                <span class="x-cart-list-text">RM ${(totalEachProductPrice).toFixed(2)}</span>
            </div>
            <div class="x-cart-list-product-action">
                <button type="button" class="x-button-minus" data-x-product-id="${id}">
                    -
                </button>
                <span class="x-cart-list-text">${product.quantity}</span>
                <button type="button" class="x-button-plus" data-x-product-id="${id}">
                    +
                </button>
            </div>
            <div class="x-cart-list-product-delete">
                <button type="button" title="Delete-Product-in-Cart" class="x-cart-list-delete" data-x-product-id="${id}">
                    <i class='bx bxs-trash' data-x-product-id="${id}"></i>
                </button>
            </div>
        `;

        cartList.appendChild(listItem);

        // Calculate The Item Subtotal and Add It To The Total Amount
        const priceSubTotal = product.price * product.quantity;
        totalPrice += priceSubTotal;

        // Calculate Total Quantity Product in Cart
        totalProductQuantity += product.quantity;
    }

    // Update The Cart Text for Total Product Price and Total Product Quantity
    const totalQuantityTopText = document.querySelector(".x-cart-quantity");
    const totalPriceText = document.querySelector(".x-cart-summary-price");
    const totalQuantityText = document.querySelector(".x-cart-summary-quantity");

    totalQuantityTopText.textContent = totalProductQuantity;
    totalPriceText.textContent = `RM ${totalPrice.toFixed(2)}`;
    totalQuantityText.textContent = `Total ${totalProductQuantity} items`;

    // Check If Cart List is Empty, Display Empty Content. If Not, Display The Necessary Content
    if (totalProductQuantity === 0) {
        const emptyCartListContent = document.createElement("li");
        emptyCartListContent.classList.add("x-cart-empty-list");
        emptyCartListContent.innerHTML = `
            <i class='bx bxs-x-circle'></i>
            <span class="x-cart-empty-list-text">No item in cart</span>
        `;
        cartList.appendChild(emptyCartListContent);
    }

    // Make Confirm Button In Cart Enabled When There Are Product In Cart But Disabled When The Cart is Empty
    if (totalProductQuantity > 0) {
        confirmBtn.removeAttribute("disabled");
    } else {
        confirmBtn.setAttribute("disabled", true);
    }
}