const gallery     = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');
const mediaCount  = document.getElementById('mediaCount');
const sectionTitle = document.getElementById('sectionTitle');

let allMedia      = [];
let currentFilter = 'all';

// ===================== INIT =====================
async function init() {
  showSkeletons();
  try {
    const res  = await fetch('/api/public/media');
    const data = await res.json();
    allMedia   = Array.isArray(data) ? data : (data.media || []);
    applyFilter();
  } catch (err) {
    gallery.innerHTML = '<p class="no-results">Failed to load media. Please try again later.</p>';
  }
}

// ===================== FILTER TABS =====================
document.querySelectorAll('.ftab').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.ftab').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentFilter = btn.dataset.filter;
    const q = searchInput.value.trim();
    applyFilter(q);

    const titles = { all: '🔥 Latest Uploads', video: '▶ Videos', image: '📷 Photos' };
    if (sectionTitle) sectionTitle.textContent = titles[currentFilter] || '🔥 Latest Uploads';
  });
});

// ===================== SEARCH =====================
searchInput?.addEventListener('input', e => {
  applyFilter(e.target.value.trim());
});

// ===================== APPLY FILTER + SEARCH =====================
function applyFilter(query = '') {
  let list = allMedia;

  if (currentFilter !== 'all') {
    list = list.filter(m => m.fileType === currentFilter);
  }

  if (query) {
    const q = query.toLowerCase();
    list = list.filter(m =>
      m.title.toLowerCase().includes(q) ||
      (m.tags || []).some(t => t.toLowerCase().includes(q))
    );
  }

  renderGallery(list);
}

// ===================== RENDER GALLERY =====================
function renderGallery(list) {
  if (mediaCount) mediaCount.textContent = `${list.length} item${list.length !== 1 ? 's' : ''}`;

  if (!list.length) {
    gallery.innerHTML = '<p class="no-results">No results found. Try a different search or filter.</p>';
    return;
  }

  gallery.innerHTML = '';
  list.forEach(item => gallery.appendChild(buildCard(item)));
}

// ===================== BUILD CARD =====================
function buildCard(item) {
  const card = document.createElement('div');
  card.className = 'media-card';

  const isVideo = item.fileType === 'video';
  const dateStr = item.createdAt ? timeAgo(new Date(item.createdAt)) : '';

  const tagsHtml = (item.tags && item.tags.length)
    ? item.tags.slice(0, 4).map(t => `<span class="tag-chip">${escHtml(t)}</span>`).join('')
    : '';

  const thumbHtml = isVideo
    ? `<video src="${item.fileUrl}" muted loop preload="none" playsinline></video>`
    : `<img src="${item.fileUrl}" alt="${escHtml(item.title)}" loading="lazy">`;

  card.innerHTML = `
    <div class="thumb-wrap">
      ${thumbHtml}
      <div class="thumb-overlay">
        <div class="play-btn">${isVideo ? '&#9654;' : '&#128269;'}</div>
      </div>
      <span class="badge-type ${isVideo ? 'badge-video' : 'badge-image'}">${isVideo ? 'Video' : 'Photo'}</span>
      <span class="badge-hd">HD</span>
    </div>
    <div class="media-info">
      <div class="media-title">${escHtml(item.title)}</div>
      <div class="media-meta">
        <span class="meta-type ${isVideo ? 'video' : 'image'}">${isVideo ? 'Video' : 'Photo'}</span>
        ${dateStr ? `<span class="meta-dot">•</span><span class="meta-date">${dateStr}</span>` : ''}
      </div>
      ${tagsHtml ? `<div class="media-tags">${tagsHtml}</div>` : ''}
    </div>
  `;

  // Hover preview for videos
  if (isVideo) {
    const video   = card.querySelector('video');
    const overlay = card.querySelector('.thumb-overlay');

    card.addEventListener('mouseenter', () => {
      video.play().catch(() => {});
      overlay.style.opacity = '0';
    });
    card.addEventListener('mouseleave', () => {
      video.pause();
      video.currentTime = 0;
      overlay.style.opacity = '1';
    });
  }

  card.addEventListener('click', () => {
    window.location.href = `/view?id=${item._id}`;
  });

  return card;
}

// ===================== SKELETON LOADER =====================
function showSkeletons(count = 8) {
  gallery.innerHTML = Array(count).fill(`
    <div class="skeleton-card">
      <div class="skeleton-thumb"></div>
      <div class="skeleton-lines">
        <div class="skeleton-line"></div>
        <div class="skeleton-line short"></div>
      </div>
    </div>
  `).join('');
}

// ===================== HELPERS =====================
function escHtml(str) {
  return (str || '').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;');
}

function timeAgo(date) {
  const s = Math.floor((Date.now() - date) / 1000);
  if (s < 60)    return 'just now';
  if (s < 3600)  return `${Math.floor(s/60)}m ago`;
  if (s < 86400) return `${Math.floor(s/3600)}h ago`;
  if (s < 2592000) return `${Math.floor(s/86400)}d ago`;
  if (s < 31536000) return `${Math.floor(s/2592000)}mo ago`;
  return `${Math.floor(s/31536000)}y ago`;
}

// ===================== START =====================
init();
