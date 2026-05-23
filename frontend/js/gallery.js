/* ═══════════════════════════════════════════
   VelvetHub — gallery.js
   Categories + Ads + Live Cams + Filters
═══════════════════════════════════════════ */

const gallery       = document.getElementById('gallery');
const searchInput   = document.getElementById('searchInput');
const searchClear   = document.getElementById('searchClear');
const mediaCount    = document.getElementById('mediaCount');
const sectionTitle  = document.getElementById('sectionTitle');
const catInner      = document.getElementById('catInner');
const camsGrid      = document.getElementById('camsGrid');

let allMedia        = [];
let currentFilter   = 'all';
let currentCategory = 'all';
let adsMap          = {};

/* ══════ INIT ══════ */
async function init() {
  showSkeletons(12);
  await Promise.all([loadMedia(), loadCategories(), loadAds(), loadCams()]);
}

/* ══════ MEDIA ══════ */
async function loadMedia() {
  try {
    const res  = await fetch('/api/public/media');
    const data = await res.json();
    allMedia   = Array.isArray(data) ? data : (data.media || []);
    applyFilter();
  } catch {
    gallery.innerHTML = noResults('Failed to load content. Please try again later.');
  }
}

/* ══════ CATEGORIES ══════ */
async function loadCategories() {
  try {
    const res  = await fetch('/api/public/media/categories');
    const cats = await res.json();
    if (!cats.length) return;

    const pills = cats.map(c => `
      <button class="cat-pill" data-cat="${esc(c.name)}">
        ${esc(capitalize(c.name))} <span class="cat-count">(${c.count})</span>
      </button>`).join('');

    catInner.innerHTML = `
      <button class="cat-pill active" data-cat="all">All</button>
      ${pills}`;

    catInner.querySelectorAll('.cat-pill').forEach(btn => {
      btn.addEventListener('click', () => {
        catInner.querySelectorAll('.cat-pill').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentCategory = btn.dataset.cat;
        applyFilter(searchInput.value.trim());
      });
    });
  } catch { /* silently fail */ }
}

/* ══════ ADS ══════ */
async function loadAds() {
  try {
    const res = await fetch('/api/public/ads');
    const ads = await res.json();
    adsMap = {};
    ads.forEach(ad => {
      adsMap[ad.position] = ad.code;
    });
    injectAd('header',   document.getElementById('ad-header'));
    injectAd('after-row-3', document.getElementById('ad-after-row-3'));
    injectAd('footer',   document.getElementById('ad-footer'));
  } catch { /* silently fail */ }
}

function injectAd(position, el) {
  if (!el || !adsMap[position]) return;
  el.style.display = 'flex';
  el.innerHTML = adsMap[position];
}

/* ══════ LIVE CAMS ══════ */
async function loadCams() {
  if (!camsGrid) return;
  try {
    const res  = await fetch('/api/public/cams');
    const cams = await res.json();

    if (!cams.length) {
      camsGrid.innerHTML = '<div class="no-cams">No live cams configured yet.</div>';
      return;
    }

    camsGrid.innerHTML = cams.map(cam => `
      <a class="cam-card" href="${esc(cam.affiliateUrl)}" target="_blank" rel="noopener noreferrer sponsored">
        <div class="cam-thumb">
          ${cam.imageUrl
            ? `<img src="${esc(cam.imageUrl)}" alt="${esc(cam.name)}" loading="lazy">`
            : `<div class="cam-thumb-placeholder">📹</div>`}
          <div class="cam-overlay">
            <span class="cam-live-badge">${esc(cam.badge || 'LIVE')}</span>
          </div>
        </div>
        <div class="cam-info">
          <div class="cam-name">${esc(cam.name)}</div>
          <div class="cam-desc">${esc(cam.description || 'Watch live now — free to join')}</div>
          <span class="cam-cta">Watch Live →</span>
        </div>
      </a>`).join('');
  } catch {
    camsGrid.innerHTML = '<div class="no-cams">Live cams unavailable right now.</div>';
  }
}

/* ══════ FILTER TABS ══════ */
document.querySelectorAll('.ftab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    const map = { all: 'Latest Uploads', video: 'Videos', image: 'Photos' };
    if (sectionTitle) sectionTitle.textContent = map[currentFilter] || 'Latest Uploads';
    applyFilter(searchInput.value.trim());
  });
});

/* ══════ SEARCH ══════ */
searchInput?.addEventListener('input', e => {
  const q = e.target.value.trim();
  if (searchClear) searchClear.style.display = q ? 'block' : 'none';
  applyFilter(q);
});
searchClear?.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.style.display = 'none';
  applyFilter('');
});

/* ══════ APPLY FILTER ══════ */
function applyFilter(query = '') {
  let list = [...allMedia];

  if (currentFilter !== 'all')
    list = list.filter(m => m.fileType === currentFilter);

  if (currentCategory !== 'all')
    list = list.filter(m => (m.category || 'uncategorized') === currentCategory);

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(m =>
      (m.title || '').toLowerCase().includes(q) ||
      (m.category || '').toLowerCase().includes(q) ||
      (m.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  renderGallery(list);
}

/* ══════ RENDER GALLERY ══════ */
function renderGallery(list) {
  if (mediaCount) mediaCount.textContent = `${list.length} item${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    gallery.innerHTML = noResults('No results found. Try a different search or filter.');
    return;
  }

  gallery.innerHTML = '';

  list.forEach((item, idx) => {
    gallery.appendChild(buildCard(item));

    // inject mid-roll ad after row 1 (first 4 cards)
    if (idx === 3 && adsMap['after-row-1']) {
      const adEl = document.createElement('div');
      adEl.className = 'ad-slot ad-mid';
      adEl.style.gridColumn = '1/-1';
      adEl.innerHTML = `<div style="position:absolute;top:4px;left:50%;transform:translateX(-50%);font-size:9px;letter-spacing:1px;text-transform:uppercase;color:var(--muted2);background:var(--bg2);padding:1px 8px;border-radius:3px;border:1px solid var(--border)">Sponsored</div>${adsMap['after-row-1']}`;
      adEl.style.position = 'relative';
      gallery.appendChild(adEl);
    }
  });
}

/* ══════ BUILD CARD ══════ */
function buildCard(item) {
  const card    = document.createElement('div');
  card.className = 'media-card';
  const isVideo = item.fileType === 'video';
  const cat     = item.category && item.category !== 'uncategorized' ? item.category : null;

  card.innerHTML = `
    <div class="thumb-wrap">
      ${isVideo
        ? `<video src="${esc(item.fileUrl)}" muted loop preload="none" playsinline></video>`
        : `<img src="${esc(item.fileUrl)}" alt="${esc(item.title)}" loading="lazy">`}
      <div class="thumb-gradient"></div>
      <div class="thumb-overlay">
        <div class="play-btn">${isVideo ? '&#9654;' : '&#128269;'}</div>
      </div>
      <span class="badge-type ${isVideo ? 'badge-video' : 'badge-image'}">${isVideo ? 'VIDEO' : 'PHOTO'}</span>
      <span class="badge-hd">HD</span>
    </div>
    <div class="media-info">
      <div class="media-title">${esc(item.title)}</div>
      <div class="media-meta">
        <span class="meta-type ${isVideo ? 'video' : 'image'}">${isVideo ? 'Video' : 'Photo'}</span>
        ${cat ? `<span class="meta-sep">•</span><span class="meta-cat" data-cat="${esc(cat)}">${esc(capitalize(cat))}</span>` : ''}
        ${item.createdAt ? `<span class="meta-sep">•</span><span class="meta-date">${timeAgo(new Date(item.createdAt))}</span>` : ''}
      </div>
      ${item.tags?.length
        ? `<div class="media-tags">${item.tags.slice(0,4).map(t => `<span class="tag-chip">${esc(t)}</span>`).join('')}</div>`
        : ''}
    </div>`;

  // Hover video preview
  if (isVideo) {
    const video   = card.querySelector('video');
    const overlay = card.querySelector('.thumb-overlay');
    card.addEventListener('mouseenter', () => { video.play().catch(()=>{}); overlay.style.opacity = '0'; });
    card.addEventListener('mouseleave', () => { video.pause(); video.currentTime = 0; overlay.style.opacity = '1'; });
  }

  // Category chip click → filter
  card.querySelector('.meta-cat')?.addEventListener('click', e => {
    e.stopPropagation();
    currentCategory = e.target.dataset.cat;
    catInner.querySelectorAll('.cat-pill').forEach(p => {
      p.classList.toggle('active', p.dataset.cat === currentCategory);
    });
    applyFilter(searchInput.value.trim());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  card.addEventListener('click', () => { window.location.href = `/view?id=${item._id}`; });
  return card;
}

/* ══════ SKELETONS ══════ */
function showSkeletons(n = 10) {
  gallery.innerHTML = Array(n).fill(`
    <div class="skeleton-card">
      <div class="skeleton-thumb"></div>
      <div class="skeleton-body">
        <div class="skeleton-line w70"></div>
        <div class="skeleton-line w40"></div>
      </div>
    </div>`).join('');
}

/* ══════ HELPERS ══════ */
function noResults(msg) {
  return `<div class="no-results">
    <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
    ${msg}</div>`;
}

function esc(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function capitalize(s) {
  return (s||'').charAt(0).toUpperCase() + s.slice(1);
}

function timeAgo(d) {
  const s = Math.floor((Date.now()-d)/1000);
  if (s < 60)       return 'just now';
  if (s < 3600)     return `${Math.floor(s/60)}m ago`;
  if (s < 86400)    return `${Math.floor(s/3600)}h ago`;
  if (s < 2592000)  return `${Math.floor(s/86400)}d ago`;
  if (s < 31536000) return `${Math.floor(s/2592000)}mo ago`;
  return `${Math.floor(s/31536000)}y ago`;
}

/* add meta-cat style inline */
const st = document.createElement('style');
st.textContent = '.meta-cat{font-size:11px;color:var(--gold,#c9a84c);cursor:pointer;}.meta-cat:hover{text-decoration:underline;}';
document.head.appendChild(st);

/* Handle URL params (?search= ?filter= ?category=) */
(function(){
  const p   = new URLSearchParams(window.location.search);
  const q   = p.get('search') || p.get('q') || '';
  const fil = p.get('filter') || 'all';
  const cat = p.get('category') || 'all';
  if (q && searchInput) { searchInput.value = q; if(searchClear) searchClear.style.display='block'; }
  if (fil !== 'all') {
    currentFilter = fil;
    document.querySelectorAll('.ftab').forEach(b => b.classList.toggle('active', b.dataset.filter === fil));
  }
  if (cat !== 'all') currentCategory = cat;
})();

init();
