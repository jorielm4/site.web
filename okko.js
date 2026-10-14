const boutiqueName = 'Och chez JM';
const paymentLink = 'https://pay.wave.com/m/M_ci_ClPhk6bZgQoR/c/ci/';

const cart = [];

const cartItems = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const shippingEl = document.getElementById('shipping');
const totalEl = document.getElementById('total');
const checkoutBtn = document.getElementById('checkout-btn');
const paymentModal = document.getElementById('payment-modal');
const closeModalBtn = document.getElementById('close-modal');
const paymentForm = document.getElementById('payment-form');
const paymentButtons = document.querySelectorAll('.payment-btn');

document.title = `${boutiqueName} | Boutique en ligne`;
document.getElementById('brand-name').textContent = boutiqueName;
document.getElementById('footer-brand-name').textContent = boutiqueName;

function formatCurrency(value) {
  return `${new Intl.NumberFormat('fr-FR').format(value)} FCFA`;
}

function updateCart() {
  const subtotal = cart.reduce((sum, item) => sum + item.price, 0);
  const shipping = cart.length ? 1500 : 0;
  const total = subtotal + shipping;

  if (!cart.length) {
    cartItems.innerHTML = '<p class="empty-message">Votre panier est vide pour le moment.</p>';
  } else {
    cartItems.innerHTML = cart
      .map(
        (item, index) => `
          <div class="cart-item">
            <div class="cart-item-row">
              <div>
                <h4>${item.name}</h4>
                <span>${formatCurrency(item.price)}</span>
              </div>
              <button class="remove-item" data-index="${index}">Suppr.</button>
            </div>
          </div>
        `
      )
      .join('');

    document.querySelectorAll('.remove-item').forEach((button) => {
      button.addEventListener('click', () => {
        const index = Number(button.dataset.index);
        cart.splice(index, 1);
        updateCart();
      });
    });
  }

  cartCount.textContent = `${cart.length} produit${cart.length > 1 ? 's' : ''}`;
  subtotalEl.textContent = formatCurrency(subtotal);
  shippingEl.textContent = formatCurrency(shipping);
  totalEl.textContent = formatCurrency(total);
}

document.querySelectorAll('.add-to-cart').forEach((button) => {
  button.addEventListener('click', () => {
    const { name, price } = button.dataset;
    cart.push({ name, price: Number(price) });
    updateCart();
  });
});

checkoutBtn.addEventListener('click', () => {
  if (!cart.length) {
    alert('Votre panier est vide. Ajoutez au moins un produit avant de payer.');
    return;
  }

  paymentModal.classList.remove('hidden');
  paymentModal.setAttribute('aria-hidden', 'false');
});

closeModalBtn.addEventListener('click', () => {
  paymentModal.classList.add('hidden');
  paymentModal.setAttribute('aria-hidden', 'true');
});

paymentModal.addEventListener('click', (event) => {
  if (event.target === paymentModal) {
    paymentModal.classList.add('hidden');
    paymentModal.setAttribute('aria-hidden', 'true');
  }
});

paymentButtons.forEach((button) => {
  button.addEventListener('click', () => {
    paymentButtons.forEach((item) => item.classList.remove('active'));
    button.classList.add('active');
  });
});

paymentForm.addEventListener('submit', (event) => {
  event.preventDefault();

  window.open(paymentLink, '_blank', 'noopener,noreferrer');
  paymentModal.classList.add('hidden');
  paymentModal.setAttribute('aria-hidden', 'true');

  alert('Vous allez être redirigé vers le paiement Wave. Merci pour votre commande !');
  cart.length = 0;
  updateCart();
});

updateCart();
