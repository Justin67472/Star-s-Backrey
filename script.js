// ----------------------
// WELCOME TEXT SLIDESHOW
// ----------------------
const welcomeText = document.getElementById("welcomeText");
const welcomeMessages = [
  "Welcome to Star's Bakery",
  "Where Every Sweet Craving Is Met",
  "Shop Your Favorite Treats",
  "Quality Products • Amazing Tastes",
  "Stay Sweet, Stay Satisfied"
];
let welcomeIndex = 0;

function showNextWelcome() {
  if (!welcomeText) return;
  welcomeText.style.opacity = 0;
  setTimeout(() => {
    welcomeText.textContent = welcomeMessages[welcomeIndex];
    welcomeText.style.opacity = 1;
    welcomeIndex = (welcomeIndex + 1) % welcomeMessages.length;
  }, 500);
}

if (welcomeText) {
  showNextWelcome();
  setInterval(showNextWelcome, 3000);
}

// ----------------------
// PRODUCT CAROUSEL
// ----------------------
const carousel = document.querySelector(".product-slideshow");
if (carousel) {
  const slides = Array.from(carousel.querySelectorAll(".slide"));
  const gap = 20;
  let scrollAmount = 0;
  const speed = 3;

  slides.forEach(slide => {
    const clone = slide.cloneNode(true);
    carousel.appendChild(clone);
  });

  const totalOriginalWidth = slides.reduce((acc, slide) => acc + slide.offsetWidth + gap, 0);

  function continuousScroll() {
    scrollAmount += speed;
    if (scrollAmount >= totalOriginalWidth) scrollAmount = 0;
    carousel.scrollTo({ left: scrollAmount, behavior: 'auto' });
    requestAnimationFrame(continuousScroll);
  }

  requestAnimationFrame(continuousScroll);
}

// ----------------------
// GOOGLE SIGN-IN
// ----------------------
let currentUser = null;
const profileIcon = document.getElementById("profileIcon");

function handleCredentialResponse(response) {
  const userObject = parseJwt(response.credential);
  currentUser = userObject;

  profileIcon.textContent = "🧑";
  profileIcon.classList.add("logged-in");
  profileIcon.title = userObject.name;
  localStorage.setItem("userEmail", userObject.email);
}

function parseJwt(token) {
  const base64Url = token.split('.')[1];
  const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  const jsonPayload = decodeURIComponent(
    window.atob(base64)
      .split('')
      .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
      .join('')
  );
  return JSON.parse(jsonPayload);
}

window.onload = () => {
  if (window.google && google.accounts) {
    google.accounts.id.initialize({
      client_id: "YOUR_GOOGLE_CLIENT_ID",
      callback: handleCredentialResponse
    });
    google.accounts.id.prompt();
  }
};

// ------------------ CART FUNCTIONALITY ------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// Add item to cart
function addToCart(name, price, image) {
  const existingItem = cart.find(item => item.name === name);
  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price: parseFloat(price), image, quantity: 1 });
  }
  saveCart();
}

// Render cart items
function renderCart() {
  const cartContainer = document.getElementById("cart-container");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");

  if (!cartContainer) return;

  cartContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const card = document.createElement("div");
    card.classList.add("cart-item");
    card.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div class="cart-item-info">
        <h3>${item.name}</h3>
        <p class="price">GHS ${item.price}</p>
        <div class="quantity-controls">
          <button onclick="updateQuantity(${index}, -1)">-</button>
          <span>${item.quantity}</span>
          <button onclick="updateQuantity(${index}, 1)">+</button>
        </div>
        <p>Total: GHS ${itemTotal}</p>
        <button class="remove-btn" onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    cartContainer.appendChild(card);
  });

  subtotalElement.textContent = subtotal.toFixed(2);
  totalElement.textContent = subtotal.toFixed(2);
  updateCartCount();
}

// Update quantity
function updateQuantity(index, change) {
  cart[index].quantity += change;
  if (cart[index].quantity <= 0) cart.splice(index, 1);
  saveCart();
}

// Remove item
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
}

// Save cart
function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
}

// Proceed to checkout
function proceedCheckout() {
  localStorage.setItem("cart", JSON.stringify(cart)); // ensure latest cart is saved
  window.location.href = "/checkout";
}

// Update cart count in header
function updateCartCount() {
  const countSpan = document.getElementById("cart-count");
  if (countSpan) {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    countSpan.textContent = totalItems;
  }
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  updateCartCount();
});
