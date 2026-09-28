// ==========================================================================
// SHRUHI COLLECTIONS (www.shruhicollections.in)
// Interactive Lookbook Application Controller
// WhatsApp & Phone: +91 90542 41725
// ==========================================================================

(function () {
  'use strict';

  const WHATSAPP_NUMBER = '919054241725';
  const DISPLAY_PHONE = '+91 90542 41725';
  const SITE_URL = 'https://www.shruhicollections.in';
  const STORAGE_KEY = 'shruhi_shortlist_v1';

  const catalog = window.SHRUHI_CATALOG || [];

  // Application State
  const state = {
    category: 'all',
    brand: 'all',
    size: 'all',
    search: '',
    fullPosterMode: false,
    shortlist: loadShortlist(),
    activeModalIndex: -1,
    activeSelectedSize: ''
  };

  // DOM Elements
  const productGrid = document.getElementById('productGrid');
  const emptyState = document.getElementById('emptyState');
  const resultsCountEl = document.getElementById('resultsCount');
  const searchInput = document.getElementById('searchInput');
  const clearSearchBtn = document.getElementById('clearSearchBtn');
  const brandSelect = document.getElementById('brandSelect');
  const categoryTabs = document.querySelectorAll('.cat-tab');
  const sizePills = document.querySelectorAll('.size-pill');
  const cropModeBtn = document.getElementById('cropModeBtn');
  const shortlistCountEl = document.getElementById('shortlistCount');
  const plateStrip = document.getElementById('plateStrip');

  // Dialogs
  const productDialog = document.getElementById('productDialog');
  const sizeGuideDialog = document.getElementById('sizeGuideDialog');
  const shortlistDialog = document.getElementById('shortlistDialog');

  // --------------------------------------------------------------------------
  // 1. Mandatory <dialog closedby="any"> Fallback (modern-web-guidance)
  // --------------------------------------------------------------------------
  function setupDialogLightDismiss(dialog) {
    if (!dialog) return;
    if (!('closedBy' in HTMLDialogElement.prototype)) {
      dialog.addEventListener('click', (event) => {
        if (event.target !== dialog) return;
        const rect = dialog.getBoundingClientRect();
        const isDialogContent =
          rect.top <= event.clientY &&
          event.clientY <= rect.top + rect.height &&
          rect.left <= event.clientX &&
          event.clientX <= rect.left + rect.width;
        if (isDialogContent) return;
        dialog.close();
      });
    }
  }

  [productDialog, sizeGuideDialog, shortlistDialog].forEach(setupDialogLightDismiss);

  // --------------------------------------------------------------------------
  // 2. Shortlist Persistence
  // --------------------------------------------------------------------------
  function loadShortlist() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  function saveShortlist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state.shortlist));
    } catch {
      // ignore storage errors
    }
    updateShortlistBadge();
  }

  function toggleShortlist(productId, event) {
    if (event) event.stopPropagation();
    const idx = state.shortlist.indexOf(productId);
    if (idx > -1) {
      state.shortlist.splice(idx, 1);
    } else {
      state.shortlist.push(productId);
    }
    saveShortlist();
    renderCatalog();
    if (productDialog && productDialog.open && state.activeModalIndex > -1) {
      updateModalShortlistButton(catalog[state.activeModalIndex].id);
    }
  }

  function updateShortlistBadge() {
    if (shortlistCountEl) {
      shortlistCountEl.textContent = String(state.shortlist.length);
    }
  }

  // --------------------------------------------------------------------------
  // 3. WhatsApp Link Helpers (+91 90542 41725)
  // --------------------------------------------------------------------------
  function buildWhatsAppUrl(product, preferredSize) {
    const sizeText = preferredSize ? ` (Selected Size: ${preferredSize})` : ` (Sizes: ${product.sizes.join(', ')})`;
    const priceText = product.priceFormatted ? `\n• MRP: *${product.priceFormatted}* (${product.qtyInfo || ''})` : '';
    const msg =
      `Hello Shruhi Collections! ✨\n` +
      `I would like to order / enquire about:\n` +
      `• Design Code: *${product.code}*\n` +
      `• Outfit: ${product.name}${priceText}\n` +
      `• Colour: ${product.colorName}${sizeText}\n` +
      `• Catalog Link: ${SITE_URL}/#${product.id}`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  function buildShortlistWhatsAppUrl() {
    const items = state.shortlist
      .map((id) => catalog.find((p) => p.id === id))
      .filter(Boolean);
    if (!items.length) {
      return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hello Shruhi Collections! I am browsing www.shruhicollections.in and would like to enquire about your ethnic & fusion wear catalog.'
      )}`;
    }
    const listLines = items
      .map((item, idx) => `${idx + 1}. *${item.code}* — ${item.name} (${item.priceFormatted || ''} • ${item.sizes.join('/')})`)
      .join('\n');
    const msg =
      `Hello Shruhi Collections! ✨\n` +
      `I have shortlisted the following ${items.length} design(s) on www.shruhicollections.in:\n\n` +
      `${listLines}\n\n` +
      `Please share availability and dispatch details.`;
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`;
  }

  // --------------------------------------------------------------------------
  // 4. Filtering & Rendering Product Cards
  // --------------------------------------------------------------------------
  function getFilteredCatalog() {
    return catalog.filter((item) => {
      // Category filter
      if (state.category === 'plus-size') {
        if (!item.isPlusSize) return false;
      } else if (state.category !== 'all' && item.category !== state.category) {
        return false;
      }

      // Brand / Line filter
      if (state.brand !== 'all') {
        if (state.brand === 'FESTIVE' && item.lineGroup !== 'FESTIVE') return false;
        if (state.brand === 'STUDIO' && item.lineGroup !== 'STUDIO') return false;
        if (state.brand === 'PLUS' && !item.isPlusSize) return false;
        if (state.brand === 'BOUTIQUE' && item.lineGroup !== 'BOUTIQUE') return false;
      }

      // Size filter
      if (state.size !== 'all') {
        if (!item.sizes.includes(state.size)) return false;
      }

      // Search filter
      if (state.search.trim() !== '') {
        const q = state.search.toLowerCase().trim();
        const haystack = [
          item.code,
          item.name,
          item.brandLine,
          item.categoryLabel,
          item.colorName,
          item.fabric,
          item.workType,
          item.silhouette,
          item.description,
          item.priceFormatted || '',
          item.qtyInfo || '',
          item.sizes.join(' ')
        ]
          .join(' ')
          .toLowerCase();
        if (!haystack.includes(q)) return false;
      }

      return true;
    });
  }

  function renderCategoryCounts() {
    const counts = {
      all: catalog.length,
      'suit-sets': catalog.filter((i) => i.category === 'suit-sets').length,
      'plus-size': catalog.filter((i) => i.isPlusSize).length,
      'coord-sets': catalog.filter((i) => i.category === 'coord-sets').length,
      'tunics-dresses': catalog.filter((i) => i.category === 'tunics-dresses').length
    };
    Object.entries(counts).forEach(([key, val]) => {
      const badge = document.querySelector(`[data-count-for="${key}"]`);
      if (badge) badge.textContent = String(val);
    });
  }

  function renderCatalog() {
    const filtered = getFilteredCatalog();

    if (resultsCountEl) {
      resultsCountEl.textContent = `Showing ${filtered.length} of ${catalog.length} curated designs (31 4K Branded Plates • MRP ₹850 – ₹3,550)`;
    }

    if (!filtered.length) {
      productGrid.innerHTML = '';
      emptyState.style.display = 'block';
      return;
    }

    emptyState.style.display = 'none';

    productGrid.innerHTML = filtered
      .map((item) => {
        const isSaved = state.shortlist.includes(item.id);
        const sizeChips = item.sizes
          .map(
            (sz) =>
              `<span class="size-chip ${['3XL', '4XL', '5XL', '6XL'].includes(sz) ? 'plus' : ''}">${sz}</span>`
          )
          .join('');

        return `
        <article class="product-card" data-product-id="${item.id}">
          <div class="card-media" data-open-id="${item.id}">
            <img
              src="${item.image}"
              alt="${item.code} - ${item.name} by Shruhi Collections"
              loading="lazy"
            />
            <div class="card-badges-top">
              <div class="badge-stack">
                <span class="code-badge">${item.code} • ${item.priceFormatted || ''}</span>
                ${
                  item.isPlusSize
                    ? `<span class="plus-badge">PLUS SIZE ${item.sizes[0]}–${item.sizes[item.sizes.length - 1]}</span>`
                    : ''
                }
              </div>
              <button
                type="button"
                class="shortlist-btn ${isSaved ? 'saved' : ''}"
                data-shortlist-id="${item.id}"
                aria-label="${isSaved ? 'Remove from shortlist' : 'Save to shortlist'}"
                title="${isSaved ? 'Saved in Shortlist' : 'Add to Shortlist'}"
              >
                ${isSaved ? '♥' : '♡'}
              </button>
            </div>
            <div class="card-quickview-bar">
              <span>MRP ${item.priceFormatted || ''} • ${item.qtyInfo || ''}</span>
              <span>${item.gallery.length > 1 ? `${item.gallery.length} Plates →` : 'View Details →'}</span>
            </div>
          </div>

          <div class="card-body">
            <div class="card-meta-row">
              <span class="card-brand">${item.brandLine} • ${item.categoryLabel}</span>
              <span class="card-color-indicator">
                <span class="color-dot" style="background:${item.colorHex}"></span>
                ${item.colorName}
              </span>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:baseline; gap:0.5rem; margin-top:0.15rem;">
              <h3 class="card-title" data-open-id="${item.id}" style="margin:0;">${item.name}</h3>
              <span style="font-family:var(--font-display); font-size:1.35rem; font-weight:700; color:#7a1436; white-space:nowrap;">
                ${item.priceFormatted || ''}
              </span>
            </div>
            <div style="font-size:0.76rem; font-weight:700; color:#8c6f2d; margin-bottom:0.2rem;">
              📦 Qty / Pack: ${item.qtyInfo || `${item.sizes.length} Sizes (${item.sizes.join(', ')})`}
            </div>
            <p class="card-desc">${item.description}</p>

            <div class="card-footer">
              <div class="size-chip-list" aria-label="Available sizes">
                ${sizeChips}
              </div>
              <button type="button" class="inspect-link" data-open-id="${item.id}">
                Lookbook <span>→</span>
              </button>
            </div>
          </div>
        </article>
      `;
      })
      .join('');
  }

  // --------------------------------------------------------------------------
  // 5. Render All 19 Uploaded Catalog Plates Strip
  // --------------------------------------------------------------------------
  function render19PlateArchive() {
    if (!plateStrip) return;
    const allPlates = [];
    catalog.forEach((item) => {
      item.gallery.forEach((imgSrc, idx) => {
        allPlates.push({
          productId: item.id,
          code: item.gallery.length > 1 ? `${item.code} (${idx + 1})` : item.code,
          name: item.name,
          imgSrc,
          galleryIdx: idx
        });
      });
    });

    plateStrip.innerHTML = allPlates
      .map(
        (plate, i) => `
      <button
        type="button"
        class="plate-thumb"
        data-open-id="${plate.productId}"
        data-gallery-idx="${plate.galleryIdx}"
        title="Plate #${i + 1}: ${plate.code} — ${plate.name}"
      >
        <img src="${plate.imgSrc}" alt="Catalog Plate ${i + 1} - ${plate.code}" loading="lazy" />
        <span>#${i + 1} • ${plate.code}</span>
      </button>
    `
      )
      .join('');
  }

  // --------------------------------------------------------------------------
  // 6. Product Detail Modal (<dialog closedby="any">)
  // --------------------------------------------------------------------------
  function openProductModal(productId, initialGalleryIdx = 0) {
    const index = catalog.findIndex((p) => p.id === productId);
    if (index === -1) return;

    state.activeModalIndex = index;
    const item = catalog[index];
    state.activeSelectedSize = item.sizes[0] || '';

    const mainImg = document.getElementById('modalMainImg');
    const mainImgWrap = document.getElementById('modalMainImgWrap');
    const thumbsContainer = document.getElementById('modalThumbs');

    mainImgWrap.classList.remove('zoomed');
    mainImg.src = item.gallery[initialGalleryIdx] || item.image;
    mainImg.alt = `${item.code} - ${item.name}`;

    // Render gallery thumbnails if multiple plates exist
    if (item.gallery.length > 1) {
      thumbsContainer.style.display = 'flex';
      thumbsContainer.innerHTML = item.gallery
        .map(
          (src, idx) => `
        <button
          type="button"
          class="modal-thumb-btn ${idx === initialGalleryIdx ? 'active' : ''}"
          data-modal-thumb="${src}"
        >
          <img src="${src}" alt="${item.code} view ${idx + 1}" />
        </button>
      `
        )
        .join('');
    } else {
      thumbsContainer.style.display = 'none';
      thumbsContainer.innerHTML = '';
    }

    document.getElementById('modalCodeBadge').textContent = `${item.code}  •  MRP ${item.priceFormatted || ''}  (${item.qtyInfo || ''})`;
    document.getElementById('modalBrandLine').textContent = `${item.brandLine} • ${item.categoryLabel}`;
    document.getElementById('modalTitle').textContent = `${item.name} — ${item.priceFormatted || ''}`;
    document.getElementById('modalTagline').textContent = `“${item.tagline}”`;
    document.getElementById('modalDescription').textContent = item.description;

    document.getElementById('specColor').textContent = `${item.colorName} (MRP ${item.priceFormatted || ''})`;
    document.getElementById('specFabric').textContent = item.fabric;
    document.getElementById('specWork').textContent = item.workType;
    document.getElementById('specOccasion').textContent = `${item.qtyInfo || ''} • ${item.occasion}`;

    // Sizes selector inside modal
    const modalSizesEl = document.getElementById('modalSizes');
    modalSizesEl.innerHTML = item.sizes
      .map(
        (sz) => `
      <button
        type="button"
        class="size-pill ${sz === state.activeSelectedSize ? 'active' : ''}"
        data-select-modal-size="${sz}"
      >
        ${sz}
      </button>
    `
      )
      .join('');

    // Highlights
    const highlightsEl = document.getElementById('modalHighlights');
    highlightsEl.innerHTML = item.highlights.map((h) => `<li>${h}</li>`).join('');

    updateModalWhatsAppLink(item);
    updateModalShortlistButton(item.id);

    if (!productDialog.open) {
      productDialog.showModal();
    }
    history.replaceState(null, '', `#${item.id}`);
  }

  function updateModalWhatsAppLink(item) {
    const waBtn = document.getElementById('modalWhatsAppBtn');
    if (waBtn) {
      waBtn.href = buildWhatsAppUrl(item, state.activeSelectedSize);
    }
  }

  function updateModalShortlistButton(productId) {
    const btn = document.getElementById('modalShortlistBtn');
    if (!btn) return;
    const isSaved = state.shortlist.includes(productId);
    btn.textContent = isSaved ? '♥ Saved in Shortlist' : '♡ Save to Shortlist';
    btn.classList.toggle('active-mode', isSaved);
  }

  function stepModalProduct(delta) {
    if (state.activeModalIndex === -1) return;
    const nextIndex = (state.activeModalIndex + delta + catalog.length) % catalog.length;
    openProductModal(catalog[nextIndex].id, 0);
  }

  // --------------------------------------------------------------------------
  // 7. Shortlist Drawer Modal
  // --------------------------------------------------------------------------
  function openShortlistModal() {
    const container = document.getElementById('shortlistItemsContainer');
    const waAllBtn = document.getElementById('shortlistWhatsAppAllBtn');
    const items = state.shortlist
      .map((id) => catalog.find((p) => p.id === id))
      .filter(Boolean);

    if (waAllBtn) {
      waAllBtn.href = buildShortlistWhatsAppUrl();
    }

    if (!items.length) {
      container.innerHTML = `
        <div class="empty-state" style="padding: 2rem 1rem;">
          <h3>Your Lookbook Shortlist is Empty</h3>
          <p style="color: var(--text-secondary); margin-top: 0.35rem;">
            Click the heart (♡) icon on any outfit to bookmark your favourite designs and send them to Shruhi Collections on WhatsApp (${DISPLAY_PHONE}).
          </p>
        </div>
      `;
    } else {
      container.innerHTML = items
        .map(
          (item) => `
        <div class="shortlist-row">
          <div style="display:flex; align-items:center; gap:0.9rem;">
            <img src="${item.image}" alt="${item.name}" />
            <div>
              <span style="font-size:0.72rem; font-weight:700; color:var(--gold-primary); text-transform:uppercase;">
                ${item.code} • MRP ${item.priceFormatted || ''} • ${item.qtyInfo || ''}
              </span>
              <h4 style="font-family:var(--font-display); font-size:1.2rem; color:var(--bg-maroon-deep);">
                ${item.name}
              </h4>
              <span style="font-size:0.8rem; color:var(--text-secondary);">
                Sizes: ${item.sizes.join(', ')} • ${item.colorName}
              </span>
            </div>
          </div>
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <button type="button" class="action-btn" data-open-from-shortlist="${item.id}">View</button>
            <button type="button" class="action-btn" data-remove-shortlist="${item.id}" title="Remove">✕</button>
          </div>
        </div>
      `
        )
        .join('');
    }

    shortlistDialog.showModal();
  }

  // --------------------------------------------------------------------------
  // 8. Event Listeners
  // --------------------------------------------------------------------------
  function bindEvents() {
    // Category tabs
    categoryTabs.forEach((tab) => {
      tab.addEventListener('click', () => {
        categoryTabs.forEach((t) => t.classList.remove('active'));
        tab.classList.add('active');
        state.category = tab.dataset.category || 'all';
        renderCatalog();
      });
    });

    // Bento category cards & footer category links
    document.querySelectorAll('[data-filter-category]').forEach((el) => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const cat = el.dataset.filterCategory;
        state.category = cat;
        categoryTabs.forEach((t) => {
          t.classList.toggle('active', t.dataset.category === cat);
        });
        document.getElementById('catalogSection').scrollIntoView({ behavior: 'smooth' });
        renderCatalog();
      });
    });

    // Brand select
    if (brandSelect) {
      brandSelect.addEventListener('change', () => {
        state.brand = brandSelect.value;
        renderCatalog();
      });
    }

    // Size filter pills
    sizePills.forEach((pill) => {
      pill.addEventListener('click', () => {
        sizePills.forEach((p) => p.classList.remove('active'));
        pill.classList.add('active');
        state.size = pill.dataset.size || 'all';
        renderCatalog();
      });
    });

    // Search input
    if (searchInput) {
      searchInput.addEventListener('input', () => {
        state.search = searchInput.value;
        clearSearchBtn.style.display = state.search ? 'block' : 'none';
        renderCatalog();
      });
    }

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        state.search = '';
        clearSearchBtn.style.display = 'none';
        renderCatalog();
      });
    }

    // Reset all filters
    document.querySelectorAll('[data-reset-filters]').forEach((btn) => {
      btn.addEventListener('click', () => {
        state.category = 'all';
        state.brand = 'all';
        state.size = 'all';
        state.search = '';
        if (searchInput) searchInput.value = '';
        if (clearSearchBtn) clearSearchBtn.style.display = 'none';
        if (brandSelect) brandSelect.value = 'all';
        categoryTabs.forEach((t) => t.classList.toggle('active', t.dataset.category === 'all'));
        sizePills.forEach((p) => p.classList.toggle('active', p.dataset.size === 'all'));
        renderCatalog();
      });
    });

    // Studio Crop vs Full Catalog Sheet Toggle
    if (cropModeBtn) {
      cropModeBtn.addEventListener('click', () => {
        state.fullPosterMode = !state.fullPosterMode;
        document.body.classList.toggle('poster-full-mode', state.fullPosterMode);
        cropModeBtn.classList.toggle('active-mode', state.fullPosterMode);
        cropModeBtn.querySelector('span').textContent = state.fullPosterMode
          ? 'Full Poster View'
          : 'Studio Framed View';
      });
    }

    // Delegated clicks for opening modals and shortlist toggles
    document.addEventListener('click', (e) => {
      const shortlistTrigger = e.target.closest('[data-shortlist-id]');
      if (shortlistTrigger) {
        toggleShortlist(shortlistTrigger.dataset.shortlistId, e);
        return;
      }

      const openTrigger = e.target.closest('[data-open-id]');
      if (openTrigger) {
        const gIdx = Number(openTrigger.dataset.galleryIdx || 0);
        openProductModal(openTrigger.dataset.openId, gIdx);
        return;
      }

      const thumbBtn = e.target.closest('[data-modal-thumb]');
      if (thumbBtn) {
        const mainImg = document.getElementById('modalMainImg');
        mainImg.src = thumbBtn.dataset.modalThumb;
        document
          .querySelectorAll('.modal-thumb-btn')
          .forEach((b) => b.classList.toggle('active', b === thumbBtn));
        return;
      }

      const modalSizeBtn = e.target.closest('[data-select-modal-size]');
      if (modalSizeBtn && state.activeModalIndex > -1) {
        state.activeSelectedSize = modalSizeBtn.dataset.selectModalSize;
        document
          .querySelectorAll('[data-select-modal-size]')
          .forEach((b) => b.classList.toggle('active', b === modalSizeBtn));
        updateModalWhatsAppLink(catalog[state.activeModalIndex]);
        return;
      }

      const openFromShortlist = e.target.closest('[data-open-from-shortlist]');
      if (openFromShortlist) {
        shortlistDialog.close();
        openProductModal(openFromShortlist.dataset.openFromShortlist, 0);
        return;
      }

      const removeFromShortlist = e.target.closest('[data-remove-shortlist]');
      if (removeFromShortlist) {
        toggleShortlist(removeFromShortlist.dataset.removeShortlist, e);
        openShortlistModal();
      }
    });

    // Modal image zoom toggle
    const mainImgWrap = document.getElementById('modalMainImgWrap');
    if (mainImgWrap) {
      mainImgWrap.addEventListener('click', () => {
        mainImgWrap.classList.toggle('zoomed');
      });
    }

    // Modal Next / Prev buttons
    document.getElementById('modalPrevBtn')?.addEventListener('click', () => stepModalProduct(-1));
    document.getElementById('modalNextBtn')?.addEventListener('click', () => stepModalProduct(1));

    // Modal Shortlist button
    document.getElementById('modalShortlistBtn')?.addEventListener('click', () => {
      if (state.activeModalIndex > -1) {
        toggleShortlist(catalog[state.activeModalIndex].id);
      }
    });

    // Open Size Guide & Shortlist Dialogs
    document.querySelectorAll('[data-open-size-guide]').forEach((btn) => {
      btn.addEventListener('click', () => sizeGuideDialog.showModal());
    });

    document.getElementById('openShortlistBtn')?.addEventListener('click', openShortlistModal);

    // Keyboard navigation when product modal is open
    document.addEventListener('keydown', (e) => {
      if (!productDialog || !productDialog.open) return;
      if (e.key === 'ArrowLeft') stepModalProduct(-1);
      if (e.key === 'ArrowRight') stepModalProduct(1);
    });
  }

  // --------------------------------------------------------------------------
  // 9. Initialize
  // --------------------------------------------------------------------------
  function init() {
    renderCategoryCounts();
    updateShortlistBadge();
    renderCatalog();
    render19PlateArchive();
    bindEvents();

    // Deep-link support (e.g., www.shruhicollections.in/#meera-plus-suit)
    const hashId = window.location.hash.replace('#', '').trim();
    if (hashId && catalog.some((p) => p.id === hashId)) {
      openProductModal(hashId, 0);
    }
  }

  init();
})();
