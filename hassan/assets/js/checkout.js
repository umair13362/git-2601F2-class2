/*
 * HaOye Checkout Process Engine
 * Handles summary rendering, province-city selections, promo discounts,
 * card inputs validation, order placement receipt generation, canvas confetti
 */

$(document).ready(function () {
  
  // 1. Check if Cart is empty on load
  if (cart.length === 0) {
    alert("Your cart is empty! Redirecting to homepage...");
    window.location.href = 'index.html';
    return;
  }

  // 2. Render Checkout Summary
  let discountAmount = 0;
  let isPromoApplied = false;
  renderCheckoutSummary();

  // 3. Dependent Cities Dropdown
  const citiesMap = {
    "Punjab": ["Lahore", "Rawalpindi", "Faisalabad", "Multan", "Gujranwala", "Sialkot"],
    "Sindh": ["Karachi", "Hyderabad", "Sukkur", "Larkana"],
    "KPK": ["Peshawar", "Abbottabad", "Mardan"],
    "Balochistan": ["Quetta", "Gwadar"],
    "Federal": ["Islamabad"]
  };

  $('#shippingProvince').on('change', function () {
    const province = $(this).val();
    const $citySelect = $('#shippingCity');
    $citySelect.html('<option value="">Select City</option>');

    if (province && citiesMap[province]) {
      citiesMap[province].forEach(city => {
        $citySelect.append(`<option value="${city}">${city}</option>`);
      });
      $citySelect.prop('disabled', false);
    } else {
      $citySelect.prop('disabled', true);
    }
  });

  // Check if city was pre-saved on home page
  const savedCity = localStorage.getItem('haoye_city');
  if (savedCity) {
    // Search which province has this city to auto-check
    for (const [prov, cities] of Object.entries(citiesMap)) {
      if (cities.includes(savedCity)) {
        $('#shippingProvince').val(prov).trigger('change');
        $('#shippingCity').val(savedCity);
        break;
      }
    }
  }

  // 4. Promo Code Handler
  $('#promo-btn').on('click', function () {
    const code = $('#promo-input').val().trim().toUpperCase();
    if (isPromoApplied) return;

    if (code === 'HAOYE2K' || code === 'HAOYE') {
      discountAmount = 2000;
      isPromoApplied = true;
      $('#promo-discount-row').removeClass('d-none');
      $('#promo-msg').removeClass('d-none');
      $('#promo-input').prop('disabled', true);
      $('#promo-btn').prop('disabled', true);
      renderCheckoutSummary();
    } else {
      alert("Invalid promo code! Try HAOYE2K");
    }
  });

  // 5. Card Inputs toggle validation requirement
  $('input[name="paymentRadio"]').on('change', function () {
    const method = $(this).val();
    if (method === 'CARD') {
      $('#card-name, #card-number, #card-expiry, #card-cvv').prop('required', true);
    } else {
      $('#card-name, #card-number, #card-expiry, #card-cvv').prop('required', false).val('');
    }
  });

  // 6. Form Submission Validations
  $('#checkoutForm').on('submit', function (e) {
    e.preventDefault();
    const form = this;

    if (!form.checkValidity()) {
      e.stopPropagation();
      $(form).addClass('was-validated');
      return;
    }

    // Process payment card specific checks if selected
    const paymentMethod = $('input[name="paymentRadio"]:checked').val();
    if (paymentMethod === 'CARD') {
      const cardNum = $('#card-number').val().replace(/\s+/g, '');
      if (cardNum.length < 15 || cardNum.length > 16) {
        alert("Please enter a valid credit card number.");
        return;
      }
    }

    // SUCCESS TRIGGER!
    // Get invoice values
    const orderId = 'HY-' + Math.floor(100000 + Math.random() * 900000);
    const recipientName = $('#shippingName').val().trim();
    const deliveryCity = $('#shippingCity').val();
    const totalPayable = calculateGrandTotal();

    // Fill details in success receipt modal
    $('#receipt-order-id').text(orderId);
    $('#receipt-name').text(recipientName);
    $('#receipt-city').text(deliveryCity);
    $('#receipt-payment').text(paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : (paymentMethod === 'CARD' ? 'Credit Card' : 'Bank Transfer'));
    $('#receipt-total').text(`Rs. ${totalPayable.toLocaleString()}`);

    // Show modal
    const successModal = new bootstrap.Modal(document.getElementById('orderSuccessModal'));
    successModal.show();

    // Trigger Canvas Confetti blast! (Crazier visual!)
    triggerConfettiExplosion();

    // Clear cart completely
    cart = [];
    saveCart();
    updateCartUI(); // Updates badges in app.js
  });

  // Continue shopping button click
  $('#receipt-dismiss-btn').on('click', function () {
    $('#orderSuccessModal').modal('hide');
    window.location.href = 'index.html';
  });

  /* Internal Helpers */

  function renderCheckoutSummary() {
    let summaryHtml = '';
    let subtotal = 0;

    cart.forEach(item => {
      subtotal += item.price * item.qty;
      summaryHtml += `
        <div class="d-flex align-items-center gap-3">
          <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: contain; border-radius: 8px; background: var(--input-bg);">
          <div class="flex-grow-1 text-truncate" style="max-width: 180px;">
            <div class="fw-bold text-truncate">${item.name}</div>
            <span class="text-xs text-muted">Qty: ${item.qty}</span>
          </div>
          <span class="fw-bold ms-auto">Rs. ${(item.price * item.qty).toLocaleString()}</span>
        </div>
      `;
    });

    $('#checkout-summary-items').html(summaryHtml);
    $('#summary-subtotal').text(`Rs. ${subtotal.toLocaleString()}`);
    
    const grandTotal = subtotal - discountAmount;
    $('#summary-grand-total').text(`Rs. ${grandTotal.toLocaleString()}`);
  }

  function calculateGrandTotal() {
    let subtotal = cart.reduce((total, item) => total + (item.price * item.qty), 0);
    return subtotal - discountAmount;
  }

  function triggerConfettiExplosion() {
    const end = Date.now() + (3 * 1000); // 3 seconds burst
    const colors = ['#ff6a3d', '#10b981', '#0284c7', '#ffffff'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    }());
  }

});
