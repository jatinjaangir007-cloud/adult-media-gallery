const gallery      = document.getElementById('gallery');
const searchInput  = document.getElementById('searchInput');
const searchClear  = document.getElementById('searchClear');
const mediaCount   = document.getElementById('mediaCount');
const sectionTitle = document.getElementById('sectionTitle');
const heroBanner   = document.getElementById('heroBanner');

let allMedia      = [];
let currentFilter = 'all';

/* ══════════ INIT ══════════ */
async function init() {
  showSkeletons(10);
  try {
    const res  = await fetch('/api/public/media');
    const data = await res.json();
    allMedia   = Array.isArray(data) ? data : (data.media || []);
    // Hide hero if no media
    if (allMedia.length === 0 && heroBanner) heroBanner.style.display = 'none';
    applyFilter();
  } catch (err) {
    gallery.innerHTML = `
      <div class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><circle cx="12" cy="16" r="1" fill="currentColor"/>
        </svg>
        Failed to load content. Please try again later.
      </div>`;
  }
}

/* ══════════ FILTER TABS ══════════ */
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

/* ══════════ SEARCH ══════════ */
searchInput?.addEventListener('input', e => {
  const q = e.target.value.trim();
  searchClear && (searchClear.style.display = q ? 'block' : 'none');
  applyFilter(q);
});

searchClear?.addEventListener('click', () => {
  searchInput.value = '';
  searchClear.style.display = 'none';
  applyFilter('');
});

/* ══════════ APPLY FILTER ══════════ */
function applyFilter(query = '') {
  let list = allMedia;
  if (currentFilter !== 'all') list = list.filter(m => m.fileType === currentFilter);
  if (query) {
    const q = query.toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }
  renderGallery(list);
}

/* ══════════ RENDER GALLERY ══════════ */
function renderGallery(list) {
  if (mediaCount) mediaCount.textContent = `${list.length} item${list.length !== 1 ? 's' : ''}`;
  if (!list.length) {
    gallery.innerHTML = `
      <div class="no-results">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        No results found. Try a different search or filter.
      </div>`;
    return;
  }
  gallery.innerHTML = '';
  list.forEach(item => gallery.appendChild(buildCard(item)));
}

/* ══════════ BUILD CARD ══════════ */
function buildCard(item) {
  const card    = document.createElement('div');
  card.className = 'media-card';
  const isVideo = item.fileType === 'video';

  card.innerHTML = `
    <div class="thumb-wrap">
      ${isVideo
        ? `<video src="${item.fileUrl}" muted loop preload="none" playsinline></video>`
        : `<img src="${item.fileUrl}" alt="${esc(item.title)}" loading="lazy">`
      }
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
        ${item.createdAt ? `<span class="meta-sep">•</span><span class="meta-date">${timeAgo(new Date(item.createdAt))}</span>` : ''}
      </div>
      ${item.tags?.length
        ? `<div class="media-tags">${item.tags.slice(0,4).map(t=>`<span class="tag-chip">${esc(t)}</span>`).join('')}</div>`
        : ''}
    </div>
  `;

  // Hover video preview
  if (isVideo) {
    const video   = card.querySelector('video');
    const overlay = card.querySelector('.thumb-overlay');
    card.addEventListener('mouseenter', () => {
      video.play().catch(()=>{});
      overlay.style.opacity = '0';
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      overlay.style.opacity = '1';
    });
  }

  card.addEventListener('click', () => { window.location.href = `/view?id=${item._id}`; });
  return card;
}

/* ══════════ SKELETONS ══════════ */
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

/* ══════════ HELPERS ══════════ */
function esc(s) {
  return (s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function timeAgo(d) {
  const s = Math.floor((Date.now()-d)/1000);
  if (s < 60)      return 'just now';
  if (s < 3600)    return `${Math.floor(s/60)}m ago`;
  if (s < 86400)   return `${Math.floor(s/3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s/86400)}d ago`;
  if (s < 31536000)return `${Math.floor(s/2592000)}mo ago`;
  return `${Math.floor(s/31536000)}y ago`;
}

/* ══════════ START ══════════ */
init();
