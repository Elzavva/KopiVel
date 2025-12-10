// ===========================
// DATA PRODUK KOPI
// ===========================

const coffeeMenu = [
    {
        id: 1,
        name: 'Espresso Arabika',
        price: 25000,
        description: 'Kopi arabika murni dengan cita rasa kaya dan aromatis',
        image: 'assets/espresso.jpg'
    },
    {
        id: 2,
        name: 'Cappuccino Latte',
        price: 35000,
        description: 'Perpaduan sempurna espresso dan susu premium',
        image: 'assets/cappuccino.jpg'
    },
    {
        id: 3,
        name: 'Americano Black',
        price: 30000,
        description: 'Kopi hitam pekat dengan karakter yang kuat',
        image: 'assets/americano.jpg'
    },
    {
        id: 4,
        name: 'Macchiato Crema',
        price: 32000,
        description: 'Espresso dengan sentuhan susu foam yang lembut',
        image: 'assets/macchiato.jpg'
    },
    {
        id: 5,
        name: 'Mocha Chocolate',
        price: 40000,
        description: 'Kombinasi kopi dan coklat yang memanjakan lidah',
        image: 'assets/mocha.jpg'
    },
    {
        id: 6,
        name: 'Flat White Premium',
        price: 38000,
        description: 'Espresso dengan microfoam susu yang halus dan creamy',
        image: 'assets/flatwhite.jpg'
    },
    {
        id: 7,
        name: 'Affogato Gelato',
        price: 42000,
        description: 'Espresso panas diatas es krim vanilla premium',
        image: 'assets/affogato.jpg'
    },
    {
        id: 8,
        name: 'Cold Brew Robusta',
        price: 28000,
        description: 'Kopi robusta yang diseduh dingin, segar dan nikmat',
        image: 'assets/coldbrew.jpg'
    }
];

// ===========================
// STATE MANAGEMENT
// ===========================

let currentUser = null;
let cart = [];

// ===========================
// UTILITY FUNCTIONS
// ===========================

function formatCurrency(amount) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0
    }).format(amount);
}

function showPage(pageId) {
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => page.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.add('active');
    }
}

function navigateTo(page) {
    if (!currentUser && page !== 'login') {
        showPage('loginPage');
        return;
    }

    switch(page) {
        case 'home':
            showPage('homePage');
            break;
        case 'philosophy':
            showPage('philosophyPage');
            break;
        case 'menu':
            showPage('menuPage');
            renderMenu();
            break;
        case 'cart':
            showPage('cartPage');
            renderCart();
            break;
        case 'login':
            showPage('loginPage');
            break;
        default:
            showPage('homePage');
    }
}

// ===========================
// AUTHENTICATION
// ===========================

function handleLogin(event) {
    event.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    // Reset error messages
    document.getElementById('usernameError').textContent = '';
    document.getElementById('passwordError').textContent = '';

    // Validasi input
    let isValid = true;

    if (!username) {
        document.getElementById('usernameError').textContent = 'Email atau username harus diisi';
        isValid = false;
    }

    if (!password) {
        document.getElementById('passwordError').textContent = 'Password harus diisi';
        isValid = false;
    }

    if (password.length < 6) {
        document.getElementById('passwordError').textContent = 'Password minimal 6 karakter';
        isValid = false;
    }

    if (!isValid) {
        return;
    }

    // Ambil data user dari localStorage
    let users = JSON.parse(localStorage.getItem('kopivel_users') || '[]');
    // Cari user yang cocok
    const foundUser = users.find(u => (u.email === username || u.username === username) && u.password === password);

    // Validasi login demo
    if ((username === 'user' || username === 'user@kopivel.com') && password === '123456') {
        currentUser = { username: username };
        localStorage.setItem('kopivel_login', JSON.stringify({ username, password }));
        loginSuccess();
    } else if (foundUser) {
        currentUser = { username: foundUser.username, email: foundUser.email };
        localStorage.setItem('kopivel_login', JSON.stringify({ username: foundUser.username, password }));
        loginSuccess();
    } else {
        showNotification('Gagal', 'Username/email atau password salah.');
    }
}

// Isi otomatis form login jika sudah pernah login
function autofillLogin() {
    const saved = localStorage.getItem('kopivel_login');
    if (saved) {
        try {
            const { username, password } = JSON.parse(saved);
            document.getElementById('username').value = username || '';
            document.getElementById('password').value = password || '';
        } catch {}
    }
}

function loginSuccess() {
    // Tampilkan navbar
    document.getElementById('navbar').style.display = 'block';
    
    // Reset form
    document.getElementById('loginForm').reset();
    
    // Arahkan ke home page
    navigateTo('home');
    
    // Show welcome message
    showNotification('Sukses', `Selamat datang, ${currentUser.username}!`);
}

function logout() {
    if (confirm('Apakah Anda yakin ingin keluar?')) {
        currentUser = null;
        cart = [];
        document.getElementById('navbar').style.display = 'none';
        document.getElementById('loginForm').reset();
        updateCartCount();
        showPage('loginPage');
        showNotification('Sukses', 'Anda telah berhasil keluar');
    }
}

function handleRegister(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value.trim();
    const username = document.getElementById('regUsername').value.trim();
    const password = document.getElementById('regPassword').value;
    document.getElementById('regEmailError').textContent = '';
    document.getElementById('regUsernameError').textContent = '';
    document.getElementById('regPasswordError').textContent = '';
    let isValid = true;
    if (!email) {
        document.getElementById('regEmailError').textContent = 'Email harus diisi';
        isValid = false;
    }
    if (!username) {
        document.getElementById('regUsernameError').textContent = 'Username harus diisi';
        isValid = false;
    }
    if (!password || password.length < 6) {
        document.getElementById('regPasswordError').textContent = 'Password minimal 6 karakter';
        isValid = false;
    }
    // Ambil data user dari localStorage
    let users = JSON.parse(localStorage.getItem('kopivel_users') || '[]');
    if (users.find(u => u.email === email)) {
        document.getElementById('regEmailError').textContent = 'Email sudah terdaftar';
        isValid = false;
    }
    if (users.find(u => u.username === username)) {
        document.getElementById('regUsernameError').textContent = 'Username sudah terdaftar';
        isValid = false;
    }
    if (!isValid) return;
    // Simpan user baru
    users.push({ email, username, password });
    localStorage.setItem('kopivel_users', JSON.stringify(users));
    document.getElementById('registerForm').reset();
    // Sembunyikan login, tampilkan sukses
    document.getElementById('loginPage').style.display = 'none';
    showPage('registerSuccessPage');
}

// ===========================
// MENU RENDERING
// ===========================

function renderMenu() {
    const menuContainer = document.getElementById('menuContainer');
    menuContainer.innerHTML = '';

    coffeeMenu.forEach(coffee => {
        const card = document.createElement('div');
        card.className = 'menu-card';
        card.innerHTML = `
            <div class="menu-card-header">
                <img src="${coffee.image}" alt="${coffee.name}" class="menu-img" />
                <h3>${coffee.name}</h3>
                <div class="price">${formatCurrency(coffee.price)}</div>
            </div>
            <div class="menu-card-body">
                <p class="menu-description">${coffee.description}</p>
                <div class="quantity-selector">
                    <button class="quantity-btn" onclick="decreaseQuantity(${coffee.id})">−</button>
                    <div class="quantity-display" id="qty-${coffee.id}">0</div>
                    <button class="quantity-btn" onclick="increaseQuantity(${coffee.id})">+</button>
                </div>
                <button class="add-to-cart-btn" onclick="addToCart(${coffee.id})">Tambah ke Keranjang</button>
            </div>
        `;
        menuContainer.appendChild(card);
    });
}

let quantities = {};

function increaseQuantity(coffeeId) {
    quantities[coffeeId] = (quantities[coffeeId] || 0) + 1;
    updateQuantityDisplay(coffeeId);
}

function decreaseQuantity(coffeeId) {
    if ((quantities[coffeeId] || 0) > 0) {
        quantities[coffeeId]--;
        updateQuantityDisplay(coffeeId);
    }
}

function updateQuantityDisplay(coffeeId) {
    document.getElementById(`qty-${coffeeId}`).textContent = quantities[coffeeId] || 0;
}

function addToCart(coffeeId) {
    const quantity = quantities[coffeeId] || 0;

    if (quantity === 0) {
        showNotification('Perhatian', 'Silakan pilih jumlah terlebih dahulu');
        return;
    }

    const coffee = coffeeMenu.find(c => c.id === coffeeId);
    
    // Cek apakah item sudah ada di cart
    const existingItem = cart.find(item => item.id === coffeeId);

    if (existingItem) {
        existingItem.quantity += quantity;
    } else {
        cart.push({
            id: coffee.id,
            name: coffee.name,
            price: coffee.price,
            quantity: quantity,
            icon: coffee.icon
        });
    }

    // Reset quantity display
    quantities[coffeeId] = 0;
    updateQuantityDisplay(coffeeId);

    updateCartCount();
    showNotification('Sukses', `${quantity} ${coffee.name} ditambahkan ke keranjang`);
}

// ===========================
// CART MANAGEMENT
// ===========================

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cartCount');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function renderCart() {
    const cartContainer = document.getElementById('cartItemsContainer');
    const emptyMessage = document.getElementById('emptyCartMessage');

    if (cart.length === 0) {
        cartContainer.innerHTML = '';
        emptyMessage.style.display = 'block';
        document.querySelector('.btn-checkout').disabled = true;
        updateCartTotals();
        return;
    }

    emptyMessage.style.display = 'none';
    document.querySelector('.btn-checkout').disabled = false;

    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <h3>${item.icon} ${item.name}</h3>
                <div class="cart-item-details">Harga: ${formatCurrency(item.price)}</div>
                <div class="cart-item-details">Jumlah: <strong>${item.quantity}</strong></div>
                <div class="cart-item-price">${formatCurrency(itemTotal)}</div>
            </div>
            <div class="cart-item-actions">
                <button class="remove-btn" onclick="removeFromCart(${item.id})">Hapus</button>
            </div>
        `;
        cartContainer.appendChild(cartItem);
    });

    updateCartTotals();
}

function removeFromCart(coffeeId) {
    const itemIndex = cart.findIndex(item => item.id === coffeeId);
    if (itemIndex > -1) {
        const item = cart[itemIndex];
        cart.splice(itemIndex, 1);
        updateCartCount();
        renderCart();
        showNotification('Sukses', `${item.name} dihapus dari keranjang`);
    }
}

function updateCartTotals() {
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1);
    const total = subtotal + tax;

    document.getElementById('subtotal').textContent = formatCurrency(subtotal);
    document.getElementById('tax').textContent = formatCurrency(tax);
    document.getElementById('total').textContent = formatCurrency(total);
}

// ===========================
// CHECKOUT & PAYMENT
// ===========================

function checkout() {
    if (cart.length === 0) {
        showNotification('Perhatian', 'Keranjang Anda kosong');
        return;
    }

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(total * 0.1);
    const finalTotal = total + tax;

    document.getElementById('modalTotal').textContent = formatCurrency(finalTotal);
    
    const modal = document.getElementById('paymentModal');
    modal.classList.add('active');
}

function completePayment() {
    closePaymentModal();
    // Simpan data nota
    const itemCount = cart.length;
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const tax = Math.round(subtotal * 0.1);
    const finalTotal = subtotal + tax;
    const user = currentUser || {};
    // Tampilkan nota
    showReceipt({
        user,
        items: [...cart],
        subtotal,
        tax,
        total: finalTotal
    });
    // Clear cart
    cart = [];
    quantities = {};
    updateCartCount();
}

function showReceipt({ user, items, subtotal, tax, total }) {
    let html = `<div style='text-align:left;'>`;
    html += `<p><strong>Nama:</strong> ${user.username || '-'}</p>`;
    html += `<p><strong>Tanggal:</strong> ${new Date().toLocaleString('id-ID')}</p>`;
    html += `<hr>`;
    html += `<h3>Detail Pesanan:</h3>`;
    html += `<ul style='margin-bottom:1rem;'>`;
    items.forEach(item => {
        html += `<li>${item.name} x ${item.quantity} = <strong>${formatCurrency(item.price * item.quantity)}</strong></li>`;
    });
    html += `</ul>`;
    html += `<p>Subtotal: <strong>${formatCurrency(subtotal)}</strong></p>`;
    html += `<p>Pajak (10%): <strong>${formatCurrency(tax)}</strong></p>`;
    html += `<p>Total: <strong>${formatCurrency(total)}</strong></p>`;
    html += `</div>`;
    document.getElementById('receiptContent').innerHTML = html;
    document.getElementById('receiptModal').classList.add('active');
}

function closeReceiptModal() {
    document.getElementById('receiptModal').classList.remove('active');
    navigateTo('home');
}

function closePaymentModal() {
    document.getElementById('paymentModal').classList.remove('active');
}

function closeNotificationModal() {
    document.getElementById('notificationModal').classList.remove('active');
    navigateTo('home');
}

// ===========================
// NOTIFICATION SYSTEM
// ===========================

function showNotification(title, message) {
    // Simple alert for now, bisa di-replace dengan toast notification
    const notifType = title === 'Sukses' ? 'success' : 'info';
    console.log(`[${notifType.toUpperCase()}] ${title}: ${message}`);
    
    // Optional: Gunakan browser alert jika ingin lebih visible
    if (title === 'Gagal') {
        alert(`${title}: ${message}`);
    }
}

// ===========================
// EVENT LISTENERS
// ===========================

document.addEventListener('DOMContentLoaded', function() {
    // Initialize
    updateCartCount();
    autofillLogin();
    
    // Event klik pada tombol Daftar
    const registerLink = document.querySelector('.register-link');
    if (registerLink) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            showPage('registerPage');
            document.getElementById('loginPage').style.display = 'none';
        });
    }
    
    // Event klik pada tombol Kembali ke Login di halaman sukses
    const backToLoginBtn = document.querySelector('#registerSuccessPage .btn');
    if (backToLoginBtn) {
        backToLoginBtn.addEventListener('click', function() {
            showPage('loginPage');
            document.getElementById('loginPage').style.display = 'block';
        });
    }
    
    // Close modal when clicking outside
    window.onclick = function(event) {
        const paymentModal = document.getElementById('paymentModal');
        const notifModal = document.getElementById('notificationModal');
        
        if (event.target === paymentModal) {
            closePaymentModal();
        }
        if (event.target === notifModal) {
            closeNotificationModal();
        }
    }

    // Payment method switcher
    const paymentMethodSelect = document.getElementById('paymentMethod');
    if (paymentMethodSelect) {
        paymentMethodSelect.addEventListener('change', function() {
            const qrisSection = document.getElementById('qrisSection');
            const cashSection = document.getElementById('cashSection');
            if (this.value === 'qris') {
                qrisSection.style.display = 'block';
                cashSection.style.display = 'none';
            } else {
                qrisSection.style.display = 'none';
                cashSection.style.display = 'block';
            }
        });
    }
});

// Keyboard shortcuts
document.addEventListener('keydown', function(event) {
    // ESC untuk close modal
    if (event.key === 'Escape') {
        document.getElementById('paymentModal').classList.remove('active');
        document.getElementById('notificationModal').classList.remove('active');
    }
});
