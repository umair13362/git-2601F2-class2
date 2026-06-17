/*
 * HaOye Category Filters Engine
 * Custom dual range price slider, sorting, dynamic checkbox filters
 */

$(document).ready(function () {
  
  // Parse URL Parameters
  const params = new URLSearchParams(window.location.search);
  const catParam = params.get('cat');
  const brandParam = params.get('brand');
  const maxPriceParam = params.get('price_max');
  const minPriceParam = params.get('price_min');
  const searchParam = params.get('search');

  // Set initial filters based on URL params
  if (catParam) {
    $(`.category-filter-chk[value="${catParam}"]`).prop('checked', true);
    // Update breadcrumb
    $('#breadcrumb-category').text(catParam.charAt(0).toUpperCase() + catParam.slice(1));
    $('#category-title-heading').text(catParam.charAt(0).toUpperCase() + catParam.slice(1) + " Catalog");
  }
  if (brandParam) {
    $(`.brand-filter-chk[value="${brandParam}"]`).prop('checked', true);
    $('#category-title-heading').text(`${brandParam} Products`);
  }
  if (searchParam) {
    $('.search-input').val(searchParam);
    $('#category-title-heading').text(`Search Results: "${searchParam}"`);
  }

  // Price Range Slider Configuration
  const minLimit = 0;
  const maxLimit = 500000;
  let currentMin = minPriceParam ? parseInt(minPriceParam) : 0;
  let currentMax = maxPriceParam ? parseInt(maxPriceParam) : 500000;

  // Custom JS Dual Handle Slider Engine
  const $track = $('.slider-track-bar');
  const $range = $('.slider-active-range');
  const $handleL = $('.handle-left');
  const $handleR = $('.handle-right');
  const $inputMin = $('.price-min-input');
  const $inputMax = $('.price-max-input');

  function updateSliderUI() {
    const trackWidth = $track.width();
    if (trackWidth === 0) return; // Wait for rendering

    const pctL = (currentMin - minLimit) / (maxLimit - minLimit);
    const pctR = (currentMax - minLimit) / (maxLimit - minLimit);

    $handleL.css('left', `${pctL * 100}%`);
    $handleR.css('left', `${pctR * 100}%`);
    
    $range.css({
      left: `${pctL * 100}%`,
      width: `${(pctR - pctL) * 100}%`
    });

    $inputMin.val(`Rs. ${currentMin.toLocaleString()}`);
    $inputMax.val(`Rs. ${currentMax.toLocaleString()}`);
  }

  // Trigger resize updates to slider width
  $(window).on('resize', updateSliderUI);
  setTimeout(updateSliderUI, 200);

  // Mouse / Touch event dragging logic
  let activeHandle = null;

  $handleL.on('mousedown touchstart', function (e) {
    e.preventDefault();
    activeHandle = 'left';
  });

  $handleR.on('mousedown touchstart', function (e) {
    e.preventDefault();
    activeHandle = 'right';
  });

  $(document).on('mousemove touchmove', function (e) {
    if (!activeHandle) return;

    const pageX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
    const trackOffset = $track.offset().left;
    const trackWidth = $track.width();
    
    let pct = (pageX - trackOffset) / trackWidth;
    pct = Math.max(0, Math.min(1, pct));
    const value = Math.round(minLimit + pct * (maxLimit - minLimit));

    if (activeHandle === 'left') {
      if (value < currentMax - 10000) {
        currentMin = value;
      }
    } else {
      if (value > currentMin + 10000) {
        currentMax = value;
      }
    }
    updateSliderUI();
  });

  $(document).on('mouseup touchend', function () {
    if (activeHandle) {
      activeHandle = null;
      applyFilters(); // Apply filter calculations on drag release
    }
  });

  // Filter Trigger Event Bindings
  $(document).on('change', '.category-filter-chk, .brand-filter-chk, .ram-filter-chk', function () {
    applyFilters();
  });

  $('#sortSelect').on('change', function () {
    applyFilters();
  });

  // Reset Filters Button
  $(document).on('click', '.reset-filters-btn', function (e) {
    e.preventDefault();
    $('.category-filter-chk, .brand-filter-chk, .ram-filter-chk').prop('checked', false);
    currentMin = 0;
    currentMax = 500000;
    $('.search-input').val('');
    $('#category-title-heading').text("All Electronics");
    updateSliderUI();
    applyFilters();
  });

  // Mobile drawer filter clone
  $('#mobile-filter-trigger').on('click', function () {
    const $mobileBody = $('#mobileFilterContainer');
    // Copy the contents of sidebar filter card
    const filtersHtml = $('.filter-card').html();
    $mobileBody.html(filtersHtml);
    
    // Set matching values in mobile inputs
    $mobileBody.find('.reset-filters-btn').remove(); // remove duplicate btn
    
    // Bind change events inside mobile modal to synch with desktop inputs
    $mobileBody.find('.category-filter-chk, .brand-filter-chk, .ram-filter-chk').on('change', function () {
      const val = $(this).val();
      const isChecked = $(this).is(':checked');
      const targetClass = $(this).attr('class').split(' ')[1]; // e.g. brand-filter-chk
      
      // Find counterpart in desktop and synch
      $(`.filter-card .${targetClass}[value="${val}"]`).prop('checked', isChecked);
      applyFilters();
    });

    // Re-initialize slider handles inside mobile view
    const $mTrack = $mobileBody.find('.slider-track-bar');
    const $mRange = $mobileBody.find('.slider-active-range');
    const $mHandleL = $mobileBody.find('.handle-left');
    const $mHandleR = $mobileBody.find('.handle-right');
    const $mInputMin = $mobileBody.find('.price-min-input');
    const $mInputMax = $mobileBody.find('.price-max-input');

    function updateMobileSliderUI() {
      const pctL = (currentMin - minLimit) / (maxLimit - minLimit);
      const pctR = (currentMax - minLimit) / (maxLimit - minLimit);
      $mHandleL.css('left', `${pctL * 100}%`);
      $mHandleR.css('left', `${pctR * 100}%`);
      $mRange.css({ left: `${pctL * 100}%`, width: `${(pctR - pctL) * 100}%` });
      $mInputMin.val(`Rs. ${currentMin.toLocaleString()}`);
      $mInputMax.val(`Rs. ${currentMax.toLocaleString()}`);
    }

    setTimeout(updateMobileSliderUI, 200);

    let mActiveHandle = null;
    $mHandleL.on('mousedown touchstart', function (e) { e.preventDefault(); mActiveHandle = 'left'; });
    $mHandleR.on('mousedown touchstart', function (e) { e.preventDefault(); mActiveHandle = 'right'; });

    $(document).on('mousemove touchmove', function (e) {
      if (!mActiveHandle) return;
      const pageX = e.pageX || (e.originalEvent.touches ? e.originalEvent.touches[0].pageX : 0);
      const trackOffset = $mTrack.offset().left;
      const trackWidth = $mTrack.width();
      let pct = (pageX - trackOffset) / trackWidth;
      pct = Math.max(0, Math.min(1, pct));
      const value = Math.round(minLimit + pct * (maxLimit - minLimit));
      
      if (mActiveHandle === 'left') {
        if (value < currentMax - 10000) currentMin = value;
      } else {
        if (value > currentMin + 10000) currentMax = value;
      }
      updateMobileSliderUI();
      updateSliderUI();
    });

    $(document).on('mouseup touchend', function () {
      if (mActiveHandle) {
        mActiveHandle = null;
        applyFilters();
      }
    });

    $('#mobileFilterModal').modal('show');
  });

  // Autocomplete search integration (if user hits enter)
  $('.search-input').on('keypress', function (e) {
    if (e.which === 13) {
      e.preventDefault();
      const val = $(this).val();
      $('#category-title-heading').text(`Search Results: "${val}"`);
      applyFilters();
    }
  });

  // Simulated Voice recognition search trigger
  let voiceTimeout1, voiceTimeout2;
  $('.voice-trigger-btn').on('click', function (e) {
    e.preventDefault();
    $('.voice-overlay').css('display', 'flex').hide().fadeIn(250);
    $('.voice-transcript').text('Listening...');
    
    voiceTimeout1 = setTimeout(function () {
      $('.voice-transcript').text('Thinking: "iPhone 15 Pro Max"...');
    }, 1500);

    voiceTimeout2 = setTimeout(function () {
      $('.voice-transcript').text('Searching for "iPhone 15 Pro Max"...');
      setTimeout(function () {
        $('.voice-overlay').fadeOut(150);
        $('.search-input').val('iPhone 15');
        $('#category-title-heading').text('Search Results: "iPhone 15"');
        applyFilters();
      }, 800);
    }, 3200);
  });

  $('.voice-close-btn').on('click', function () {
    clearTimeout(voiceTimeout1);
    clearTimeout(voiceTimeout2);
    $('.voice-overlay').fadeOut(250);
  });

  // Initial Filter Apply
  applyFilters();
});

// Primary Filter Application Function
function applyFilters() {
  const categories = [];
  $('.category-filter-chk:checked').each(function () {
    categories.push($(this).val());
  });

  const brands = [];
  $('.brand-filter-chk:checked').each(function () {
    brands.push($(this).val());
  });

  const rams = [];
  $('.ram-filter-chk:checked').each(function () {
    rams.push($(this).val());
  });

  const query = $('.search-input').val().toLowerCase().trim();
  const minVal = parseInt($('.price-min-input').val().replace(/[^\d]/g, '')) || 0;
  const maxVal = parseInt($('.price-max-input').val().replace(/[^\d]/g, '')) || 500000;
  const sortBy = $('#sortSelect').val();

  // Filter GLOBAL_CATALOG
  let filtered = GLOBAL_CATALOG.filter(p => {
    // Category match
    if (categories.length > 0 && !categories.includes(p.category)) return false;
    
    // Brand match
    if (brands.length > 0 && !brands.includes(p.brand)) return false;
    
    // RAM match (Only for products having RAM spec)
    if (rams.length > 0) {
      if (!p.specs || !p.specs.RAM) return false;
      const matchRam = rams.some(ram => p.specs.RAM.includes(ram));
      if (!matchRam) return false;
    }

    // Price range match
    if (p.price < minVal || p.price > maxVal) return false;

    // Search query match
    if (query.length > 0) {
      const matchTitle = p.name.toLowerCase().includes(query);
      const matchBrand = p.brand.toLowerCase().includes(query);
      const matchCat = p.category.toLowerCase().includes(query);
      if (!matchTitle && !matchBrand && !matchCat) return false;
    }

    return true;
  });

  // Apply Sorting
  if (sortBy === 'price-asc') {
    filtered.sort((a, b) => a.price - b.price);
  } else if (sortBy === 'price-desc') {
    filtered.sort((a, b) => b.price - a.price);
  } else if (sortBy === 'discount') {
    filtered.sort((a, b) => {
      const d1 = parseInt(a.discount.replace(/[^\d]/g, '')) || 0;
      const d2 = parseInt(b.discount.replace(/[^\d]/g, '')) || 0;
      return d2 - d1;
    });
  } else {
    // Default popularity: highest rating, then count
    filtered.sort((a, b) => {
      if (b.rating !== a.rating) return b.rating - a.rating;
      return b.reviewsCount - a.reviewsCount;
    });
  }

  // Render Grid
  renderListingGrid(filtered);
}

function renderListingGrid(products) {
  const $grid = $('#listings-grid');
  const $empty = $('#listings-empty-state');
  
  $('#results-count-text').text(`Showing ${products.length} products`);

  if (products.length === 0) {
    $grid.html('');
    $empty.removeClass('d-none').addClass('d-flex');
    return;
  }

  $empty.removeClass('d-flex').addClass('d-none');

  let html = '';
  products.forEach(p => {
    // Check if compare checkbox is checked in app.js array
    const isChecked = compareList.some(item => item.id === p.id) ? 'checked' : '';
    
    html += `
      <div class="col-md-6 col-lg-4 col-sm-12 animate__animated animate__fadeIn">
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

  $grid.html(html);
}
