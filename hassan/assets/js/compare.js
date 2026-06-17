/*
 * HaOye Comparison Engine
 * Populates 3 slot selectors and specifications matrix table with winner highlights
 */

$(document).ready(function () {
  
  // Render initial comparison state
  renderComparisonPage();

  // Dropdown product selections change
  $(document).on('change', '.compare-dropdown-select', function () {
    const val = $(this).val();
    if (!val) return;

    const product = GLOBAL_CATALOG.find(p => p.id === val);
    if (!product) return;

    if (compareList.length >= 3) {
      alert("You can only compare up to 3 products!");
      return;
    }

    compareList.push(product);
    saveCompare();
    renderComparisonPage();
  });

  // Remove comparison card slot
  $(document).on('click', '.remove-compare-slot', function () {
    const id = $(this).data('id');
    compareList = compareList.filter(item => item.id !== id);
    saveCompare();
    renderComparisonPage();
  });

});

function renderComparisonPage() {
  const $selectionRow = $('#compare-selection-row');
  const $matrixBody = $('#compare-matrix-body');
  const $emptyState = $('#compare-empty-state');
  const $tableWrapper = $('.table-responsive');

  if (compareList.length === 0) {
    $selectionRow.html('');
    $matrixBody.html('');
    $tableWrapper.addClass('d-none');
    $emptyState.removeClass('d-none');
    return;
  }

  $emptyState.addClass('d-none');
  $tableWrapper.removeClass('d-none');

  // 1. Render 3 Slots
  let slotsHtml = '';
  
  for (let i = 0; i < 3; i++) {
    const product = compareList[i];
    
    if (product) {
      slotsHtml += `
        <div class="col-lg-4 col-md-6 col-sm-12 animate__animated animate__fadeIn">
          <div class="product-card text-center" style="min-height: 250px;">
            <button class="btn btn-close remove-compare-slot position-absolute" data-id="${product.id}" style="top: 15px; right: 15px;" aria-label="Remove"></button>
            <div class="product-img-wrapper" style="height: 120px;">
              <img src="${product.image}" alt="${product.name}" style="max-height: 100%;">
            </div>
            <div class="product-brand mt-2">${product.brand}</div>
            <h5 class="product-title font-weight-bold" style="font-size: 0.9rem; height: 35px; overflow: hidden;">${product.name}</h5>
            <div class="current-price text-peach mb-3" style="font-size: 1.1rem;">Rs. ${product.price.toLocaleString()}</div>
            <button class="btn btn-teal btn-sm text-white rounded-pill px-4 add-to-cart-trigger" data-id="${product.id}">Add to Cart</button>
          </div>
        </div>
      `;
    } else {
      // Build dropdown of products NOT in comparison
      let optionsHtml = '<option value="">+ Add Product</option>';
      GLOBAL_CATALOG.forEach(item => {
        if (!compareList.some(comp => comp.id === item.id)) {
          optionsHtml += `<option value="${item.id}">${item.name}</option>`;
        }
      });

      slotsHtml += `
        <div class="col-lg-4 col-md-6 col-sm-12">
          <div class="compare-card-selector">
            <i class="fa-solid fa-square-plus text-muted mb-3" style="font-size: 2.5rem;"></i>
            <h6>Add Device</h6>
            <select class="form-select compare-dropdown-select rounded-pill mt-2 text-sm text-center font-weight-bold">
              ${optionsHtml}
            </select>
          </div>
        </div>
      `;
    }
  }

  $selectionRow.html(slotsHtml);

  // 2. Generate Specifications Matrix rows
  const specRows = [
    { label: "Price", key: "price", type: "price" },
    { label: "Brand", key: "brand", type: "text" },
    { label: "Display Screen", key: "Display", type: "spec" },
    { label: "Processor Chip", key: "Processor", type: "spec" },
    { label: "RAM Capacity", key: "RAM", type: "ram" },
    { label: "Internal Storage", key: "Storage", type: "storage" },
    { label: "Battery Size", key: "Battery", type: "battery" },
    { label: "Camera Setup", key: "Main Camera", type: "spec" },
    { label: "Front Camera", key: "Front Camera", type: "spec" }
  ];

  let matrixHtml = '';
  
  // Header row
  let headerHtml = '<tr><td>Feature</td>';
  for (let i = 0; i < 3; i++) {
    const p = compareList[i];
    headerHtml += `<td><strong>${p ? p.name : 'Empty Slot'}</strong></td>`;
  }
  headerHtml += '</tr>';
  matrixHtml += headerHtml;

  // Compare each spec row
  specRows.forEach(row => {
    let rowHtml = `<tr class="compare-matrix-row"><td>${row.label}</td>`;
    
    // Calculate winning index for highlight
    let winnerIndex = -1;
    let bestValue = null;

    if (row.type === 'price') {
      // Lower price is better
      compareList.forEach((p, idx) => {
        if (!p) return;
        if (bestValue === null || p.price < bestValue) {
          bestValue = p.price;
          winnerIndex = idx;
        }
      });
    } else if (row.type === 'ram') {
      // Higher RAM is better
      compareList.forEach((p, idx) => {
        if (!p || !p.specs || !p.specs.RAM) return;
        const val = parseInt(p.specs.RAM.replace(/[^\d]/g, '')) || 0;
        if (bestValue === null || val > bestValue) {
          bestValue = val;
          winnerIndex = idx;
        }
      });
    } else if (row.type === 'storage') {
      // Higher storage is better
      compareList.forEach((p, idx) => {
        if (!p || !p.specs || !p.specs.Storage) return;
        const val = parseInt(p.specs.Storage.replace(/[^\d]/g, '')) || 0;
        if (bestValue === null || val > bestValue) {
          bestValue = val;
          winnerIndex = idx;
        }
      });
    } else if (row.type === 'battery') {
      // Higher battery mAh is better
      compareList.forEach((p, idx) => {
        if (!p || !p.specs || !p.specs.Battery) return;
        const val = parseInt(p.specs.Battery.replace(/[^\d]/g, '')) || 0;
        if (bestValue === null || val > bestValue) {
          bestValue = val;
          winnerIndex = idx;
        }
      });
    }

    // Build the cells
    for (let i = 0; i < 3; i++) {
      const p = compareList[i];
      if (p) {
        let displayVal = '';
        if (row.type === 'price') {
          displayVal = `Rs. ${p.price.toLocaleString()}`;
        } else if (row.type === 'spec' || row.type === 'ram' || row.type === 'storage' || row.type === 'battery') {
          displayVal = p.specs[row.key] || 'N/A';
        } else {
          displayVal = p[row.key] || 'N/A';
        }

        const isWinnerClass = (i === winnerIndex && compareList.filter(item => item !== undefined).length > 1) ? 'winner-highlight' : '';
        rowHtml += `<td class="${isWinnerClass}">${displayVal}</td>`;
      } else {
        rowHtml += '<td>-</td>';
      }
    }
    
    rowHtml += '</tr>';
    matrixHtml += rowHtml;
  });

  $matrixBody.html(matrixHtml);
}
