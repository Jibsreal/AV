// Data Services
const services = [
    {id:1, icon:'⚔️', title:'Warrior', desc:'Warrior → Elite', price:4000, unit:'bintang'},
    {id:2, icon:'⭐', title:'Elite', desc:'Elite → Master', price:5000, unit:'bintang'},
    {id:3, icon:'💎', title:'Master', desc:'Master → Grandmaster', price:6000, unit:'bintang'},
    {id:4, icon:'🏅', title:'Grandmaster', desc:'Grandmaster → Epic', price:8000, unit:'bintang'},
    {id:5, icon:'✨', title:'Epic', desc:'Epic → Legend', price:10000, unit:'bintang'},
    {id:6, icon:'👑', title:'Legend', desc:'Legend → Mythic', price:14000, unit:'bintang'},
    {id:7, icon:'🎮', title:'Mythic', desc:'Mythic per bintang', price:20000, unit:'bintang'},
    {id:8, icon:'🏆', title:'Mythic Honor', desc:'Mythic Honor per bintang', price:25000, unit:'bintang'},
    {id:9, icon:'💜', title:'Mythic Glory', desc:'Mythic Glory per bintang', price:30000, unit:'bintang'},
    {id:10, icon:'🔥', title:'Mythic Immortal', desc:'Mythic Immortal per bintang', price:35000, unit:'bintang'},
    {id:11, icon:'🦸', title:'Marvel Rivals', desc:'Per tier naik', price:15000, unit:'tier'},
    {id:12, icon:'🧱', title:'Blox Fruits', desc:'Per level naik', price:2000, unit:'level'},
    {id:13, icon:'🎯', title:'Valorant', desc:'Per rank naik', price:50000, unit:'rank'}
];

// State
let cart = [];
let currentItem = null;
let currentQuantity = 1;
let selectedPayment = null;

// Render Services
document.addEventListener('DOMContentLoaded', () => {
    const grid = document.getElementById('servicesGrid');
    grid.innerHTML = services.map(s => `
        <div class="card" onclick="openModal(${s.id})">
            <div class="card-icon">${s.icon}</div>
            <h3 class="card-title">${s.title}</h3>
            <p class="card-desc">${s.desc}</p>
            <div class="card-price">${formatPrice(s.price)}</div>
            <div class="card-unit">per ${s.unit}</div>
        </div>
    `).join('');
});

// Modal Functions
function openModal(id) {
    currentItem = services.find(s => s.id === id);
    currentQuantity = 1;
    document.getElementById('modalIcon').textContent = currentItem.icon;
    document.getElementById('modalTitle').textContent = currentItem.title;
    document.getElementById('modalDesc').textContent = currentItem.desc;
    document.getElementById('modalQuantity').textContent = currentQuantity;
    document.getElementById('modalTotal').textContent = formatPrice(currentItem.price);
    document.getElementById('itemModal').style.display = 'flex';
}

function closeModal() {
    document.getElementById('itemModal').style.display = 'none';
}

// Cart Functions
function changeQuantity(delta) {
    currentQuantity = Math.max(1, currentQuantity + delta);
    document.getElementById('modalQuantity').textContent = currentQuantity;
    document.getElementById('modalTotal').textContent = formatPrice(currentItem.price * currentQuantity);
}

function addToCart() {
    const existing = cart.find(i => i.id === currentItem.id);
    if (existing) {
        existing.quantity += currentQuantity;
    } else {
        cart.push({ ...currentItem, quantity: currentQuantity });
    }
    closeModal();
    updateCart();
    
    // Show success notification
    showNotification(`${currentItem.title} ditambahkan ke keranjang`);
}

function showNotification(message) {
    const notif = document.createElement('div');
    notif.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: #10b981;
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 9999;
        animation: slideIn 0.3s ease;
        box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    `;
    notif.textContent = message;
    document.body.appendChild(notif);
    setTimeout(() => notif.remove(), 3000);
}

function toggleCart() {
    const modal = document.getElementById('cartModal');
    modal.style.display = modal.style.display === 'flex' ? 'none' : 'flex';
}

function updateCart() {
    const items = document.getElementById('cartItems');
    if (cart.length === 0) {
        items.innerHTML = `
            <div class="empty-cart">
                <div class="empty-cart-icon">🛒</div>
                <p>Keranjang masih kosong</p>
            </div>
        `;
    } else {
        items.innerHTML = cart.map(i => `
            <div class="cart-item">
                <div class="cart-item-info">
                    <strong>${i.icon} ${i.title}</strong>
                    <small>${formatPrice(i.price)} × ${i.quantity} ${i.unit}</small>
                </div>
                <div class="cart-actions">
                    <button class="cart-qty-btn" onclick="updateQ(${i.id},-1)">−</button>
                    <span class="cart-qty">${i.quantity}</span>
                    <button class="cart-qty-btn" onclick="updateQ(${i.id},1)">+</button>
                    <button class="remove-btn" onclick="removeI(${i.id})">×</button>
                </div>
            </div>
        `).join('');
    }
    
    document.getElementById('cartTotal').textContent = formatPrice(cart.reduce((s, i) => s + i.price * i.quantity, 0));
    document.getElementById('cartCount').textContent = cart.reduce((s, i) => s + i.quantity, 0);
}

function updateQ(id, d) {
    const item = cart.find(i => i.id === id);
    item.quantity = Math.max(1, item.quantity + d);
    updateCart();
}

function removeI(id) {
    cart = cart.filter(i => i.id !== id);
    updateCart();
}

// Checkout
function checkout() {
    if (!cart.length) return;
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const html = `
        <div class="cart-modal" id="paymentModal" style="display:flex;">
            <div class="cart-content" style="max-width: 420px;">
                <div class="cart-header">
                    <h3>Pilih Pembayaran</h3>
                    <button class="cart-close" onclick="document.getElementById('paymentModal').remove()">×</button>
                </div>
                <div style="margin-bottom: 1.5rem; padding: 1rem; background: #f8fafc; border-radius: 12px; text-align: center;">
                    <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem;">Total Pembayaran</div>
                    <div style="font-size: 1.75rem; font-weight: 800; color: #6366f1;">${formatPrice(total)}</div>
                </div>
                <div style="display: flex; flex-direction: column; gap: 0.75rem; margin-bottom: 1.5rem;">
                    <button class="btn btn-secondary" style="text-align: left; display: flex; align-items: center; gap: 1rem;" onclick="selectP('bca')">
                        <span style="font-size: 1.5rem;">🏦</span>
                        <div>
                            <div style="font-weight: 600;">BCA</div>
                            <div style="font-size: 0.875rem; color: #64748b;">Transfer Bank</div>
                        </div>
                    </button>
                    <button class="btn btn-secondary" style="text-align: left; display: flex; align-items: center; gap: 1rem;" onclick="selectP('dana')">
                        <span style="font-size: 1.5rem;">💙</span>
                        <div>
                            <div style="font-weight: 600;">DANA</div>
                            <div style="font-size: 0.875rem; color: #64748b;">E-Wallet</div>
                        </div>
                    </button>
                    <button class="btn btn-secondary" style="text-align: left; display: flex; align-items: center; gap: 1rem;" onclick="selectP('gopay')">
                        <span style="font-size: 1.5rem;">💚</span>
                        <div>
                            <div style="font-weight: 600;">GoPay</div>
                            <div style="font-size: 0.875rem; color: #64748b;">E-Wallet</div>
                        </div>
                    </button>
                </div>
                <div id="payDet" style="display:none; background: #f0fdf4; border: 2px solid #86efac; padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
                    <div style="font-weight: 600; color: #166534; margin-bottom: 0.5rem;">Transfer ke:</div>
                    <div id="payDetContent" style="font-size: 1.1rem; font-weight: 700; color: #15803d;"></div>
                </div>
                <button class="btn btn-primary" id="payBtn" style="display:none; width: 100%;" onclick="sendWA()">
                    Konfirmasi via WhatsApp
                </button>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', html);
}

function selectP(m) {
    selectedPayment = m;
    const details = {
        bca: '1234567890 a/n AV Joki',
        dana: '081919000164 a/n AV',
        gopay: '081919000164 a/n AV'
    };
    document.getElementById('payDetContent').textContent = details[m];
    document.getElementById('payDet').style.display = 'block';
    document.getElementById('payBtn').style.display = 'block';
}

function sendWA() {
    const total = cart.reduce((s, i) => s + i.price * i.quantity, 0);
    const items = cart.map(i => `• ${i.title} (${i.quantity}x ${i.unit}) = ${formatPrice(i.price * i.quantity)}`).join('%0A');
    const msg = `Halo AV Joki!%0A%0ASaya mau order:%0A%0A${items}%0A%0ATotal: ${formatPrice(total)}%0APembayaran: ${selectedPayment.toUpperCase()}%0A%0ATerima kasih!`;
    window.open(`https://wa.me/6281919000164?text=${msg}`, '_blank');
    document.getElementById('paymentModal').remove();
    cart = [];
    updateCart();
    toggleCart();
}

// Utility
function formatPrice(p) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(p);
}

function toggleMenu() {
    document.getElementById('navbarMenu').classList.toggle('active');
}

// Close modal on outside click
window.onclick = function(e) {
    if (e.target.classList.contains('modal')) {
        e.target.style.display = 'none';
    }
    if (e.target.classList.contains('cart-modal') && e.target.id !== 'paymentModal') {
        e.target.style.display = 'none';
    }
}
