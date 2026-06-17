/*
 * HaOye Homepage Logic
 * Handles countdown, swiper, trending products tabs, and simulated voice search
 */

$(document).ready(function () {
  
  // 1. Initialize Swiper hero slider
  const heroSwiper = new Swiper('.hero-slider', {
    loop: true,
    autoplay: {
      delay: 5000,
      disableOnInteraction: false,
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    effect: 'fade',
    fadeEffect: {
      crossFade: true
    }
  });

  // 2. Flash Sale Countdown Timer
  // Set end date to 5 hours from now dynamically
  let countdownTime = 5 * 3600 + 42 * 60 + 18; // 5h 42m 18s in seconds
  
  const timerInterval = setInterval(function () {
    if (countdownTime <= 0) {
      clearInterval(timerInterval);
      $('.countdown-box').html('<span class="text-danger fw-bold">SALE ENDED!</span>');
      return;
    }

    countdownTime--;
    
    const h = Math.floor(countdownTime / 3600);
    const m = Math.floor((countdownTime % 3600) / 60);
    const s = countdownTime % 60;

    $('.timer-hours').text(String(h).padStart(2, '0'));
    $('.timer-minutes').text(String(m).padStart(2, '0'));
    $('.timer-seconds').text(String(s).padStart(2, '0'));
  }, 1000);

  // 3. Render Flash Sale Products (subset of catalog)
  renderFlashSales();

  // 4. Render Trending Products with category pills
  renderTrending('all');

  $('#trendingTabs button').on('click', function () {
    $('#trendingTabs button').removeClass('active');
    $(this).addClass('active');
    const cat = $(this).data('category');
    renderTrending(cat);
  });

  // 5. Brand Card Clicks
  $('.brand-card').on('click', function () {
    const brand = $(this).data('brand');
    window.location.href = `category.html?brand=${brand}`;
  });

  // 6. City Location Selector
  const savedCity = localStorage.getItem('haoye_city');
  if (savedCity) {
    $('.location-name').text(savedCity);
    $(`.location-btn[data-city="${savedCity}"]`).addClass('btn-peach text-white').removeClass('btn-outline-secondary');
  }

  $('.location-btn').on('click', function () {
    const city = $(this).data('city');
    localStorage.setItem('haoye_city', city);
    $('.location-name').text(city);
    $('.location-btn').removeClass('btn-peach text-white').addClass('btn-outline-secondary');
    $(this).addClass('btn-peach text-white').removeClass('btn-outline-secondary');
    $('#locationModal').modal('hide');
  });

  // 7. Simulated Voice Search System (Crazier effect!)
  let voiceTimeout1, voiceTimeout2;
  
  $('.voice-trigger-btn').on('click', function (e) {
    e.preventDefault();
    $('.voice-overlay').css('display', 'flex').hide().fadeIn(250);
    $('.voice-transcript').text('Listening...');
    
    // Step 1: Simulate user speaking after 1.5 seconds
    voiceTimeout1 = setTimeout(function () {
      $('.voice-transcript').text('Thinking: "iPhone 15 Pro Max"...');
    }, 1500);

    // Step 2: Show redirecting after 3 seconds
    voiceTimeout2 = setTimeout(function () {
      $('.voice-transcript').text('Searching for "iPhone 15 Pro Max"...');
      setTimeout(function () {
        window.location.href = 'category.html?search=iphone';
      }, 800);
    }, 3200);
  });

  $('.voice-close-btn').on('click', function () {
    clearTimeout(voiceTimeout1);
    clearTimeout(voiceTimeout2);
    $('.voice-overlay').fadeOut(250);
  });

});

function renderFlashSales() {
  // Take first 4 items for flash sales
  const flashProducts = GLOBAL_CATALOG.slice(0, 4);
  const $grid = $('#flash-products-grid');
  let html = '';

  flashProducts.forEach(p => {
    // Generate comparison checkbox status
    const isChecked = compareList.some(item => item.id === p.id) ? 'checked' : '';
    
    html += `
      <div class="col-lg-3 col-md-6 col-sm-12">
        <div class="product-card">
          <span class="discount-tag">${p.discount}</span>
          
          <label class="compare-checkbox-label">
            <input type="checkbox" value="${p.id}" class="compare-checkbox" ${isChecked}> Compare
          </label>
          
          <div class="product-img-wrapper">
            <a href="product.html?id=${p.id}">
              <img src="${p.image}" alt="${p.name}">
            </a>
          </div>
          
          <div class="product-brand">${p.brand}</div>
          <a href="product.html?id=${p.id}" class="text-decoration-none text-dark">
            <h5 class="product-title">${p.name}</h5>
          </a>
          
          <div class="product-rating">
            <i class="fa-solid fa-star"></i> ${p.rating} (${p.reviewsCount})
          </div>
          
          <div class="price-row">
            <span class="current-price">Rs. ${p.price.toLocaleString()}</span>
            <span class="original-price">Rs. ${p.originalPrice.toLocaleString()}</span>
          </div>

          <div class="inventory-bar">
            <div class="inventory-bar-fill" style="width: ${p.stockProgress}%"></div>
          </div>
          <div class="d-flex justify-content-between align-items-center">
            <span class="inventory-text">Only ${p.inStock} Left in Stock</span>
            <span class="inventory-text fw-bold text-dark">${p.stockProgress}% Sold</span>
          </div>
          
          <button class="card-action-btn add-to-cart-trigger" data-id="${p.id}">
            <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
          </button>
        </div>
      </div>
    `;
  });

  $grid.html(html);
}

function renderTrending(category) {
  const $grid = $('#trending-products-grid');
  
  // Filter products by category
  let filtered = GLOBAL_CATALOG;
  if (category !== 'all') {
    filtered = GLOBAL_CATALOG.filter(p => p.category === category);
  }

  // Fade out current grid contents
  $grid.fadeOut(150, function () {
    let html = '';
    
    filtered.forEach(p => {
      const isChecked = compareList.some(item => item.id === p.id) ? 'checked' : '';
      
      html += `
        <div class="col-lg-3 col-md-6 col-sm-12">
          <div class="product-card">
            <span class="discount-tag">${p.discount}</span>
            
            <label class="compare-checkbox-label">
              <input type="checkbox" value="${p.id}" class="compare-checkbox" ${isChecked}> Compare
            </label>
            
            <div class="product-img-wrapper">
              <a href="product.html?id=${p.id}">
                <img src="${p.image}" alt="${p.name}">
              </a>
            </div>
            
            <div class="product-brand">${p.brand}</div>
            <a href="product.html?id=${p.id}" class="text-decoration-none text-dark">
              <h5 class="product-title">${p.name}</h5>
            </a>
            
            <div class="product-rating">
              <i class="fa-solid fa-star"></i> ${p.rating} (${p.reviewsCount})
            </div>
            
            <div class="price-row">
              <span class="current-price">Rs. ${p.price.toLocaleString()}</span>
              <span class="original-price">Rs. ${p.originalPrice.toLocaleString()}</span>
            </div>
            
            <button class="card-action-btn add-to-cart-trigger" data-id="${p.id}">
              <i class="fa-solid fa-cart-plus me-1"></i> Add to Cart
            </button>
          </div>
        </div>
      `;
    });

    $grid.html(html).fadeIn(200);
  });
}
