/*
 * HaOye Product Details Engine
 * Handles specifications generation, magnifier zoom, seller comparison,
 * Star reviews, Chart.js price trend line graph
 */

$(document).ready(function () {
  
  // 1. Get Product ID from URL
  const params = new URLSearchParams(window.location.search);
  let productId = params.get('id') || 'iphone-15-pro-max';

  // Find product in global catalog
  let product = GLOBAL_CATALOG.find(p => p.id === productId);
  if (!product) {
    product = GLOBAL_CATALOG[0]; // fallback
  }

  // 2. Populate Page Fields
  document.title = `${product.name} - HaOye Storefront`;
  $('#breadcrumb-product-title').text(product.name);
  $('#breadcrumb-cat-link').attr('href', `category.html?cat=${product.category}`).text(product.category.charAt(0).toUpperCase() + product.category.slice(1));
  
  $('#detail-product-title').text(product.name);
  $('#detail-brand-badge').text(product.brand.toUpperCase());
  $('#detail-rating-score').text(product.rating);
  $('#detail-reviews-count').text(`${product.reviewsCount} Verified Buyer Reviews`);
  
  $('#detail-current-price').text(`Rs. ${product.price.toLocaleString()}`);
  $('#detail-original-price').text(`Rs. ${product.originalPrice.toLocaleString()}`);
  $('#detail-discount-tag').text(product.discount);
  
  // Attach product ID to buy buttons
  $('#detail-add-cart-btn').attr('data-id', product.id);
  $('#detail-buy-now-btn').attr('data-id', product.id);

  // Buy Now click triggers instant checkout redirect
  $('#detail-buy-now-btn').on('click', function () {
    const id = $(this).attr('data-id');
    addToCart(id, product.name, product.price, product.image, product.brand);
    window.location.href = 'checkout.html';
  });

  // 3. Render Gallery & Magnifier Zoom
  const galleryImages = [
    product.image,
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=300",
    "https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&q=80&w=300"
  ];

  $('#gallery-main-display').attr('src', product.image);
  
  let thumbsHtml = '';
  galleryImages.forEach((img, idx) => {
    thumbsHtml += `
      <div class="gallery-thumb ${idx === 0 ? 'active' : ''}">
        <img src="${img}" alt="Thumbnail">
      </div>
    `;
  });
  $('#gallery-thumbnails-list').html(thumbsHtml);

  // Thumbnail switcher click
  $('.gallery-thumb').on('click', function () {
    $('.gallery-thumb').removeClass('active');
    $(this).addClass('active');
    const newSrc = $(this).find('img').attr('src');
    $('#gallery-main-display').attr('src', newSrc);
  });

  // Magnifier Zoom Effect
  const $zoomTrigger = $('#gallery-zoom-trigger');
  const $displayImg = $('#gallery-main-display');
  const $lens = $('#zoom-lens');

  $zoomTrigger.on('mousemove', function (e) {
    $lens.show();
    
    // Calculate offsets
    const offset = $(this).offset();
    const x = e.pageX - offset.left;
    const y = e.pageY - offset.top;

    // Center lens over cursor
    let lensLeft = x - $lens.width() / 2;
    let lensTop = y - $lens.height() / 2;

    // Restrict lens to container boundary
    lensLeft = Math.max(0, Math.min(lensLeft, $(this).width() - $lens.width()));
    lensTop = Math.max(0, Math.min(lensTop, $(this).height() - $lens.height()));

    $lens.css({
      left: lensLeft,
      top: lensTop
    });

    // Position background image of lens
    const bgX = (x / $(this).width()) * 100;
    const bgY = (y / $(this).height()) * 100;

    $lens.css({
      backgroundImage: `url('${$displayImg.attr('src')}')`,
      backgroundSize: `${$(this).width() * 2}px ${$(this).height() * 2}px`,
      backgroundPosition: `${bgX}% ${bgY}%`
    });
  });

  $zoomTrigger.on('mouseleave', function () {
    $lens.hide();
  });

  // 4. Render Specifications Accordion
  let specsHtml = '';
  let activeSpecIdx = 0;
  
  // Group specifications into logic tabs
  const specCategories = {
    "Key Specifications": ["Display", "Processor", "RAM", "Storage", "Battery"],
    "Camera": ["Main Camera", "Front Camera"],
    "Connectivity & OS": ["Audio", "Connectivity", "Noise Control", "Charging"]
  };

  for (const [catName, keys] of Object.entries(specCategories)) {
    let hasKeys = false;
    let categoryRows = '';
    
    keys.forEach(k => {
      if (product.specs && product.specs[k]) {
        hasKeys = true;
        categoryRows += `
          <div class="spec-grid-row">
            <div class="spec-name">${k}</div>
            <div class="spec-value">${product.specs[k]}</div>
          </div>
        `;
      }
    });

    if (hasKeys) {
      specsHtml += `
        <div class="accordion-item">
          <h2 class="accordion-header">
            <button class="accordion-button ${activeSpecIdx > 0 ? 'collapsed' : ''}" type="button" data-bs-toggle="collapse" data-bs-target="#spec-collapse-${activeSpecIdx}">
              ${catName}
            </button>
          </h2>
          <div id="spec-collapse-${activeSpecIdx}" class="accordion-collapse collapse ${activeSpecIdx === 0 ? 'show' : ''}" data-bs-parent="#specsAccordion">
            <div class="accordion-body p-0">
              ${categoryRows}
            </div>
          </div>
        </div>
      `;
      activeSpecIdx++;
    }
  }

  $('#specsAccordion').html(specsHtml);

  // 5. Render Seller Comparison Rows
  const sellers = [
    { name: "HaOye Assured Store", price: product.price, delivery: "Free Shipping (24H)", status: "Lowest", isHaOye: true },
    { name: "Daraz Mall", price: product.price + 14500, delivery: "Rs. 250 Shipping (4 Days)", status: "In Stock", isHaOye: false },
    { name: "Telemart", price: product.price + 8900, delivery: "Rs. 300 Shipping (2 Days)", status: "In Stock", isHaOye: false },
    { name: "Shophive", price: product.price + 11200, delivery: "Rs. 200 Shipping (3 Days)", status: "In Stock", isHaOye: false }
  ];

  // Sort comparison by price ascending
  sellers.sort((a, b) => a.price - b.price);

  let sellerRows = '';
  sellers.forEach(s => {
    sellerRows += `
      <tr class="${s.isHaOye ? 'table-success fw-bold' : ''}">
        <td>
          ${s.name} 
          ${s.isHaOye ? '<span class="badge bg-peach text-white text-xs ms-1">PROMO</span>' : ''}
        </td>
        <td class="text-muted">${s.delivery}</td>
        <td class="${s.isHaOye ? 'text-peach font-weight-bold' : 'text-dark'}">
          Rs. ${s.price.toLocaleString()}
        </td>
        <td class="text-center">
          ${s.isHaOye 
            ? `<button class="btn btn-peach btn-sm rounded-pill px-3 add-to-cart-trigger" data-id="${product.id}">Buy Now</button>` 
            : `<button class="btn btn-outline-secondary btn-sm rounded-pill px-3 disabled">Visit</button>`
          }
        </td>
      </tr>
    `;
  });
  $('#seller-comparison-rows').html(sellerRows);

  // 6. Initialize Chart.js Price History Line Graph
  const ctx = document.getElementById('priceHistoryChart').getContext('2d');
  
  // Calculate mock historical price points (gradually dropping to current price)
  const historyData = [
    product.price + 38000,
    product.price + 29500,
    product.price + 22000,
    product.price + 16000,
    product.price + 8000,
    product.price
  ];

  // Check if dark mode is active to color chart elements
  const isDark = $('html').attr('data-theme') === 'dark';
  const textColor = isDark ? '#94a3b8' : '#64748b';
  const gridColor = isDark ? '#334155' : '#e2e8f0';

  const chartGradient = ctx.createLinearGradient(0, 0, 0, 250);
  chartGradient.addColorStop(0, 'rgba(255, 106, 61, 0.4)');
  chartGradient.addColorStop(1, 'rgba(255, 106, 61, 0.0)');

  const priceHistoryChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: ['Dec 2025', 'Jan 2026', 'Feb 2026', 'Mar 2026', 'Apr 2026', 'May 2026'],
      datasets: [{
        label: 'Market Price (Rs.)',
        data: historyData,
        borderColor: '#ff6a3d',
        borderWidth: 3,
        pointBackgroundColor: '#ff6a3d',
        pointHoverRadius: 8,
        pointHoverBackgroundColor: '#10b981',
        pointHoverBorderColor: '#ffffff',
        pointHoverBorderWidth: 2,
        tension: 0.4,
        fill: true,
        backgroundColor: chartGradient
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false }
      },
      scales: {
        x: {
          grid: { color: gridColor },
          ticks: { color: textColor, font: { family: 'Plus Jakarta Sans', size: 10 } }
        },
        y: {
          grid: { color: gridColor },
          ticks: {
            color: textColor,
            font: { family: 'Plus Jakarta Sans', size: 10 },
            callback: function (val) {
              return 'Rs. ' + (val / 1000) + 'K';
            }
          }
        }
      }
    }
  });

  // Re-color chart on theme swap
  $(document).on('click', '.theme-toggle-btn', function () {
    const isDark = $('html').attr('data-theme') === 'dark';
    const textColor = isDark ? '#94a3b8' : '#64748b';
    const gridColor = isDark ? '#334155' : '#e2e8f0';

    priceHistoryChart.options.scales.x.grid.color = gridColor;
    priceHistoryChart.options.scales.x.ticks.color = textColor;
    priceHistoryChart.options.scales.y.grid.color = gridColor;
    priceHistoryChart.options.scales.y.ticks.color = textColor;
    priceHistoryChart.update();
  });

  // 7. Interactive Review System
  const mockReviews = [
    { name: "Ali Raza", rating: 5, date: "2 weeks ago", comment: "Outstanding service! I was sceptical about open parcel delivery but the rider was so cooperative. The box was 100% original factory sealed. Highly recommended." },
    { name: "Ayesha Malik", rating: 4, date: "1 month ago", comment: "Very fast shipping, got my phone in Lahore within 24 hours. The price was indeed the lowest in market compared to physical retail stores." }
  ];

  function renderReviews() {
    let html = '';
    mockReviews.forEach(r => {
      let stars = '';
      for (let i = 1; i <= 5; i++) {
        stars += `<i class="fa-solid fa-star ${i <= r.rating ? 'text-warning' : 'text-muted-50'}"></i>`;
      }
      html += `
        <div class="p-3 bg-card border rounded-4 shadow-sm animate__animated animate__fadeIn">
          <div class="d-flex align-items-center justify-content-between mb-2">
            <div>
              <h6 class="fw-bold mb-0">${r.name}</h6>
              <span class="text-xs text-success"><i class="fa-solid fa-circle-check"></i> Verified Buyer</span>
            </div>
            <span class="text-xs text-muted">${r.date}</span>
          </div>
          <div class="text-warning text-xs mb-2">${stars}</div>
          <p class="text-sm text-dark-50 mb-0">${r.comment}</p>
        </div>
      `;
    });
    $('#reviews-list-container').html(html);
  }

  renderReviews();

  // Review Stars Picker inside form
  $('.star-select').on('click', function () {
    const rating = $(this).data('rating');
    $('#formRatingVal').val(rating);
    
    // Color stars up to selection
    $('.star-select').each(function () {
      const idx = $(this).data('rating');
      if (idx <= rating) {
        $(this).removeClass('fa-regular').addClass('fa-solid');
      } else {
        $(this).removeClass('fa-solid').addClass('fa-regular');
      }
    });
  });

  // Submit Review Form click
  $('#writeReviewForm').on('submit', function (e) {
    e.preventDefault();
    const name = $('#reviewerName').val().trim();
    const comment = $('#reviewComment').val().trim();
    const rating = parseInt($('#formRatingVal').val());

    if (!name || !comment) return;

    // Append to list
    mockReviews.unshift({
      name: name,
      rating: rating,
      date: "Just now",
      comment: comment
    });

    // Re-render
    renderReviews();

    // Trigger visual celebration
    const totalCount = product.reviewsCount + 1;
    $('#detail-reviews-count').text(`${totalCount} Verified Buyer Reviews`);
    
    // Clear inputs
    $('#reviewerName').val('');
    $('#reviewerEmail').val('');
    $('#reviewComment').val('');
    // reset stars
    $('.star-select').removeClass('fa-solid').addClass('fa-regular');
    $('.star-select[data-rating="5"]').click();

    alert("Review submitted successfully! Thank you for your feedback.");
  });

});
