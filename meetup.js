/* ============================================================
   Meetup Shop — meetup.js
   Product catalog, cart, modal, checkout → Google Sheets
   ============================================================ */

const PRODUCTS = [
  {
    id: 1,
    name: 'Classic Meetup Tee',
    category: 'tshirts',
    price: 35,
    currency: '$',
    badge: 'New',
    badgeType: 'new',
    description: 'Our signature tee. 100% premium cotton, unisex fit. The one that started it all.',
    icon: '👕',
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Black', 'Sand'],
    inStock: true,
  },
  {
    id: 2,
    name: 'Meetup Oversized Drop',
    category: 'tshirts',
    price: 42,
    currency: '$',
    badge: 'Limited',
    badgeType: 'limited',
    description: 'Relaxed oversized silhouette. Heavy-weight cotton. Dropped shoulders, boxy cut.',
    icon: '🧥',
    sizes: ['S/M', 'M/L', 'L/XL'],
    colors: ['Washed Black', 'Off-White'],
    inStock: true,
  },
  {
    id: 3,
    name: 'Embroidered Logo Tee',
    category: 'tshirts',
    price: 48,
    currency: '$',
    badge: null,
    description: 'Premium embroidered Meetup logo on chest. Slim fit, soft-touch fabric.',
    icon: '✨',
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Navy', 'Forest Green', 'Burgundy'],
    inStock: true,
  },
  {
    id: 4,
    name: 'Meetup Cap',
    category: 'accessories',
    price: 28,
    currency: '$',
    badge: 'New',
    badgeType: 'new',
    description: '5-panel structured cap with embroidered logo. One size fits all, adjustable strap.',
    icon: '🧢',
    sizes: ['One Size'],
    colors: ['Black', 'Sand', 'White'],
    inStock: true,
  },
  {
    id: 5,
    name: 'Canvas Tote',
    category: 'accessories',
    price: 22,
    currency: '$',
    badge: null,
    description: 'Heavy-duty natural canvas tote. Meetup wordmark screen-printed in gold.',
    icon: '👜',
    sizes: ['One Size'],
    colors: ['Natural', 'Black'],
    inStock: true,
  },
  {
    id: 6,
    name: 'Meetup Hoodie',
    category: 'limited',
    price: 75,
    currency: '$',
    badge: 'Limited',
    badgeType: 'limited',
    description: 'First drop. Premium fleece, relaxed fit. Only 50 pieces made. Meetup emblem on back.',
    icon: '🔥',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Charcoal', 'Cream'],
    inStock: true,
  },
  {
    id: 7,
    name: 'Meetup Keyring',
    category: 'accessories',
    price: 12,
    currency: '$',
    badge: null,
    description: 'Solid brass keyring with enamel Meetup logo. The perfect small gift.',
    icon: '🗝',
    sizes: ['One Size'],
    colors: ['Gold', 'Silver'],
    inStock: true,
  },
  {
    id: 8,
    name: 'Gold Drop Tee',
    category: 'limited',
    price: 55,
    currency: '$',
    badge: 'Sold Out',
    badgeType: 'sold-out',
    description: 'The original gold foil Meetup tee. Sold out — join waitlist.',
    icon: '⭐',
    sizes: ['S', 'M', 'L'],
    colors: ['Black'],
    inStock: false,
  },
];

// ── STATE ──
let cart = [];
let activeFilter = 'all';
let selectedVariants = {};

// ── RENDER PRODUCTS ──
function renderProducts(filter = 'all') {
  const grid = document.getElementById('product-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const filtered = filter === 'all' ? PRODUCTS : PRODUCTS.filter(p => p.category === filter);
  filtered.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = product.id;
    card.dataset.category = product.category;

    const badgeHtml = product.badge
      ? `<div class="product-badge ${product.badgeType || ''}">${product.badge}</div>` : '';

    card.innerHTML = `
      <div class="product-img">
        <div class="product-placeholder">${product.icon}</div>
        ${badgeHtml}
      </div>
      <div class="product-info">
        <div class="product-cat">${product.category}</div>
        <div class="product-name">${product.name}</div>
        <div class="product-desc">${product.description.substring(0,70)}...</div>
        <div class="product-footer">
          <div class="product-price">${product.currency}${product.price}</div>
          <button class="product-add ${!product.inStock ? 'sold-out-btn' : ''}"
            data-id="${product.id}"
            title="${product.inStock ? 'Quick add' : 'Sold out'}"
            ${!product.inStock ? 'disabled' : ''}>
            ${product.inStock ? '+' : '—'}
          </button>
        </div>
      </div>
    `;

    card.querySelector('.product-img').addEventListener('click', () => openModal(product));
    card.querySelector('.product-name').addEventListener('click', () => openModal(product));

    const addBtn = card.querySelector('.product-add');
    if (product.inStock) {
      addBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        addToCart(product, product.sizes[0], product.colors[0]);
        btnPulse(addBtn);
      });
    }
    grid.appendChild(card);
  });
}

// ── FILTER ──
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeFilter = btn.dataset.filter;
    renderProducts(activeFilter);
  });
});

// ── MODAL ──
function openModal(product) {
  const modal = document.getElementById('modal-overlay');
  const content = document.getElementById('modal-content');
  if (!modal || !content) return;

  selectedVariants[product.id] = { size: product.sizes[0], color: product.colors[0] };

  const sizeBtns = product.sizes.map((s, i) =>
    `<button class="variant-btn ${i === 0 ? 'selected' : ''}" data-type="size" data-val="${s}">${s}</button>`
  ).join('');
  const colorBtns = product.colors.map((c, i) =>
    `<button class="variant-btn ${i === 0 ? 'selected' : ''}" data-type="color" data-val="${c}">${c}</button>`
  ).join('');

  const badgeHtml = product.badge ? `<div class="product-badge ${product.badgeType || ''}" style="position:relative;top:auto;left:auto;display:inline-block;margin-bottom:1rem;">${product.badge}</div>` : '';

  content.innerHTML = `
    <div class="modal-img">${product.icon}</div>
    <div class="modal-info">
      ${badgeHtml}
      <div class="modal-cat">${product.category}</div>
      <div class="modal-name">${product.name}</div>
      <div class="modal-price">${product.currency}${product.price}</div>
      <div class="modal-desc">${product.description}</div>
      ${product.sizes.length > 1 ? `
      <div class="variant-group">
        <div class="variant-label">Size</div>
        <div class="variant-options" id="size-opts">${sizeBtns}</div>
      </div>` : ''}
      ${product.colors.length > 1 ? `
      <div class="variant-group">
        <div class="variant-label">Color</div>
        <div class="variant-options" id="color-opts">${colorBtns}</div>
      </div>` : ''}
      ${product.inStock
        ? `<button class="btn-gold full" id="modal-add-btn" style="margin-top:1rem">Add to Cart — ${product.currency}${product.price}</button>`
        : `<button class="btn-gold full" style="margin-top:1rem;background:#ccc;cursor:not-allowed" disabled>Sold Out</button>`
      }
    </div>
  `;

  // Variant selection
  content.querySelectorAll('.variant-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const type = btn.dataset.type;
      content.querySelectorAll(`[data-type="${type}"]`).forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedVariants[product.id][type] = btn.dataset.val;
    });
  });

  // Add to cart from modal
  const addBtn = content.querySelector('#modal-add-btn');
  if (addBtn) {
    addBtn.addEventListener('click', () => {
      const v = selectedVariants[product.id];
      addToCart(product, v.size, v.color);
      closeModal();
      openCart();
    });
  }

  modal.style.display = 'flex';
  setTimeout(() => modal.classList.add('open'), 10);
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  const modal = document.getElementById('modal-overlay');
  if (modal) {
    modal.classList.remove('open');
    setTimeout(() => { modal.style.display = 'none'; }, 300);
  }
  document.body.style.overflow = '';
}
document.getElementById('modal-close')?.addEventListener('click', closeModal);
document.getElementById('modal-overlay')?.addEventListener('click', e => {
  if (e.target === e.currentTarget) closeModal();
});

// ── CART ──
function addToCart(product, size, color) {
  const key = `${product.id}-${size}-${color}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ key, product, size, color, qty: 1 });
  }
  updateCartUI();
}

function removeFromCart(key) {
  cart = cart.filter(i => i.key !== key);
  updateCartUI();
}

function updateQty(key, delta) {
  const item = cart.find(i => i.key === key);
  if (!item) return;
  item.qty = Math.max(0, item.qty + delta);
  if (item.qty === 0) removeFromCart(key);
  else updateCartUI();
}

function updateCartUI() {
  const count = cart.reduce((sum, i) => sum + i.qty, 0);
  const total = cart.reduce((sum, i) => sum + i.qty * i.product.price, 0);

  document.getElementById('cart-count').textContent = count;
  document.getElementById('cart-total-val').textContent = `$${total}`;

  const cartItemsEl = document.getElementById('cart-items');
  const cartFooter = document.getElementById('cart-footer');

  if (cart.length === 0) {
    cartItemsEl.innerHTML = '<div class="cart-empty">Your cart is empty</div>';
    if (cartFooter) cartFooter.style.display = 'none';
    return;
  }
  if (cartFooter) cartFooter.style.display = 'block';

  cartItemsEl.innerHTML = cart.map(item => `
    <div class="cart-item">
      <div class="ci-thumb">${item.product.icon}</div>
      <div class="ci-info">
        <div class="ci-name">${item.product.name}</div>
        <div class="ci-variant">${item.size} · ${item.color}</div>
        <div class="ci-price">${item.product.currency}${(item.product.price * item.qty).toFixed(2)}</div>
        <div class="ci-qty">
          <button onclick="updateQty('${item.key}', -1)">−</button>
          <span>${item.qty}</span>
          <button onclick="updateQty('${item.key}', 1)">+</button>
        </div>
      </div>
      <button class="ci-remove" onclick="removeFromCart('${item.key}')">✕</button>
    </div>
  `).join('');
}

function openCart() {
  document.getElementById('cart-sidebar')?.classList.add('open');
  document.getElementById('cart-overlay')?.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeCart() {
  document.getElementById('cart-sidebar')?.classList.remove('open');
  document.getElementById('cart-overlay')?.classList.remove('open');
  document.body.style.overflow = '';
}

document.getElementById('cart-fab')?.addEventListener('click', openCart);
document.getElementById('cart-close')?.addEventListener('click', closeCart);
document.getElementById('cart-overlay')?.addEventListener('click', closeCart);

// ── CHECKOUT ──
document.getElementById('checkout-btn')?.addEventListener('click', () => {
  closeCart();
  // Populate order summary
  const summary = cart.map(i => `${i.product.name} (${i.size}, ${i.color}) x${i.qty} = $${(i.product.price * i.qty)}`).join('\n');
  const total = cart.reduce((sum, i) => sum + i.qty * i.product.price, 0);
  const summaryField = document.getElementById('order-summary-field');
  if (summaryField) summaryField.value = summary + `\n\nTOTAL: $${total}`;

  const overlay = document.getElementById('checkout-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.body.style.overflow = 'hidden';
  }
});

document.getElementById('checkout-close')?.addEventListener('click', () => {
  document.getElementById('checkout-overlay').style.display = 'none';
  document.body.style.overflow = '';
});

// Checkout form submit → Google Sheets
document.getElementById('checkout-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('success-checkout');
  btn.textContent = 'Processing...';
  btn.disabled = true;

  const data = {};
  new FormData(e.target).forEach((v, k) => data[k] = v);
  data.sheet = 'MeetupOrders';
  data.timestamp = new Date().toISOString();
  data.total = `$${cart.reduce((s, i) => s + i.qty * i.product.price, 0)}`;

  try {
    const SCRIPT_URL = window.GOOGLE_SCRIPT_URL;
    if (SCRIPT_URL && SCRIPT_URL !== 'YOUR_GOOGLE_APPS_SCRIPT_URL_HERE') {
      await fetch(SCRIPT_URL, {
        method: 'POST', mode: 'no-cors',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
    }
    if (success) success.style.display = 'block';
    btn.textContent = '✓ Order Placed';
    btn.style.background = '#4caf50';
    cart = [];
    updateCartUI();
    setTimeout(() => {
      document.getElementById('checkout-overlay').style.display = 'none';
      document.body.style.overflow = '';
      e.target.reset();
      btn.textContent = 'Place Order';
      btn.style.background = '';
      btn.disabled = false;
      if (success) success.style.display = 'none';
    }, 5000);
  } catch (err) {
    btn.textContent = 'Error — Try Again';
    btn.style.background = '#e53935';
    btn.disabled = false;
  }
});

// ── UTILS ──
function btnPulse(btn) {
  btn.style.transform = 'scale(1.3)';
  btn.style.background = '#4caf50';
  setTimeout(() => {
    btn.style.transform = '';
    btn.style.background = '';
  }, 400);
}

// ── INIT ──
renderProducts('all');
