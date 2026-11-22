/* ==========================================================
   Ridwan Rotan - app.js
   Renders products, FAQ and shipping tables from data.js and
   handles the order list, price, shipping and delivery maths.
   ========================================================== */

"use strict";

/* ---------- Settings ---------- */
const MAX_PREORDER_QTY = 20;

/* ---------- State ---------- */
let cart = []; // each item: { variantId: string, qty: number }

/* ---------- Lookups ---------- */
const variantIndex = {};
PRODUCTS.forEach(function (product) {
  product.variants.forEach(function (variant) {
    variantIndex[variant.id] = { product: product, variant: variant };
  });
});

/* ---------- Helpers ---------- */
const moneyFormatter = new Intl.NumberFormat("en-AU", {
  style: "currency",
  currency: "AUD"
});

function formatMoney(value) {
  return moneyFormatter.format(value).replace("A$", "AUD ").replace("$", "AUD ");
}

function formatDate(date) {
  return date.toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
}

function addDays(date, days) {
  const result = new Date(date.getTime());
  result.setDate(result.getDate() + days);
  return result;
}

function getEl(id) {
  return document.getElementById(id);
}

function getMaxQty(variant) {
  return variant.status === "ready" ? variant.stock : MAX_PREORDER_QTY;
}

function availabilityHtml(variant) {
  if (variant.status === "ready") {
    return '<span class="status-badge status-ready"><i class="bi bi-check-circle-fill"></i> Ready stock: ' +
      variant.stock + " pcs</span>";
  }
  return '<span class="status-badge status-preorder"><i class="bi bi-clock-history"></i> Pre-order: ' +
    variant.leadDays + " days production</span>";
}

function showToast(message) {
  const toastEl = getEl("appToast");
  getEl("toastMessage").textContent = message;
  if (typeof bootstrap !== "undefined") {
    bootstrap.Toast.getOrCreateInstance(toastEl, { delay: 2500 }).show();
  }
}

/* ==========================================================
   PRODUCTS
   ========================================================== */
function renderProducts() {
  const grid = getEl("productGrid");
  let html = "";

  PRODUCTS.forEach(function (product) {
    const first = product.variants[0];
    let options = "";
    product.variants.forEach(function (variant) {
      options += '<option value="' + variant.id + '">' + variant.name + "</option>";
    });

    html +=
      '<div class="col-sm-6 col-lg-4">' +
        '<article class="product-card" data-product="' + product.id + '">' +
          '<img src="' + product.image + '" alt="' + product.name + '" loading="lazy" width="600" height="600">' +
          '<div class="product-body">' +
            '<span class="product-category">' + product.category + "</span>" +
            '<h3 class="product-name">' + product.name + "</h3>" +
            '<p class="product-desc">' + product.description + "</p>" +
            '<label class="form-label" for="variant-' + product.id + '">Variant</label>' +
            '<select class="form-select mb-3 variant-select" id="variant-' + product.id + '" data-product="' + product.id + '">' +
              options +
            "</select>" +
            '<div class="d-flex flex-wrap justify-content-between align-items-center gap-2 mb-3">' +
              '<span class="product-price" id="price-' + product.id + '">' + formatMoney(first.price) + "</span>" +
              '<span id="status-' + product.id + '">' + availabilityHtml(first) + "</span>" +
            "</div>" +
            '<button type="button" class="btn btn-rattan w-100 add-button" data-product="' + product.id + '">' +
              '<i class="bi bi-plus-circle"></i> Add to order' +
            "</button>" +
          "</div>" +
        "</article>" +
      "</div>";
  });

  grid.innerHTML = html;
}

function getSelectedVariant(productId) {
  const select = getEl("variant-" + productId);
  return variantIndex[select.value].variant;
}

function onVariantChange(productId) {
  const variant = getSelectedVariant(productId);
  getEl("price-" + productId).textContent = formatMoney(variant.price);
  getEl("status-" + productId).innerHTML = availabilityHtml(variant);
}

function addToCart(productId) {
  const variant = getSelectedVariant(productId);
  const product = variantIndex[variant.id].product;
  const existing = cart.find(function (item) {
    return item.variantId === variant.id;
  });
  const maxQty = getMaxQty(variant);

  if (existing) {
    if (existing.qty >= maxQty) {
      showToast("Maximum quantity reached for " + product.name + ".");
      return;
    }
    existing.qty += 1;
  } else {
    cart.push({ variantId: variant.id, qty: 1 });
  }

  showToast(product.name + " added to your order.");
  renderCart();
  updateSummary();
}

/* ==========================================================
   CART
   ========================================================== */
function renderCart() {
  const list = getEl("cartList");
  const empty = getEl("cartEmpty");
  let html = "";
  let count = 0;

  cart.forEach(function (item) {
    const entry = variantIndex[item.variantId];
    const maxQty = getMaxQty(entry.variant);
    count += item.qty;

    html +=
      '<div class="cart-item">' +
        '<img src="' + entry.product.image + '" alt="' + entry.product.name + '" width="64" height="64">' +
        "<div>" +
          '<p class="cart-item-name">' + entry.product.name + "</p>" +
          '<p class="cart-item-variant">' + entry.variant.name + " &middot; " + formatMoney(entry.variant.price) + " each<br>" +
            availabilityHtml(entry.variant) + "</p>" +
          '<div class="cart-controls">' +
            '<label class="visually-hidden" for="qty-' + item.variantId + '">Quantity for ' + entry.product.name + "</label>" +
            '<input type="number" class="form-control form-control-sm qty-input" id="qty-' + item.variantId + '"' +
              ' data-variant="' + item.variantId + '" min="1" max="' + maxQty + '" value="' + item.qty + '">' +
            '<button type="button" class="btn btn-sm btn-outline-rattan remove-button" data-variant="' + item.variantId + '">' +
              '<i class="bi bi-trash"></i> Remove' +
            "</button>" +
            '<span class="cart-line-total">' + formatMoney(entry.variant.price * item.qty) + "</span>" +
          "</div>" +
        "</div>" +
      "</div>";
  });

  list.innerHTML = html;
  empty.classList.toggle("d-none", cart.length > 0);
  getEl("navCartCount").textContent = String(count);
}

function setQuantity(variantId, rawValue) {
  const item = cart.find(function (cartItem) {
    return cartItem.variantId === variantId;
  });
  if (!item) {
    return;
  }

  const maxQty = getMaxQty(variantIndex[variantId].variant);
  let qty = parseInt(rawValue, 10);

  if (isNaN(qty) || qty < 1) {
    qty = 1;
  }
  if (qty > maxQty) {
    qty = maxQty;
    showToast("Only " + maxQty + " available for this variant.");
  }

  item.qty = qty;
  renderCart();
  updateSummary();
}

function removeFromCart(variantId) {
  cart = cart.filter(function (item) {
    return item.variantId !== variantId;
  });
  renderCart();
  updateSummary();
}

/* ==========================================================
   CALCULATIONS (price, shipping, delivery estimate)
   ========================================================== */
function getSelectedMethod() {
  const checked = document.querySelector('input[name="shippingMethod"]:checked');
  const id = checked ? checked.value : SHIPPING_METHODS[0].id;
  return SHIPPING_METHODS.find(function (method) {
    return method.id === id;
  });
}

function getSelectedDestination() {
  const id = getEl("destination").value;
  return DESTINATIONS.find(function (zone) {
    return zone.id === id;
  });
}

function calculateOrder() {
  const method = getSelectedMethod();
  const zone = getSelectedDestination();
  let subtotal = 0;
  let weight = 0;
  let handlingDays = 0;

  cart.forEach(function (item) {
    const variant = variantIndex[item.variantId].variant;
    subtotal += variant.price * item.qty;
    weight += variant.weightKg * item.qty;
    const days = variant.status === "ready" ? READY_HANDLING_DAYS : variant.leadDays;
    if (days > handlingDays) {
      handlingDays = days;
    }
  });

  const chargeableKg = Math.ceil(weight);
  let shipping = 0;
  let minDays = 0;
  let maxDays = 0;

  if (cart.length > 0) {
    shipping = Math.round((method.baseFee + chargeableKg * method.ratePerKg * zone.multiplier) * 100) / 100;
    minDays = handlingDays + method.transitMin + zone.extraDays;
    maxDays = handlingDays + method.transitMax + zone.extraDays;
  }

  return {
    method: method,
    zone: zone,
    subtotal: subtotal,
    weight: weight,
    chargeableKg: chargeableKg,
    shipping: shipping,
    total: subtotal + shipping,
    handlingDays: handlingDays,
    minDays: minDays,
    maxDays: maxDays
  };
}

function updateSummary() {
  const result = calculateOrder();

  getEl("sumSubtotal").textContent = formatMoney(result.subtotal);
  getEl("sumWeight").textContent = result.weight.toFixed(1) + " kg";
  getEl("sumShipping").textContent = formatMoney(result.shipping);
  getEl("sumTotal").textContent = formatMoney(result.total);

  if (cart.length === 0) {
    getEl("sumDays").textContent = "Add a product to see the estimate.";
    getEl("sumDates").textContent = "";
    return;
  }

  const today = new Date();
  getEl("sumDays").textContent = result.minDays + " to " + result.maxDays + " days (" + result.method.name.toLowerCase() + ")";
  getEl("sumDates").textContent =
    "Arrives about " + formatDate(addDays(today, result.minDays)) + " to " + formatDate(addDays(today, result.maxDays)) +
    ", counted from today. Includes " + result.handlingDays + " days of production or handling.";
}

/* ==========================================================
   SHIPPING CONTROLS AND TABLES
   ========================================================== */
function renderShippingControls() {
  let zoneOptions = "";
  DESTINATIONS.forEach(function (zone) {
    zoneOptions += '<option value="' + zone.id + '">' + zone.name + "</option>";
  });
  getEl("destination").innerHTML = zoneOptions;

  let methodHtml = "";
  SHIPPING_METHODS.forEach(function (method, index) {
    methodHtml +=
      '<label class="method-option" for="method-' + method.id + '">' +
        '<input type="radio" name="shippingMethod" id="method-' + method.id + '" value="' + method.id + '"' +
          (index === 0 ? " checked" : "") + ">" +
        "<strong>" + method.name + "</strong>" +
        '<span class="method-note">' + method.note + "</span>" +
      "</label>";
  });
  getEl("methodList").innerHTML = methodHtml;
}

function renderShippingTables() {
  let methodRows = "";
  SHIPPING_METHODS.forEach(function (method) {
    methodRows +=
      "<tr>" +
        "<td><strong>" + method.name + "</strong></td>" +
        "<td>" + formatMoney(method.baseFee) + "</td>" +
        "<td>" + formatMoney(method.ratePerKg) + "</td>" +
        "<td>" + method.transitMin + " to " + method.transitMax + " days</td>" +
      "</tr>";
  });
  getEl("methodTable").innerHTML = methodRows;

  let zoneRows = "";
  DESTINATIONS.forEach(function (zone) {
    zoneRows +=
      "<tr>" +
        "<td>" + zone.name + "</td>" +
        "<td>" + Math.round(zone.multiplier * 100) + "%</td>" +
        "<td>" + (zone.extraDays === 0 ? "None" : "+" + zone.extraDays) + "</td>" +
      "</tr>";
  });
  getEl("zoneTable").innerHTML = zoneRows;
}

/* ==========================================================
   FAQ AND CONTACT
   ========================================================== */
function renderFaq() {
  let html = "";
  FAQS.forEach(function (faq, index) {
    const headingId = "faq-heading-" + index;
    const collapseId = "faq-collapse-" + index;
    html +=
      '<div class="accordion-item">' +
        '<h3 class="accordion-header" id="' + headingId + '">' +
          '<button class="accordion-button' + (index === 0 ? "" : " collapsed") + '" type="button" ' +
            'data-bs-toggle="collapse" data-bs-target="#' + collapseId + '" ' +
            'aria-expanded="' + (index === 0 ? "true" : "false") + '" aria-controls="' + collapseId + '">' +
            faq.question +
          "</button>" +
        "</h3>" +
        '<div id="' + collapseId + '" class="accordion-collapse collapse' + (index === 0 ? " show" : "") + '" ' +
          'aria-labelledby="' + headingId + '" data-bs-parent="#faqAccordion">' +
          '<div class="accordion-body">' + faq.answer + "</div>" +
        "</div>" +
      "</div>";
  });
  getEl("faqAccordion").innerHTML = html;
}

function renderContact() {
  const emailLink = getEl("contactEmail");
  emailLink.href = "mailto:" + CONTACT.email;
  emailLink.textContent = CONTACT.email;

  const waLink = getEl("contactWhatsapp");
  waLink.href = "https://wa.me/" + CONTACT.whatsapp;
  waLink.target = "_blank";
  waLink.rel = "noopener";
  waLink.textContent = CONTACT.phoneDisplay;

  getEl("contactAddress").textContent = CONTACT.address;
  getEl("footerEmail").textContent = CONTACT.email;
  getEl("footerPhone").textContent = CONTACT.phoneDisplay;
  getEl("footerAddress").textContent = CONTACT.address;
}

/* ==========================================================
   ORDER FORM
   ========================================================== */
function buildOrderRef() {
  const now = new Date();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = String(Math.floor(1000 + Math.random() * 9000));
  return "RR-" + now.getFullYear() + month + day + "-" + random;
}

function buildOrderSummary(ref, customer, result) {
  const lines = [];
  lines.push("Order reference: " + ref);
  lines.push("");
  lines.push("Customer: " + customer.fullName);
  lines.push("Email: " + customer.email);
  lines.push("Phone: " + customer.phone);
  lines.push("Address: " + customer.address + ", " + result.zone.name + " " + customer.postcode);
  lines.push("");
  lines.push("Items:");

  cart.forEach(function (item) {
    const entry = variantIndex[item.variantId];
    const status = entry.variant.status === "ready" ? "ready stock" : "pre-order";
    lines.push(
      "- " + item.qty + " x " + entry.product.name + " (" + entry.variant.name + ", " + status + ") = " +
      formatMoney(entry.variant.price * item.qty)
    );
  });

  lines.push("");
  lines.push("Subtotal: " + formatMoney(result.subtotal));
  lines.push("Shipping (" + result.method.name + ", " + result.weight.toFixed(1) + " kg): " + formatMoney(result.shipping));
  lines.push("Total: " + formatMoney(result.total));
  lines.push("Estimated delivery: " + result.minDays + " to " + result.maxDays + " days");

  if (customer.notes) {
    lines.push("");
    lines.push("Notes: " + customer.notes);
  }

  return lines.join("\n");
}

function showFormAlert(message) {
  const alertBox = getEl("formAlert");
  alertBox.textContent = message;
  alertBox.classList.remove("d-none");
}

function hideFormAlert() {
  getEl("formAlert").classList.add("d-none");
}

function handleOrderSubmit(event) {
  event.preventDefault();
  const form = getEl("orderForm");
  hideFormAlert();

  if (cart.length === 0) {
    showFormAlert("Your order list is empty. Add at least one product from the Products section first.");
    return;
  }

  form.classList.add("was-validated");
  if (!form.checkValidity()) {
    showFormAlert("Please complete the highlighted fields.");
    return;
  }

  const customer = {
    fullName: getEl("fullName").value.trim(),
    email: getEl("email").value.trim(),
    phone: getEl("phone").value.trim(),
    postcode: getEl("postcode").value.trim(),
    address: getEl("address").value.trim(),
    notes: getEl("notes").value.trim()
  };

  const result = calculateOrder();
  const ref = buildOrderRef();
  const summary = buildOrderSummary(ref, customer, result);

  getEl("modalName").textContent = customer.fullName;
  getEl("modalRef").textContent = ref;
  getEl("modalSummary").textContent = summary;
  getEl("modalWhatsapp").href = "https://wa.me/" + CONTACT.whatsapp + "?text=" + encodeURIComponent(summary);
  getEl("modalEmail").href =
    "mailto:" + CONTACT.email + "?subject=" + encodeURIComponent("Order request " + ref) +
    "&body=" + encodeURIComponent(summary);

  if (typeof bootstrap !== "undefined") {
    bootstrap.Modal.getOrCreateInstance(getEl("orderModal")).show();
  }

  form.reset();
  form.classList.remove("was-validated");
  cart = [];
  renderCart();
  updateSummary();
}

/* ==========================================================
   INIT
   ========================================================== */
function bindEvents() {
  getEl("productGrid").addEventListener("change", function (event) {
    if (event.target.classList.contains("variant-select")) {
      onVariantChange(event.target.dataset.product);
    }
  });

  getEl("productGrid").addEventListener("click", function (event) {
    const button = event.target.closest(".add-button");
    if (button) {
      addToCart(button.dataset.product);
    }
  });

  getEl("cartList").addEventListener("change", function (event) {
    if (event.target.classList.contains("qty-input")) {
      setQuantity(event.target.dataset.variant, event.target.value);
    }
  });

  getEl("cartList").addEventListener("click", function (event) {
    const button = event.target.closest(".remove-button");
    if (button) {
      removeFromCart(button.dataset.variant);
    }
  });

  getEl("destination").addEventListener("change", updateSummary);
  getEl("methodList").addEventListener("change", updateSummary);
  getEl("orderForm").addEventListener("submit", handleOrderSubmit);
}

function init() {
  renderProducts();
  renderShippingControls();
  renderShippingTables();
  renderFaq();
  renderContact();
  renderCart();
  updateSummary();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);
