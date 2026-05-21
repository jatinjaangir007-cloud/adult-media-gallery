const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');

async function fetchMedia(query = '') {
  try {
    const url = query
      ? `/api/public/media/search?q=${encodeURIComponent(query)}`
      : `/api/public/media`;

    const res = await fetch(url);
    const data = await res.json();
    const mediaList = Array.isArray(data) ? data : data.media;

    gallery.innerHTML = '';

    if (!mediaList || mediaList.length === 0) {
      gallery.innerHTML = '<p class="no-results">No media found.</p>';
      return;
    }

    mediaList.forEach(item => renderCard(item));

  } catch (err) {
    console.error('Failed to load media', err);
    gallery.innerHTML = '<p class="no-results">Error loading media.</p>';
  }
}

function renderCard(item) {
  const card = document.createElement('div');
  card.className = 'media-card';

  if (item.fileType === 'image') {
    card.innerHTML = `
      <div class="thumb-wrap">
        <img src="${item.fileUrl}" alt="${item.title}" loading="lazy">
        <div class="thumb-overlay">
          <div class="play-btn">&#128269;</div>
        </div>
      </div>
      <div class="media-info">
        <h3 class="media-title">${item.title}</h3>
        ${item.tags?.length ? `<p class="media-tags">${item.tags.join(' &bull; ')}</p>` : ''}
      </div>
    `;
  } else if (item.fileType === 'video') {
    card.innerHTML = `
      <div class="thumb-wrap">
        <video src="${item.fileUrl}" muted loop preload="none" playsinline></video>
        <div class="thumb-overlay">
          <div class="play-btn">&#9654;</div>
        </div>
      </div>
      <div class="media-info">
        <h3 class="media-title">${item.title}</h3>
        ${item.tags?.length ? `<p class="media-tags">${item.tags.join(' &bull; ')}</p>` : ''}
      </div>
    `;

    const video = card.querySelector('video');
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

  // Click opens viewer page
  card.addEventListener('click', () => {
    window.location.href = `/view?id=${item._id}`;
  });

  gallery.appendChild(card);
}

// Search
searchInput?.addEventListener('input', e => {
  fetchMedia(e.target.value.trim());
});

// Initial load
fetchMedia();
