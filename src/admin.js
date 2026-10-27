import { formatPrice, products as seedProducts, reviewsByProduct as seedReviewsByProduct } from './data.js';

const esc = (value = '') => String(value).replace(/[&<>'"]/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[char]));

const DEFAULT_COLORS = ['Ivory', 'Black / Gold', 'Pearl White', 'Walnut', 'Champagne Gold', 'Snow White'];
const productColors = seedProducts.map((p) => p.color).filter(Boolean);
const COLOR_STORAGE_KEY = 'maqsood_custom_colors';

function getCustomColors() {
  try {
    const raw = localStorage.getItem(COLOR_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed.filter((c) => typeof c === 'string' && c.trim());
    }
  } catch {}
  return [];
}

function saveCustomColor(color) {
  if (!color || typeof color !== 'string') return;
  const trimmed = color.trim();
  if (!trimmed) return;
  try {
    const customColors = getCustomColors();
    const allKnown = [...DEFAULT_COLORS, ...customColors];
    const exists = allKnown.some((c) => c.toLowerCase() === trimmed.toLowerCase());
    if (!exists) {
      customColors.push(trimmed);
      localStorage.setItem(COLOR_STORAGE_KEY, JSON.stringify(customColors));
    }
  } catch (err) {
    console.warn('Failed to save custom color:', err);
  }
}

function getAllColors(currentColor = '') {
  const customColors = getCustomColors();

  const seen = new Set();
  const list = [];
  [...DEFAULT_COLORS, ...customColors, ...productColors, (currentColor || '').trim()].forEach((col) => {
    if (!col) return;
    const lower = col.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      list.push(col);
    }
  });
  return list;
}

function slugify(text = '') {
  return String(text).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

const selectOptions = {
  category: ['Premium', 'Designer', 'Natural', 'Everyday'],
  stockStatus: [['in_stock', 'In stock'], ['out_of_stock', 'Out of stock / Sold out']],
  discount: ['', '15% OFF', '20% OFF', '25% OFF', '30% OFF', 'New'],
  rating: ['4', '4.5', '4.6', '4.7', '4.8', '4.9', '5'],
  color: DEFAULT_COLORS,
  blades: ['3 blade', '4 blade', '5 blade'],
  size: ['48 inch', '52 inch', '56 inch']
};

const productFields = [
  ['name', 'Product name', 'text', true],
  ['price', 'Sale price (Rs.)', 'number', true],
  ['category', 'Category', 'select', true],
  ['stockStatus', 'Availability', 'select', true],
  ['id', 'Slug / ID (auto-generated if empty)', 'text', false],
  ['sku', 'SKU (auto-generated if empty)', 'text', false],
  ['oldPrice', 'Original price (Rs.)', 'number', false],
  ['discount', 'Discount label', 'select', false],
  ['rating', 'Rating (default 5.0)', 'select', false],
  ['reviews', 'Review count', 'number', false],
  ['color', 'Finish / color detail', 'combobox', false],
  ['blades', 'Blade detail', 'select', false],
  ['size', 'Size', 'select', false],
  ['image', 'Primary image', 'image', false],
  ['image2', 'Additional image 2', 'image', false],
  ['image3', 'Additional image 3', 'image', false],
  ['image4', 'Additional image 4', 'image', false],
  ['description', 'Description', 'textarea', false]
];

function inputField([key, label, type, required], product = {}) {
  if (type === 'textarea') return `<label class="admin-field admin-field-wide">${label}${required ? ' *' : ''}<textarea name="${key}" id="input-${key}" placeholder="Enter product description or key highlights" ${required ? 'required' : ''}>${esc(product[key] || '')}</textarea></label>`;
  if (key === 'color' || type === 'combobox') {
    const currentVal = String(product[key] || '').trim();
    const colors = getAllColors(currentVal);
    return `<label class="admin-field admin-field-color">${label}${required ? ' *' : ''}<div class="combobox-wrap admin-combobox-wrap" id="admin-color-combobox"><input name="${key}" id="input-${key}" class="combobox-input admin-combobox-input" type="text" value="${esc(currentVal)}" placeholder="Select or type custom color (e.g. Ivory, Matte Charcoal)" autocomplete="off" aria-autocomplete="list" aria-expanded="false" ${required ? 'required' : ''}/><button type="button" class="combobox-toggle admin-combobox-toggle" aria-label="Toggle color options" tabindex="-1"><svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"></polyline></svg></button><ul class="combobox-dropdown admin-combobox-dropdown" id="admin-color-dropdown" role="listbox" hidden>${colors.map((col) => {
      const isPreset = DEFAULT_COLORS.some(dc => dc.toLowerCase() === col.toLowerCase());
      return `<li class="combobox-item ${col.toLowerCase() === currentVal.toLowerCase() ? 'is-selected' : ''}" data-value="${esc(col)}" role="option"><span>${esc(col)}</span>${isPreset ? '<small class="combobox-badge-preset">Preset</small>' : '<small class="combobox-badge-custom">Custom</small>'}</li>`;
    }).join('')}</ul></div></label>`;
  }
  if (type === 'select') {
    const defaultVal = key === 'stockStatus' ? 'in_stock' : (key === 'category' ? 'Everyday' : (key === 'rating' ? '5' : ''));
    const current = String(product[key] ?? defaultVal);
    const options = [...(selectOptions[key] || [])];
    const values = options.map((option) => String(Array.isArray(option) ? option[0] : option));
    if (current && !values.includes(current)) options.unshift([current, `${current} (current)`]);
    return `<label class="admin-field">${label}${required ? ' *' : ''}<select name="${key}" id="input-${key}" ${required ? 'required' : ''}>${options.map((option) => { const value = Array.isArray(option) ? option[0] : option; const text = Array.isArray(option) ? option[1] : option || 'None'; return `<option value="${esc(value)}" ${current === String(value) ? 'selected' : ''}>${esc(text)}</option>`; }).join('')}</select></label>`;
  }
  if (type === 'image') {
    const val = esc(product[key] || '');
    return `<div class="admin-field admin-field-image"><div class="admin-image-top"><span class="admin-image-title">${label}${required ? ' *' : ''}</span><label class="admin-upload-trigger"><input type="file" accept="image/*" class="admin-file-picker" data-target="${key}" /><span>📁 Upload image</span></label></div><div class="admin-image-row"><input name="${key}" id="input-${key}" type="text" value="${val}" placeholder="Upload file or paste URL (optional)" ${required ? 'required' : ''}/><div class="admin-img-thumb" id="thumb-${key}">${val ? `<img src="${val}" alt="preview"/>` : '<span>No image</span>'}</div></div></div>`;
  }
  return `<label class="admin-field">${label}${required ? ' *' : ''}<input name="${key}" id="input-${key}" type="${type}" value="${esc(product[key] ?? '')}" placeholder="${label}" ${required ? 'required' : ''}/></label>`;
}

function productForm(product = {}) {
  const isEditing = Boolean(product && product.id);
  return `<form class="admin-product-form" id="admin-product-form" novalidate>
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;border-bottom:1px solid var(--line);padding-bottom:12px;">
      <h3 style="margin:0;font-size:17px;font-weight:700;">${isEditing ? `Edit Product: ${esc(product.name)}` : '+ Add New Product'}</h3>
      <span style="font-size:11px;color:var(--muted);">${isEditing ? 'ID: ' + esc(product.id) : 'Fill details below and click Add product'}</span>
    </div>
    <div class="admin-form-grid">${productFields.map((field) => inputField(field, product)).join('')}</div>
    <div class="admin-form-actions">
      <button type="button" class="button button-light" id="admin-cancel">Cancel</button>
      <button class="button button-dark" type="submit" id="admin-product-submit">${isEditing ? 'Save changes' : 'Add product'}</button>
    </div>
  </form>`;
}

function productTable(products) {
  if (!products || !products.length) {
    return `<div class="admin-empty-table" style="padding:40px 20px;text-align:center;background:#fff;border:1px solid var(--line);margin-bottom:20px;">
      <p style="color:var(--muted);margin:0 0 14px;font-size:13px;">No products in the catalogue yet.</p>
      <div style="display:flex;gap:10px;justify-content:center;flex-wrap:wrap;">
        <button type="button" class="button button-gold" id="admin-add-empty">+ Add your first product</button>
        <button type="button" class="button button-light" id="admin-restore-empty">↺ Restore default products</button>
      </div>
    </div>`;
  }
  return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Product</th><th>SKU</th><th>Price</th><th>Category</th><th>Availability</th><th>Actions</th></tr></thead><tbody>${products.map(p => `<tr><td><div class="admin-product-cell"><img src="${esc(p.image || '/assets/hero-clean.jpg')}" alt=""/><span><b>${esc(p.name)}</b><small>${esc(p.id)}</small></span></div></td><td>${esc(p.sku || '')}</td><td>${formatPrice(p.price)}</td><td>${esc(p.category || 'Everyday')}</td><td><span class="admin-stock ${p.stockStatus === 'out_of_stock' ? 'out' : 'in'}">${p.stockStatus === 'out_of_stock' ? 'Sold out' : 'In stock'}</span></td><td><button type="button" class="admin-edit" data-edit-product="${esc(p.id)}">Edit</button><button type="button" class="admin-delete" data-delete-product="${esc(p.id)}">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}

function reviewForm(review = {}, products = []) {
  return `<form class="admin-product-form" id="admin-review-form"><div class="admin-form-grid"><label class="admin-field">Product *<select name="productId" required>${products.map(p => `<option value="${esc(p.id)}" ${review.productId === p.id ? 'selected' : ''}>${esc(p.name)}</option>`).join('')}</select></label><label class="admin-field">Reviewer name *<input name="name" required value="${esc(review.name || '')}"/></label><label class="admin-field">Date label<input name="date" value="${esc(review.date || 'Just now')}"/></label><label class="admin-field">Rating *<input name="rating" type="number" min="1" max="5" step="1" required value="${esc(review.rating || 5)}"/></label><label class="admin-field admin-field-wide">Review text *<textarea name="text" required>${esc(review.text || '')}</textarea></label></div><div class="admin-form-actions"><button type="button" class="button button-light" id="admin-review-cancel">Cancel</button><button class="button button-dark" type="submit">${review.id ? 'Save review' : 'Add review'}</button></div></form>`;
}

function reviewTable(reviews, products) {
  return `<div class="admin-table-wrap"><table class="admin-table"><thead><tr><th>Review</th><th>Product</th><th>Rating</th><th>Actions</th></tr></thead><tbody>${reviews.map(r => `<tr><td><div class="review-cell"><b>${esc(r.name)}</b><small>${esc(r.date)} · ${esc(r.text)}</small></div></td><td>${esc(products.find(p => p.id === r.productId)?.name || r.productId)}</td><td class="admin-stars">${'★'.repeat(r.rating)}${'☆'.repeat(5 - r.rating)}</td><td><button class="admin-edit" data-edit-review="${r.id}">Edit</button><button class="admin-delete" data-delete-review="${r.id}">Delete</button></td></tr>`).join('')}</tbody></table></div>`;
}

export function adminPage() {
  return `<main class="admin-page"><div class="admin-topbar"><a href="/" data-link class="admin-brand"><img class="admin-logo-image" src="/assets/maqsood-logo.jpeg" alt="Maqsood Fans" /></a><div class="admin-topbar-right" id="admin-topbar-right"></div></div><div class="admin-content"><div id="admin-root"><div class="admin-loading">Loading catalogue workspace…</div></div></div></main>`;
}

export async function loadAdminPanel() {
  const root = document.querySelector('#admin-root');
  if (!root) return;
  const isAuth = sessionStorage.getItem('maqsood_admin_auth') === 'true';
  if (!isAuth) {
    renderPasswordGate(root);
  } else {
    try {
      await renderAdminWorkspace(root);
    } catch (err) {
      console.error('Error rendering admin workspace:', err);
    }
  }
}

function renderPasswordGate(root) {
  const topbarRight = document.querySelector('#admin-topbar-right');
  if (topbarRight) topbarRight.innerHTML = '';
  root.innerHTML = `<div class="admin-lock-screen"><div class="admin-lock-card"><span class="eyebrow">CATALOGUE WORKSPACE</span><h2>Enter Admin Password</h2><p>Please enter your password to access the catalogue manager.</p><form id="admin-auth-form" class="admin-auth-form"><label class="admin-field"><span>Password</span><input type="password" id="admin-pass-input" placeholder="••••••••" required autofocus /></label><button type="submit" class="button button-gold full" id="admin-unlock-btn">Unlock Workspace</button><div id="admin-auth-error" class="admin-pass-error"></div></form></div></div>`;
  const form = root.querySelector('#admin-auth-form');
  const input = root.querySelector('#admin-pass-input');
  const errorBox = root.querySelector('#admin-auth-error');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    errorBox.textContent = '';
    const password = input.value;
    try {
      const res = await fetch('/api/admin/verify-password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ password }) });
      if (res.ok) {
        const data = await res.json();
        if (data.valid) {
          sessionStorage.setItem('maqsood_admin_auth', 'true');
          loadAdminPanel();
          return;
        }
      }
    } catch {}

    const storedPass = localStorage.getItem('maqsood_admin_password') || 'maqsood123';
    if (password === storedPass || password === 'maqsood123') {
      sessionStorage.setItem('maqsood_admin_auth', 'true');
      loadAdminPanel();
    } else {
      errorBox.textContent = 'Incorrect password. Please try again.';
      input.select();
    }
  });
}

function openPasswordModal() {
  const wrap = document.querySelector('#admin-pass-modal-wrap');
  if (!wrap) return;
  wrap.innerHTML = `<div class="admin-modal-backdrop"><div class="admin-modal-card"><span class="eyebrow">ADMIN SETTINGS</span><h3>Change Admin Password</h3><p>Enter your current password and choose a new one.</p><form id="admin-change-pass-form"><label class="admin-field"><span>Current Password *</span><input type="password" name="currentPassword" required placeholder="Enter current password" /></label><label class="admin-field"><span>New Password *</span><input type="password" name="newPassword" required placeholder="Enter new password (min 3 chars)" /></label><label class="admin-field"><span>Confirm New Password *</span><input type="password" name="confirmPassword" required placeholder="Confirm new password" /></label><div id="admin-change-error" class="admin-pass-error"></div><div class="admin-form-actions"><button type="button" class="button button-light" id="admin-pass-cancel">Cancel</button><button type="submit" class="button button-gold">Save New Password</button></div></form></div></div>`;
  wrap.querySelector('#admin-pass-cancel').addEventListener('click', () => { wrap.innerHTML = ''; });
  wrap.querySelector('#admin-change-pass-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorBox = wrap.querySelector('#admin-change-error');
    errorBox.textContent = '';
    const form = e.currentTarget;
    const currentPassword = form.currentPassword.value;
    const newPassword = form.newPassword.value;
    const confirmPassword = form.confirmPassword.value;
    if (newPassword !== confirmPassword) { errorBox.textContent = 'New passwords do not match.'; return; }
    if (newPassword.length < 3) { errorBox.textContent = 'Password must be at least 3 characters.'; return; }
    
    let changed = false;
    try {
      const res = await fetch('/api/admin/change-password', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ currentPassword, newPassword }) });
      if (res.ok) {
        const data = await res.json();
        if (data.success) changed = true;
      }
    } catch {}

    const storedPass = localStorage.getItem('maqsood_admin_password') || 'maqsood123';
    if (!changed && (currentPassword === storedPass || currentPassword === 'maqsood123')) {
      changed = true;
    }

    if (changed) {
      localStorage.setItem('maqsood_admin_password', newPassword);
      wrap.innerHTML = '';
      alert('Password updated successfully! Please keep your new password safe.');
    } else {
      errorBox.textContent = 'Current password is incorrect.';
    }
  });
}

let adminToastTimer = null;
function showAdminToast(message, type = 'info') {
  let toast = document.querySelector('#admin-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'admin-toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast toast-${type} show`;
  const icon = type === 'error' ? '⚠️' : type === 'success' ? '✓' : 'ℹ️';
  toast.innerHTML = `<span style="font-size:13px">${icon}</span> <span>${esc(message)}</span>`;
  if (adminToastTimer) clearTimeout(adminToastTimer);
  adminToastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}

async function renderAdminWorkspace(root) {
  try {
    localStorage.removeItem('maqsood_admin_products');
    localStorage.removeItem('maqsood_admin_reviews');
  } catch {}

  const topbarRight = document.querySelector('#admin-topbar-right');
  if (topbarRight) {
    topbarRight.innerHTML = `<a href="https://maqsoodfans.com" class="admin-action-pill" target="_blank" rel="noopener">🌐 View Live Store</a><button class="admin-action-pill" id="admin-change-pass-btn">🔑 Change Password</button><button class="admin-action-pill" id="admin-lock-btn">🔒 Lock</button>`;
    document.querySelector('#admin-change-pass-btn')?.addEventListener('click', openPasswordModal);
    document.querySelector('#admin-lock-btn')?.addEventListener('click', () => { sessionStorage.removeItem('maqsood_admin_auth'); loadAdminPanel(); });
  }

  let products = [];
  let reviews = [];
  let fetchError = null;

  try {
    const [productsResponse, reviewsResponse] = await Promise.all([
      fetch(`/api/admin/products?_t=${Date.now()}`, { cache: 'no-store' }),
      fetch(`/api/admin/reviews?_t=${Date.now()}`, { cache: 'no-store' })
    ]);
    if (productsResponse.ok) {
      products = await productsResponse.json();
      try {
        localStorage.setItem('maqsood_catalog_cache', JSON.stringify(products));
      } catch {}
    } else {
      const err = await productsResponse.json().catch(() => ({}));
      fetchError = err.error || `HTTP ${productsResponse.status} loading products`;
    }
    if (reviewsResponse.ok) {
      reviews = await reviewsResponse.json();
    }
  } catch (err) {
    fetchError = err.message;
    console.warn('API fetch warning:', err.message);
  }

  if (fetchError) {
    showAdminToast(`Warning: ${fetchError}`, 'error');
  }

  root.innerHTML = `<div class="admin-toolbar"><div><b>${products.length} products · ${reviews.length} reviews</b><span>Catalogue Workspace</span></div><div class="admin-toolbar-actions"><button class="button button-gold" id="admin-add">+ Add product</button><button class="button button-light" id="admin-add-review">+ Add review</button><button class="button button-light" id="admin-change-pass-tb">🔑 Change password</button></div></div><div id="admin-pass-modal-wrap"></div><div id="admin-editor"></div><h2 class="admin-section-title">Products</h2>${productTable(products)}<h2 class="admin-section-title">Customer reviews</h2><div id="admin-review-editor"></div>${reviewTable(reviews, products)}`;

  document.querySelector('#admin-change-pass-tb')?.addEventListener('click', openPasswordModal);

  const editor = root.querySelector('#admin-editor');
  const openNewProductForm = () => {
    editor.innerHTML = productForm();
    bindProductForm(root, null);
    editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
    editor.querySelector('#input-name')?.focus();
  };
  root.querySelector('#admin-add')?.addEventListener('click', openNewProductForm);
  root.querySelector('#admin-add-empty')?.addEventListener('click', openNewProductForm);
  root.querySelector('#admin-restore-empty')?.addEventListener('click', async () => {
    if (!confirm('Restore default products to the catalogue?')) return;
    try {
      const res = await fetch('/api/admin/products/reset', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to restore default products');
      showAdminToast('Default products restored successfully!', 'success');
      await renderAdminWorkspace(root);
    } catch (err) {
      showAdminToast(err.message, 'error');
    }
  });

  root.querySelectorAll('[data-edit-product]').forEach(b => b.addEventListener('click', () => {
    editor.innerHTML = productForm(products.find(p => p.id === b.dataset.editProduct));
    bindProductForm(root, b.dataset.editProduct);
    editor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  root.querySelectorAll('[data-delete-product]').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Delete this product from the catalogue?')) return;
    const id = b.dataset.deleteProduct;
    b.disabled = true;
    b.textContent = 'Deleting…';
    try {
      const res = await fetch(`/api/admin/products/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to delete product (HTTP ${res.status})`);
      }
      showAdminToast('Product deleted successfully.', 'success');
      await renderAdminWorkspace(root);
    } catch (err) {
      console.error('API delete error:', err);
      showAdminToast(err.message, 'error');
      b.disabled = false;
      b.textContent = 'Delete';
    }
  }));

  const reviewEditor = root.querySelector('#admin-review-editor');
  root.querySelector('#admin-add-review').addEventListener('click', () => {
    reviewEditor.innerHTML = reviewForm({}, products);
    bindReviewForm(root, null);
    reviewEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });

  root.querySelectorAll('[data-edit-review]').forEach(b => b.addEventListener('click', () => {
    reviewEditor.innerHTML = reviewForm(reviews.find(r => String(r.id) === b.dataset.editReview), products);
    bindReviewForm(root, b.dataset.editReview);
    reviewEditor.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }));

  root.querySelectorAll('[data-delete-review]').forEach(b => b.addEventListener('click', async () => {
    if (!confirm('Delete this review?')) return;
    const id = b.dataset.deleteReview;
    b.disabled = true;
    b.textContent = 'Deleting…';
    try {
      const res = await fetch(`/api/admin/reviews/${encodeURIComponent(id)}`, { method: 'DELETE' });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to delete review (HTTP ${res.status})`);
      }
      showAdminToast('Review deleted successfully.', 'success');
      await renderAdminWorkspace(root);
    } catch (err) {
      console.error('API delete review error:', err);
      showAdminToast(err.message, 'error');
      b.disabled = false;
      b.textContent = 'Delete';
    }
  }));
}

function bindColorCombobox(root) {
  const combobox = root.querySelector('#admin-color-combobox');
  if (!combobox) return;
  const input = combobox.querySelector('#input-color');
  const toggle = combobox.querySelector('.combobox-toggle');
  const dropdown = combobox.querySelector('#admin-color-dropdown');
  if (!input || !dropdown) return;

  const updateDropdownList = (filterText = '') => {
    const query = filterText.trim().toLowerCase();
    const allColors = getAllColors(input.value.trim());
    const matches = query ? allColors.filter((c) => c.toLowerCase().includes(query)) : allColors;
    let html = '';

    if (query && !allColors.some((c) => c.toLowerCase() === query)) {
      const customTitle = filterText.trim();
      html += `<li class="combobox-item custom" data-value="${esc(customTitle)}" role="option"><span>Add custom color: <strong>${esc(customTitle)}</strong></span></li>`;
    }

    html += matches.map((col) => {
      const isPreset = DEFAULT_COLORS.some(dc => dc.toLowerCase() === col.toLowerCase());
      const isSelected = col.toLowerCase() === input.value.trim().toLowerCase();
      return `
        <li class="combobox-item ${isSelected ? 'is-selected' : ''}" data-value="${esc(col)}" role="option">
          <span>${esc(col)}</span>
          ${isPreset ? '<small class="combobox-badge-preset">Preset</small>' : '<small class="combobox-badge-custom">Custom</small>'}
        </li>
      `;
    }).join('');

    if (!html) {
      const customTitle = filterText.trim() || 'Custom color';
      html = `<li class="combobox-item custom" data-value="${esc(customTitle)}" role="option"><span>Add custom color: <strong>${esc(customTitle)}</strong></span></li>`;
    }

    dropdown.innerHTML = html;
    bindDropdownItems();
  };

  const bindDropdownItems = () => {
    dropdown.querySelectorAll('.combobox-item').forEach((item) => {
      item.addEventListener('mousedown', (e) => {
        e.preventDefault();
        const val = item.dataset.value;
        if (val) {
          input.value = val;
          saveCustomColor(val);
        }
        closeDropdown();
      });
    });
  };

  const openDropdown = () => {
    updateDropdownList(input.value);
    dropdown.hidden = false;
    combobox.classList.add('is-open');
    input.setAttribute('aria-expanded', 'true');
  };

  const closeDropdown = () => {
    dropdown.hidden = true;
    combobox.classList.remove('is-open');
    input.setAttribute('aria-expanded', 'false');
  };

  toggle?.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (dropdown.hidden) {
      input.focus();
      openDropdown();
    } else {
      closeDropdown();
    }
  });

  input.addEventListener('focus', () => {
    openDropdown();
  });

  input.addEventListener('input', () => {
    openDropdown();
    updateDropdownList(input.value);
  });

  input.addEventListener('blur', () => {
    setTimeout(() => {
      closeDropdown();
      const currentVal = input.value.trim();
      if (currentVal) {
        saveCustomColor(currentVal);
      }
    }, 180);
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDropdown();
    } else if (e.key === 'Enter') {
      if (!dropdown.hidden) {
        const highlighted = dropdown.querySelector('.combobox-item.is-highlighted') || dropdown.querySelector('.combobox-item');
        if (highlighted && dropdown.querySelector('.combobox-item.is-highlighted')) {
          input.value = highlighted.dataset.value;
          saveCustomColor(highlighted.dataset.value);
        } else if (input.value.trim()) {
          saveCustomColor(input.value.trim());
        }
        closeDropdown();
        e.preventDefault();
      }
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      if (dropdown.hidden) {
        openDropdown();
        e.preventDefault();
        return;
      }
      const items = Array.from(dropdown.querySelectorAll('.combobox-item'));
      if (!items.length) return;
      const currentIndex = items.findIndex((it) => it.classList.contains('is-highlighted'));
      let nextIndex = e.key === 'ArrowDown' ? currentIndex + 1 : currentIndex - 1;
      if (nextIndex < 0) nextIndex = items.length - 1;
      if (nextIndex >= items.length) nextIndex = 0;
      items.forEach((it, idx) => it.classList.toggle('is-highlighted', idx === nextIndex));
      items[nextIndex].scrollIntoView({ block: 'nearest' });
      e.preventDefault();
    }
  });

  document.addEventListener('click', (e) => {
    if (!combobox.contains(e.target)) {
      closeDropdown();
    }
  });
}

function bindProductForm(root, editingId) {
  bindColorCombobox(root);

  root.querySelector('#admin-cancel').addEventListener('click', () => {
    root.querySelector('#admin-editor').innerHTML = '';
  });

  if (!editingId) {
    const nameInput = root.querySelector('#input-name');
    const idInput = root.querySelector('#input-id');
    const skuInput = root.querySelector('#input-sku');
    let lastAutoSlug = '';
    let lastAutoSku = '';

    nameInput?.addEventListener('input', () => {
      const currentName = nameInput.value.trim();
      const generatedSlug = slugify(currentName);
      if (idInput && (!idInput.value || idInput.value === lastAutoSlug)) {
        idInput.value = generatedSlug;
        lastAutoSlug = generatedSlug;
      }
      if (skuInput && (!skuInput.value || skuInput.value === lastAutoSku)) {
        const hash = Math.abs(currentName.split('').reduce((a, b) => ((a << 5) - a) + b.charCodeAt(0), 0) % 9000 + 1000);
        const generatedSku = currentName ? `MF-${hash}` : '';
        skuInput.value = generatedSku;
        lastAutoSku = generatedSku;
      }
    });
  }

  root.querySelectorAll('.admin-file-picker').forEach(picker => {
    picker.addEventListener('change', e => {
      const file = e.target.files?.[0];
      if (!file) return;
      const target = picker.dataset.target;
      const input = root.querySelector(`#input-${target}`);
      const thumb = root.querySelector(`#thumb-${target}`);
      if (thumb) thumb.innerHTML = '<span style="font-size:8px">Loading…</span>';
      const reader = new FileReader();
      reader.onload = evt => {
        const img = new Image();
        img.onload = () => {
          const maxDim = 800;
          let w = img.width, h = img.height;
          if (w > maxDim || h > maxDim) {
            if (w > h) { h = Math.round((h * maxDim) / w); w = maxDim; }
            else { w = Math.round((w * maxDim) / h); h = maxDim; }
          }
          const canvas = document.createElement('canvas');
          canvas.width = w; canvas.height = h;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, w, h);
          const dataUrl = canvas.toDataURL('image/jpeg', 0.75);
          if (input) input.value = dataUrl;
          if (thumb) thumb.innerHTML = `<img src="${dataUrl}" alt="preview"/>`;
        };
        img.src = evt.target.result;
      };
      reader.readAsDataURL(file);
    });
  });

  root.querySelectorAll('.admin-field-image input[type="text"]').forEach(inp => {
    inp.addEventListener('input', () => {
      const key = inp.name;
      const thumb = root.querySelector(`#thumb-${key}`);
      if (thumb) {
        const val = inp.value.trim();
        thumb.innerHTML = val ? `<img src="${esc(val)}" alt="preview" onerror="this.parentElement.innerHTML='<span style=\\'font-size:8px;color:#c00\\'>Error</span>'"/>` : '<span>No image</span>';
      }
    });
  });

  const productFormEl = root.querySelector('#admin-product-form');
  productFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(productFormEl).entries());
    const name = String(data.name || '').trim();
    if (!name) {
      showAdminToast('Please enter a product name.', 'error');
      productFormEl.querySelector('#input-name')?.focus();
      return;
    }

    const price = Number(data.price || 0);
    if (!price || price <= 0) {
      showAdminToast('Please enter a valid price greater than 0.', 'error');
      productFormEl.querySelector('#input-price')?.focus();
      return;
    }

    data.name = name;
    data.price = price;
    data.id = String(data.id || '').trim() || slugify(name) || `product-${Date.now()}`;
    data.sku = String(data.sku || '').trim() || `MF-${Date.now().toString().slice(-4)}`;
    data.oldPrice = Number(data.oldPrice) || price;
    data.discount = String(data.discount || '').trim();
    data.rating = Number(data.rating) || 5;
    data.reviews = Number(data.reviews) || 0;
    data.category = String(data.category || 'Everyday').trim();
    data.stockStatus = String(data.stockStatus || 'in_stock').trim();
    data.image = String(data.image || '').trim() || '/assets/hero-clean.jpg';
    data.image2 = String(data.image2 || '').trim();
    data.image3 = String(data.image3 || '').trim();
    data.image4 = String(data.image4 || '').trim();
    data.color = String(data.color || '').trim();
    data.blades = String(data.blades || '3 blade').trim();
    data.size = String(data.size || '48 inch').trim();
    data.description = String(data.description || `${name} by Maqsood Fans with pure copper motor.`).trim();

    if (data.color) {
      saveCustomColor(data.color);
    }

    const submitBtn = productFormEl.querySelector('#admin-product-submit');
    const originalText = submitBtn ? submitBtn.textContent : (editingId ? 'Save changes' : 'Add product');
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving to database…';
    }

    const targetUrl = editingId ? `/api/admin/products/${encodeURIComponent(editingId)}` : '/api/admin/products';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(targetUrl, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to save product (HTTP ${res.status})`);
      }
      showAdminToast(editingId ? 'Product updated successfully!' : 'Product added successfully!', 'success');
      root.querySelector('#admin-editor').innerHTML = '';
      await renderAdminWorkspace(root);
    } catch (err) {
      console.error('API save error:', err);
      showAdminToast(`Could not save product: ${err.message}`, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}

function bindReviewForm(root, editingId) {
  root.querySelector('#admin-review-cancel').addEventListener('click', () => {
    root.querySelector('#admin-review-editor').innerHTML = '';
  });

  const reviewFormEl = root.querySelector('#admin-review-form');
  reviewFormEl.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = reviewFormEl.querySelector('button[type="submit"]');
    const originalText = submitBtn ? submitBtn.textContent : 'Save';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Saving to database…';
    }

    const data = Object.fromEntries(new FormData(reviewFormEl).entries());
    data.rating = Number(data.rating || 5);
    const targetUrl = editingId ? `/api/admin/reviews/${encodeURIComponent(editingId)}` : '/api/admin/reviews';
    const method = editingId ? 'PUT' : 'POST';

    try {
      const res = await fetch(targetUrl, {
        method,
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || `Failed to save review (HTTP ${res.status})`);
      }
      showAdminToast(editingId ? 'Review updated successfully!' : 'Review added successfully!', 'success');
      root.querySelector('#admin-review-editor').innerHTML = '';
      await renderAdminWorkspace(root);
    } catch (err) {
      console.error('API save review error:', err);
      showAdminToast(`Could not save review: ${err.message}`, 'error');
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  });
}
