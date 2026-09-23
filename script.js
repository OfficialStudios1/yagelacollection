/* =========================================
   YAGELA COLLECTION HUB
   SCRIPT.JS
========================================= */


/* PRELOADER */

window.addEventListener("load", function () {

    const preloader = document.getElementById("preloader");

    setTimeout(() => {

        preloader.style.opacity = "0";

        preloader.style.visibility = "hidden";

    }, 700);

});


/* =========================================
   MOBILE MENU
========================================= */

const menuBtn = document.getElementById("menuBtn");

const navLinks = document.getElementById("navLinks");


menuBtn.addEventListener("click", function () {

    navLinks.classList.toggle("active");

});


document.querySelectorAll(".nav-links a").forEach(link => {

    link.addEventListener("click", function () {

        navLinks.classList.remove("active");

    });

});


/* =========================================
   DARK / LIGHT MODE
========================================= */

const themeToggle = document.getElementById("themeToggle");


themeToggle.addEventListener("click", function () {

    document.body.classList.toggle("dark-mode");


    const icon = themeToggle.querySelector("i");


    if (document.body.classList.contains("dark-mode")) {

        icon.classList.remove("fa-moon");

        icon.classList.add("fa-sun");

        localStorage.setItem("theme", "dark");

    } else {

        icon.classList.remove("fa-sun");

        icon.classList.add("fa-moon");

        localStorage.setItem("theme", "light");

    }

});


/* LOAD SAVED THEME */

if (localStorage.getItem("theme") === "dark") {

    document.body.classList.add("dark-mode");

    const icon = themeToggle.querySelector("i");

    icon.classList.remove("fa-moon");

    icon.classList.add("fa-sun");

}


/* =========================================
   SEARCH PRODUCTS
========================================= */

const searchToggle = document.querySelector(".search-toggle");

const searchOverlay = document.getElementById("searchOverlay");

const closeSearch = document.getElementById("closeSearch");

const searchInput = document.getElementById("searchInput");


searchToggle.addEventListener("click", function () {

    searchOverlay.classList.add("active");

    searchInput.focus();

});


closeSearch.addEventListener("click", function () {

    searchOverlay.classList.remove("active");

});


searchInput.addEventListener("input", function () {

    const searchValue = this.value.toLowerCase();

    const products = document.querySelectorAll(".product-card");


    products.forEach(product => {

        const productName = product
            .querySelector("h3")
            .textContent
            .toLowerCase();


        if (productName.includes(searchValue)) {

            product.style.display = "block";

        } else {

            product.style.display = "none";

        }

    });


    if (searchValue.length > 0) {

        searchOverlay.classList.remove("active");

        document.getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });

    }

});


/* =========================================
   PRODUCT FILTERING
========================================= */

const filterButtons = document.querySelectorAll(".filter-btn");

const productCards = document.querySelectorAll(".product-card");


filterButtons.forEach(button => {

    button.addEventListener("click", function () {


        filterButtons.forEach(btn => {

            btn.classList.remove("active");

        });


        this.classList.add("active");


        const filter = this.dataset.filter;


        productCards.forEach(product => {


            if (
                filter === "all" ||
                product.dataset.category === filter
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

});


/* =========================================
   CATEGORY CLICK FILTER
========================================= */

const categoryCards = document.querySelectorAll(".category-card");


categoryCards.forEach(card => {

    card.addEventListener("click", function () {

        const category = this.dataset.category;


        document.getElementById("shop")
            .scrollIntoView({
                behavior: "smooth"
            });


        productCards.forEach(product => {


            if (
                product.dataset.category === category
            ) {

                product.style.display = "block";

            } else {

                product.style.display = "none";

            }

        });

    });

});


/* =========================================
   SHOPPING CART
========================================= */

let cart = JSON.parse(localStorage.getItem("yagelaCart")) || [];


const cartButton = document.getElementById("cartButton");

const cartSidebar = document.getElementById("cartSidebar");

const closeCart = document.getElementById("closeCart");

const cartOverlay = document.getElementById("cartOverlay");

const cartItems = document.getElementById("cartItems");

const cartCount = document.getElementById("cartCount");

const cartTotal = document.getElementById("cartTotal");


/* OPEN CART */

cartButton.addEventListener("click", openCart);


function openCart() {

    cartSidebar.classList.add("active");

    cartOverlay.classList.add("active");

}


/* CLOSE CART */

closeCart.addEventListener("click", closeCartFunction);

cartOverlay.addEventListener("click", closeCartFunction);


function closeCartFunction() {

    cartSidebar.classList.remove("active");

    cartOverlay.classList.remove("active");

}


/* ADD TO CART */

document.querySelectorAll(".add-cart")
    .forEach(button => {


        button.addEventListener("click", function () {


            const name = this.dataset.name;

            const price = Number(this.dataset.price);


            const existingItem = cart.find(item => {

                return item.name === name;

            });


            if (existingItem) {

                existingItem.quantity += 1;

            } else {

                cart.push({

                    name: name,

                    price: price,

                    quantity: 1

                });

            }


            saveCart();

            updateCart();

            openCart();

        });

    });


/* SAVE CART */

function saveCart() {

    localStorage.setItem(
        "yagelaCart",
        JSON.stringify(cart)
    );

}


/* UPDATE CART */

function updateCart() {


    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML = `

            <div class="empty-cart">

                <i class="fa-solid fa-cart-shopping"></i>

                <p>Your cart is empty.</p>

            </div>

        `;

    } else {


        cart.forEach((item, index) => {


            const cartItem = document.createElement("div");


            cartItem.classList.add("cart-item");


            cartItem.innerHTML = `

                <div>

                    <h4>${item.name}</h4>

                    <p>
                        GH₵ ${item.price.toFixed(2)}
                        × ${item.quantity}
                    </p>

                </div>


                <button
                    class="remove-item"
                    onclick="removeItem(${index})"
                >

                    <i class="fa-solid fa-trash"></i>

                </button>

            `;


            cartItems.appendChild(cartItem);

        });

    }


    /* CART COUNT */

    const totalItems = cart.reduce((total, item) => {

        return total + item.quantity;

    }, 0);


    cartCount.textContent = totalItems;


    /* CART TOTAL */

    const totalPrice = cart.reduce((total, item) => {

        return total + (item.price * item.quantity);

    }, 0);


    cartTotal.textContent =

        `GH₵ ${totalPrice.toFixed(2)}`;

}


/* REMOVE ITEM */

function removeItem(index) {

    cart.splice(index, 1);

    saveCart();

    updateCart();

}


/* =========================================
   PAYMENT CHECKOUT
========================================= */

const checkoutBtn = document.getElementById("checkoutBtn");
const paymentModal = document.getElementById("paymentModal");
const closePayment = document.getElementById("closePayment");
const paymentForm = document.getElementById("paymentForm");
const paymentTotal = document.getElementById("paymentTotal");
const paymentInstructions = document.getElementById("paymentInstructions");
const paymentMethods = document.querySelectorAll(".payment-method");

const API_BASE_URL = "/api";

const paymentDetails = {
    momo: {
        title: "Mobile Money",
        content: "MTN, Telecel & AirtelTigo: <strong>0244114452</strong><br>Payment name: <strong>YAGELA COLLECTION</strong>"
    },
    card: {
        title: "Visa Card",
        content: "Visa card payments are available through WhatsApp. We never ask for your PIN or full card details."
    },
    transfer: {
        title: "Bank Transfer",
        content: "Account name: <strong>YAGELA COLLECTION</strong><br>Bank: <strong>CAL Bank</strong><br>Account number: <strong>14400004555556</strong>"
    }
};

let selectedPaymentMethod = "momo";

function updatePaymentInstructions(method) {
    selectedPaymentMethod = method;
    const details = paymentDetails[method];

    paymentMethods.forEach(button => {
        const isSelected = button.dataset.method === method;
        button.classList.toggle("active", isSelected);
        button.setAttribute("aria-selected", isSelected ? "true" : "false");
    });

    paymentInstructions.innerHTML = `<strong>${details.title}</strong><p>${details.content}</p>`;
}

checkoutBtn.addEventListener("click", function () {
    if (cart.length === 0) {
        alert("Your shopping cart is empty.");
        return;
    }

    paymentTotal.textContent = cartTotal.textContent;
    updatePaymentInstructions(selectedPaymentMethod);
    paymentModal.classList.add("active");
});

paymentMethods.forEach(button => {
    button.addEventListener("click", function () {
        updatePaymentInstructions(this.dataset.method);
    });
});

function closePaymentModal() {
    paymentModal.classList.remove("active");
}

closePayment.addEventListener("click", closePaymentModal);

paymentModal.addEventListener("click", function (event) {
    if (event.target === paymentModal) closePaymentModal();
});

paymentForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const formData = new FormData(paymentForm);
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    let message = "Hello YAGELA COLLECTION HUB!\n\nI would like to place an order:\n\n";

    cart.forEach(item => {
        message += `${item.name}\nQuantity: ${item.quantity}\nPrice: GH₵ ${(item.price * item.quantity).toFixed(2)}\n\n`;
    });

    message += `Total Order: GH₵ ${total.toFixed(2)}\n\n` +
        `Payment method: ${paymentDetails[selectedPaymentMethod].title}\n` +
        `Customer: ${formData.get("customerName")}\n` +
        `Phone: ${formData.get("customerPhone")}\n` +
        `Delivery address: ${formData.get("deliveryAddress")}`;

    try {
        await fetch(`${API_BASE_URL}/orders`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                customer: {
                    name: formData.get("customerName"),
                    phone: formData.get("customerPhone"),
                    address: formData.get("deliveryAddress")
                },
                items: cart,
                paymentMethod: selectedPaymentMethod
            })
        });
    } catch (error) {
        console.warn("Order API unavailable; continuing with WhatsApp checkout.", error);
    }

    const whatsappNumber = "233244114452";
    window.open(`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    closePaymentModal();
});


/* =========================================
   COMMENT FORM
========================================= */

const commentForm = document.getElementById("commentForm");

const commentsList = document.getElementById("commentsList");

const commentStorageKey = "yagelaComments";

const defaultComments = [

    {
        name: "Happy Customer",
        rating: 5,
        message: "Great customer service and quality products. I will definitely order again."
    },

    {
        name: "Verified Customer",
        rating: 5,
        message: "My order arrived on time and the product quality was excellent."
    }

];

let comments = JSON.parse(localStorage.getItem(commentStorageKey)) || defaultComments;

function renderComments() {

    if (!commentsList) return;

    commentsList.innerHTML = comments.map(comment => {

        const stars = "★".repeat(comment.rating) + "☆".repeat(5 - comment.rating);

        return `

            <article class="comment-item">
                <div class="comment-header">
                    <h4>${comment.name}</h4>
                    <span>${stars}</span>
                </div>
                <p>${comment.message}</p>
            </article>

        `;

    }).join("");

}

if (commentForm) {

    renderComments();

    commentForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name = document.getElementById("commentName").value.trim();
        const rating = Number(document.getElementById("commentRating").value);
        const message = document.getElementById("commentMessage").value.trim();

        if (!name || !message) return;

        comments.unshift({
            name,
            rating,
            message
        });

        localStorage.setItem(commentStorageKey, JSON.stringify(comments));

        renderComments();

        commentForm.reset();

    });

}

/* =========================================
   FAQ ACCORDION
========================================= */

const faqItems = document.querySelectorAll(".faq-item");


faqItems.forEach(item => {

    const question = item.querySelector(".faq-question");


    question.addEventListener("click", function () {


        faqItems.forEach(otherItem => {

            if (otherItem !== item) {

                otherItem.classList.remove("active");

            }

        });


        item.classList.toggle("active");

    });

});


/* =========================================
   SCROLL TO TOP
========================================= */

const scrollTop = document.getElementById("scrollTop");


window.addEventListener("scroll", function () {


    if (window.scrollY > 500) {

        scrollTop.classList.add("show");

    } else {

        scrollTop.classList.remove("show");

    }

});


scrollTop.addEventListener("click", function () {

    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

});


/* =========================================
   CUSTOMER ACCOUNT BUTTON
========================================= */

const accountBtn = document.querySelector(".account-btn");


accountBtn.addEventListener("click", function () {


    alert(

        "Customer Account System\n\n" +

        "The current website is ready for the frontend design. " +

        "To create real customer registration, login, order history " +

        "and admin accounts, connect the website to a backend such as Firebase, Supabase, Node.js or PHP/MySQL."

    );

});

// NEWSLETTER FORM

const newsletterForm = document.getElementById("newsletterForm");
const newsletterMessage = document.getElementById("newsletterMessage");

newsletterForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const formData = new FormData(newsletterForm);

    fetch(`${API_BASE_URL}/newsletter`, {
        method: "POST",

        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },

        body: new URLSearchParams(formData).toString()

    })

    .then(function () {

        newsletterMessage.innerHTML =
            " Subscribed, Thank you!";

        newsletterMessage.style.color = "white";

        newsletterForm.reset();

    })

    .catch(function (error) {

        newsletterMessage.innerHTML =
            "❌ Something went wrong. Please try again.";

        newsletterMessage.style.color = "red";

        console.error(error);

    });

});

/* =========================================
   INITIALIZE CART
========================================= */

updateCart();