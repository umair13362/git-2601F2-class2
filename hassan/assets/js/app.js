/*
 * HaOye Storefront Global Engine
 * Handles State management (Cart, Comparison), Theme switcher, and search data
 */

// Global product database for high-fidelity interactive simulation
const GLOBAL_CATALOG = [
  {
    id: "iphone-15-pro-max",
    name: "Apple iPhone 15 Pro Max",
    brand: "Apple",
    category: "mobiles",
    price: 435000,
    originalPrice: 475000,
    image: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?auto=format&fit=crop&q=80&w=300",
    rating: 4.9,
    reviewsCount: 142,
    discount: "8% OFF",
    stockProgress: 85,
    inStock: 5,
    specs: {
      "Display": "6.7 inches Super Retina XDR OLED, 120Hz",
      "Processor": "Apple A17 Pro (3nm)",
      "RAM": "8 GB",
      "Storage": "256 GB NVMe",
      "Battery": "4441 mAh",
      "Main Camera": "48 MP + 12 MP + 12 MP Tri-Camera",
      "Front Camera": "12 MP TrueDepth"
    }
  },
  {
    id: "galaxy-s24-ultra",
    name: "Samsung Galaxy S24 Ultra",
    brand: "Samsung",
    category: "mobiles",
    price: 389000,
    originalPrice: 420000,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?auto=format&fit=crop&q=80&w=300",
    rating: 4.8,
    reviewsCount: 98,
    discount: "7% OFF",
    stockProgress: 90,
    inStock: 3,
    specs: {
      "Display": "6.8 inches Dynamic AMOLED 2X, 120Hz",
      "Processor": "Snapdragon 8 Gen 3 for Galaxy",
      "RAM": "12 GB",
      "Storage": "512 GB UFS 4.0",
      "Battery": "5000 mAh, 45W Charging",
      "Main Camera": "200 MP + 50 MP + 12 MP + 10 MP Quad-Camera",
      "Front Camera": "12 MP Selfie Camera"
    }
  },
  {
    id: "xiaomi-14-ultra",
    name: "Xiaomi 14 Ultra",
    brand: "Xiaomi",
    category: "mobiles",
    price: 295000,
    originalPrice: 325000,
    image: "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=300",
    rating: 4.7,
    reviewsCount: 54,
    discount: "9% OFF",
    stockProgress: 75,
    inStock: 8,
    specs: {
      "Display": "6.73 inches LTPO AMOLED, 120Hz, Dolby Vision",
      "Processor": "Snapdragon 8 Gen 3 (4nm)",
      "RAM": "16 GB",
      "Storage": "512 GB UFS 4.0",
      "Battery": "5000 mAh, 90W HyperCharge",
      "Main Camera": "50 MP Quad Leica Professional Lenses",
      "Front Camera": "32 MP Front Camera"
    }
  },
  {
    id: "infinix-note-40-pro",
    name: "Infinix Note 40 Pro",
    brand: "Infinix",
    category: "mobiles",
    price: 69999,
    originalPrice: 79999,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300",
    rating: 4.5,
    reviewsCount: 120,
    discount: "13% OFF",
    stockProgress: 60,
    inStock: 12,
    specs: {
      "Display": "6.78 inches AMOLED 3D Curved, 120Hz",
      "Processor": "MediaTek Helio G99 Ultimate",
      "RAM": "8 GB (+ 8 GB Extended)",
      "Storage": "256 GB UFS 2.2",
      "Battery": "5000 mAh, 70W Multi-Charge + MagCharge",
      "Main Camera": "108 MP OIS Quad-Flash Camera",
      "Front Camera": "32 MP Dual-Flash Camera"
    }
  },
  {
    id: "redmi-note-13-pro",
    name: "Xiaomi Redmi Note 13 Pro",
    brand: "Xiaomi",
    category: "mobiles",
    price: 74999,
    originalPrice: 85000,
    image: "https://images.unsplash.com/photo-1565630916779-e303be97b6f5?auto=format&fit=crop&q=80&w=300",
    rating: 4.6,
    reviewsCount: 165,
    discount: "12% OFF",
    stockProgress: 88,
    inStock: 4,
    specs: {
      "Display": "6.67 inches CrystalRes AMOLED, 120Hz",
      "Processor": "MediaTek Helio G99 Ultra",
      "RAM": "8 GB",
      "Storage": "256 GB",
      "Battery": "5000 mAh, 67W Turbo Charge",
      "Main Camera": "200 MP Ultra-Clear OIS Camera",
      "Front Camera": "16 MP Camera"
    }
  },
  {
    id: "watch-series-9",
    name: "Apple Watch Series 9 GPS",
    brand: "Apple",
    category: "watches",
    price: 115000,
    originalPrice: 130000,
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=300",
    rating: 4.8,
    reviewsCount: 38,
    discount: "11% OFF",
    stockProgress: 45,
    inStock: 7,
    specs: {
      "Display": "Always-On Retina LTPO OLED, 2000 nits",
      "Processor": "Apple S9 SiP, Dual Core",
      "RAM": "N/A",
      "Storage": "64 GB",
      "Battery": "Up to 18 hours (36 hours low-power)",
      "Main Camera": "ECG, Temperature Sensor, SpO2 tracker",
      "Front Camera": "Blood Oxygen monitoring"
    }
  },
  {
    id: "galaxy-watch-6",
    name: "Samsung Galaxy Watch 6 Classic",
    brand: "Samsung",
    category: "watches",
    price: 68000,
    originalPrice: 75000,
    image: "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?auto=format&fit=crop&q=80&w=300",
    rating: 4.7,
    reviewsCount: 47,
    discount: "9% OFF",
    stockProgress: 52,
    inStock: 9,
    specs: {
      "Display": "1.5 inches Super AMOLED, Rotating Bezel",
      "Processor": "Exynos W930 Dual-Core 1.4GHz",
      "RAM": "2 GB",
      "Storage": "16 GB",
      "Battery": "425 mAh, 40 hours runtime",
      "Main Camera": "BioActive Sensor, Sleep Analysis, ECG",
      "Front Camera": "N/A"
    }
  },
  {
    id: "redmi-watch-4",
    name: "Redmi Watch 4 Active",
    brand: "Xiaomi",
    category: "watches",
    price: 14500,
    originalPrice: 18000,
    image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?auto=format&fit=crop&q=80&w=300",
    rating: 4.4,
    reviewsCount: 78,
    discount: "19% OFF",
    stockProgress: 92,
    inStock: 2,
    specs: {
      "Display": "1.97 inches LTPS AMOLED, 60Hz",
      "Processor": "Proprietary",
      "RAM": "N/A",
      "Storage": "N/A",
      "Battery": "470 mAh, Up to 20 days battery life",
      "Main Camera": "Hear-Rate, SpO2, Sleep tracking, Bluetooth Calls",
      "Front Camera": "N/A"
    }
  },
  {
    id: "airpods-pro-2",
    name: "Apple AirPods Pro (2nd Generation)",
    brand: "Apple",
    category: "earbuds",
    price: 68500,
    originalPrice: 75000,
    image: "https://images.unsplash.com/photo-1588449668338-d134ae7f3630?auto=format&fit=crop&q=80&w=300",
    rating: 4.9,
    reviewsCount: 204,
    discount: "9% OFF",
    stockProgress: 95,
    inStock: 1,
    specs: {
      "Audio": "Custom Apple Driver, H2 Headphone Chip",
      "Connectivity": "Bluetooth 5.3",
      "Noise Control": "Adaptive Active Noise Cancellation (ANC)",
      "Battery": "Up to 6 hours (30 hours with case)",
      "Charging": "MagSafe Case (USB-C/Lightning)"
    }
  },
  {
    id: "redmi-buds-5",
    name: "Redmi Buds 5 Pro Wireless Earbuds",
    brand: "Xiaomi",
    category: "earbuds",
    price: 13500,
    originalPrice: 16500,
    image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?auto=format&fit=crop&q=80&w=300",
    rating: 4.6,
    reviewsCount: 115,
    discount: "18% OFF",
    stockProgress: 82,
    inStock: 11,
    specs: {
      "Audio": "Dual Coaxial Drivers, Hi-Res Wireless",
      "Connectivity": "Bluetooth 5.3",
      "Noise Control": "52dB Active Noise Cancellation",
      "Battery": "Up to 10 hours (38 hours with case)",
      "Charging": "Type-C Fast Charge (2 hours from 5 mins)"
    }
  },
  {
    id: "soundcore-r50i",
    name: "Anker Soundcore R50i Earbuds",
    brand: "Anker",
    category: "earbuds",
    price: 5200,
    originalPrice: 6500,
    image: "https://images.unsplash.com/photo-1608156639585-b3a032ef9689?auto=format&fit=crop&q=80&w=300",
    rating: 4.5,
    reviewsCount: 340,
    discount: "20% OFF",
    stockProgress: 78,
    inStock: 25,
    specs: {
      "Audio": "10mm Extra-Bass Drivers",
      "Connectivity": "Bluetooth 5.3, Soundcore App Support",
      "Noise Control": "Dual-Mic AI Environmental Noise Cancel",
      "Battery": "Up to 10 hours (30 hours with case)",
      "Charging": "Type-C USB Charging"
    }
  }
];

// App State (Cart and Compare)
let cart = JSON.parse(localStorage.getItem('haoye_cart')) || [];
let compareList = JSON.parse(localStorage.getItem('haoye_compare')) || [];

$(document).ready(function () {
  // Initialize Theme (Dark/Light)
  const savedTheme = localStorage.getItem('haoye_theme') || 'light';
  setTheme(savedTheme);
  
  // Theme toggle button click
  $(document).on('click', '.theme-toggle-btn', function () {
    const currentTheme = $('html').attr('data-theme') || 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  });

  // Global cart updates
  updateCartUI();

  // Sliding Cart Drawer events
  $(document).on('click', '.cart-trigger', function (e) {
    e.preventDefault();
    openCartDrawer();
  });

  $(document).on('click', '.close-cart, .cart-drawer-backdrop', function () {
    closeCartDrawer();
  });

  // Quantity controls in Cart Drawer
  $(document).on('click', '.cart-qty-btn', function () {
    const id = $(this).data('id');
    const action = $(this).data('action');
    const item = cart.find(i => i.id === id);
    if (!item) return;

    if (action === 'plus') {
      item.qty += 1;
    } else if (action === 'minus') {
      item.qty -= 1;
      if (item.qty <= 0) {
        cart = cart.filter(i => i.id !== id);
      }
    }
    saveCart();
    updateCartUI();
  });

  $(document).on('click', '.cart-remove-item', function () {
    const id = $(this).data('id');
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartUI();
  });

  // Compare Checkboxes
  $(document).on('change', '.compare-checkbox', function () {
    const id = $(this).val();
    const isChecked = $(this).is(':checked');
    const product = GLOBAL_CATALOG.find(p => p.id === id);

    if (isChecked) {
      if (compareList.length >= 3) {
        alert("You can only compare up to 3 products at a time!");
        $(this).prop('checked', false);
        return;
      }
      if (!compareList.some(item => item.id === id)) {
        compareList.push(product);
      }
    } else {
      compareList = compareList.filter(item => item.id !== id);
    }

    saveCompare();
    renderCompareBar();
  });

  // Compare tray item remove
  $(document).on('click', '.remove-tray-item', function () {
    const id = $(this).data('id');
    compareList = compareList.filter(item => item.id !== id);
    saveCompare();
    renderCompareBar();
    // Uncheck standard checkbox if on page
    $(`.compare-checkbox[value="${id}"]`).prop('checked', false);
  });

  // Auto-fill compare checkboxes on load
  compareList.forEach(item => {
    $(`.compare-checkbox[value="${item.id}"]`).prop('checked', true);
  });

  // Initialize Compare Bar
  renderCompareBar();

  // Search Autocomplete Engine
  const $searchInput = $('.search-input');
  const $searchSuggestions = $('.search-suggestions');

  $searchInput.on('input', function () {
    const query = $(this).val().toLowerCase().trim();
    if (query.length < 2) {
      $searchSuggestions.fadeOut(150);
      return;
    }

    const matches = GLOBAL_CATALOG.filter(p => 
      p.name.toLowerCase().includes(query) || 
      p.brand.toLowerCase().includes(query) ||
      p.category.toLowerCase().includes(query)
    );

    if (matches.length === 0) {
      $searchSuggestions.html('<div class="p-3 text-center text-muted">No products found</div>').fadeIn(150);
      return;
    }

    let html = '';
    matches.slice(0, 5).forEach(p => {
      html += `
        <a href="product.html?id=${p.id}" class="suggestion-item">
          <img src="${p.image}" alt="${p.name}">
          <div>
            <div class="suggestion-title">${p.name}</div>
            <div class="suggestion-price">Rs. ${p.price.toLocaleString()}</div>
          </div>
        </a>
      `;
    });
    $searchSuggestions.html(html).fadeIn(150);
  });

  // Close suggestions when clicking outside
  $(document).on('click', function (e) {
    if (!$(e.target).closest('.search-container').length) {
      $searchSuggestions.fadeOut(150);
    }
  });

  // Global Add to Cart action handler
  $(document).on('click', '.add-to-cart-trigger', function (e) {
    e.preventDefault();
    const id = $(this).data('id');
    const product = GLOBAL_CATALOG.find(p => p.id === id);
    if (!product) return;

    // Trigger fly-to-cart animation if element clicked is on grid card
    const rect = this.getBoundingClientRect();
    triggerFlyAnimation(this, product.image);

    setTimeout(() => {
      addToCart(product.id, product.name, product.price, product.image, product.brand);
      openCartDrawer();
    }, 800); // Trigger cart update after fly animation
  });
});

/* Helper Functions */

function setTheme(theme) {
  $('html').attr('data-theme', theme);
  localStorage.setItem('haoye_theme', theme);
  const $btnIcon = $('.theme-toggle-btn i');
  if (theme === 'dark') {
    $btnIcon.removeClass('fa-moon').addClass('fa-sun');
  } else {
    $btnIcon.removeClass('fa-sun').addClass('fa-moon');
  }
}

function saveCart() {
  localStorage.setItem('haoye_cart', JSON.stringify(cart));
}

function addToCart(id, name, price, image, brand) {
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1, brand });
  }
  saveCart();
  updateCartUI();
}

function updateCartUI() {
  // Update badge counter
  const totalCount = cart.reduce((total, item) => total + item.qty, 0);
  $('.cart-count-badge').text(totalCount).toggle(totalCount > 0);

  // Render items in Drawer
  const $itemsContainer = $('.cart-drawer-items');
  if (cart.length === 0) {
    $itemsContainer.html(`
      <div class="d-flex flex-column align-items-center justify-content-center h-100 py-5 text-center text-muted">
        <i class="fa-solid fa-cart-shopping mb-3" style="font-size: 3rem; color: var(--border-color)"></i>
        <h5>Your cart is empty</h5>
        <p class="text-xs">Explore our premium catalog to add devices!</p>
      </div>
    `);
    $('.cart-subtotal').text("Rs. 0");
    $('.checkout-btn').addClass('disabled').attr('href', '#');
    return;
  }

  let html = '';
  let subtotal = 0;
  cart.forEach(item => {
    subtotal += item.price * item.qty;
    html += `
      <div class="cart-drawer-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="cart-item-details">
          <div class="cart-item-title text-truncate" style="max-width: 200px;">${item.name}</div>
          <div class="cart-item-price mb-2">Rs. ${item.price.toLocaleString()}</div>
          <div class="cart-qty-control">
            <button class="cart-qty-btn" data-id="${item.id}" data-action="minus"><i class="fa-solid fa-minus"></i></button>
            <div class="cart-qty-val">${item.qty}</div>
            <button class="cart-qty-btn" data-id="${item.id}" data-action="plus"><i class="fa-solid fa-plus"></i></button>
          </div>
        </div>
        <button class="cart-remove-item ms-auto" data-id="${item.id}"><i class="fa-solid fa-trash-can"></i></button>
      </div>
    `;
  });

  $itemsContainer.html(html);
  $('.cart-subtotal').text(`Rs. ${subtotal.toLocaleString()}`);
  $('.checkout-btn').removeClass('disabled').attr('href', 'checkout.html');
}

function openCartDrawer() {
  $('.cart-drawer-backdrop').show().css('opacity', '1');
  $('.cart-drawer').addClass('show');
  $('body').css('overflow', 'hidden');
}

function closeCartDrawer() {
  $('.cart-drawer-backdrop').css('opacity', '0');
  setTimeout(() => $('.cart-drawer-backdrop').hide(), 300);
  $('.cart-drawer').removeClass('show');
  $('body').css('overflow', '');
}

function saveCompare() {
  localStorage.setItem('haoye_compare', JSON.stringify(compareList));
}

function renderCompareBar() {
  const $compareBar = $('.floating-compare-bar');
  if (compareList.length === 0) {
    $compareBar.removeClass('show');
    return;
  }

  const $tray = $('.compare-tray-items');
  let html = '';
  
  // Render up to 3 slots
  for (let i = 0; i < 3; i++) {
    const item = compareList[i];
    if (item) {
      html += `
        <div class="compare-tray-item">
          <img src="${item.image}" alt="${item.name}">
          <button class="remove-tray-item" data-id="${item.id}"><i class="fa-solid fa-xmark"></i></button>
        </div>
      `;
    } else {
      html += `
        <div class="compare-tray-item">
          <i class="fa-solid fa-plus text-muted" style="font-size: 0.8rem"></i>
        </div>
      `;
    }
  }

  $tray.html(html);
  $('.compare-count-text').text(`${compareList.length} of 3 selected`);
  
  if (compareList.length >= 2) {
    $('.compare-btn-action').removeClass('disabled').attr('href', 'compare.html');
  } else {
    $('.compare-btn-action').addClass('disabled').attr('href', '#');
  }

  $compareBar.addClass('show');
}

// Interactive fly-to-cart animation trigger
function triggerFlyAnimation(element, imgPath) {
  const $btn = $(element);
  const btnOffset = $btn.offset();
  
  // Get cart icon in navigation
  const $cartBtn = $('.cart-trigger');
  if (!$cartBtn.length) return;
  const cartOffset = $cartBtn.offset();

  // Create temporary animation flyer
  const $flyer = $('<img class="flying-cart-item" src="' + imgPath + '">');
  $('body').append($flyer);

  // Set initial coordinates
  $flyer.css({
    top: btnOffset.top,
    left: btnOffset.left,
    '--fly-x': (cartOffset.left - btnOffset.left) + 'px',
    '--fly-y': (cartOffset.top - btnOffset.top) + 'px'
  });

  // Listen to animation end
  $flyer.on('animationend', function () {
    $flyer.remove();
    // Add brief scale bounce effect to cart button icon
    $cartBtn.addClass('animate__animated animate__rubberBand');
    setTimeout(() => {
      $cartBtn.removeClass('animate__animated animate__rubberBand');
    }, 800);
  });
}
