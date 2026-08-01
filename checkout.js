// ------------------ INITIALIZE CART ------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];
updateCartCount();

// ------------------ RENDER ITEMS ------------------
function renderCheckoutItems() {
  const reviewContainer = document.getElementById("review-items");
  const subtotalEl = document.getElementById("subtotal");

  reviewContainer.innerHTML = "";
  let subtotal = 0;

  cart.forEach((item, index) => {
    const itemTotal = item.price * item.quantity;
    subtotal += itemTotal;

    const div = document.createElement("div");
    div.classList.add("checkout-item");
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" class="checkout-item-img">
      <div class="checkout-item-info">
        <h3>${item.name}</h3>
        <p>Price: GHS ${item.price}</p>
        <p>Quantity: ${item.quantity}</p>
        <p>Total: GHS ${itemTotal}</p>
        <button onclick="removeItem(${index})">Remove</button>
      </div>
    `;
    reviewContainer.appendChild(div);
  });

  subtotalEl.textContent = subtotal.toFixed(2);
  updateTotals();
}

// ------------------ UPDATE CART COUNT ------------------
function updateCartCount() {
  const cartCountEl = document.getElementById("cart-count");
  if (cartCountEl) {
    const count = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountEl.textContent = count;
  }
}

// ------------------ REMOVE ITEM ------------------
function removeItem(index) {
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCheckoutItems();
  updateCartCount();
}

// ------------------ DELIVERY FEE ------------------
const deliverySelect = document.getElementById("delivery");
deliverySelect.addEventListener("change", updateTotals);

function updateTotals() {
  const subtotal = parseFloat(document.getElementById("subtotal").textContent) || 0;
  let fee = 0;
  switch (deliverySelect.value) {
    case "Ashaiman": fee = 15; break;
    case "Tema": fee = 10; break;
    case "Lashibi": fee = 20; break;
  }
  document.getElementById("deliveryFee").textContent = fee.toFixed(2);
  document.getElementById("total").textContent = (subtotal + fee).toFixed(2);
}

// ------------------ PAYMENT ------------------
document.getElementById("payNowBTN").addEventListener("click", () => {
  const paymentMethod = document.getElementById("payment").value;
  const deliveryArea = deliverySelect.value;
  const total = document.getElementById("total").textContent;
  const userEmail = localStorage.getItem("userEmail") || "guest@example.com";

  if (!paymentMethod || !deliveryArea) {
    alert("Please select delivery area and payment method.");
    return;
  }

  // Send order to Google Sheets
  fetch("https://script.google.com/macros/s/AKfycbyNDJsBOuHhahWQfqom_jU0Rku5wJLCLFn-xAqIj2Ht9Mh6WzqIDRJviOoNY_cUx3OjiA/exec", {
    method: "POST",
    body: JSON.stringify({ cart, deliveryArea, paymentMethod, total, userEmail }),
    headers: { "Content-Type": "application/json" }
  })
  .then(response => response.text())
  .then(data => {
    console.log("Server response:", data); // Debug log
    if (data.includes("ERROR")) {
      alert("Server error: " + data);
    } else {
      alert("Order logged successfully!");
      localStorage.removeItem("cart");
      window.location.href = "/" + paymentMethod + "_payment.html";
    }
  })
  .catch(error => {
    console.error("Fetch error:", error);
    alert("Something went wrong. Please try again.");
  });
});

// ------------------ CONTINUE SHOPPING ------------------
function continueShopping() {
  window.location.href = "/";
}

// ------------------ INITIAL RENDER ------------------
document.addEventListener("DOMContentLoaded", renderCheckoutItems);
