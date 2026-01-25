const gallery = document.getElementById('gallery');
const searchInput = document.getElementById('searchInput');

async function fetchMedia(query = '') {
  try {
    const url = query
      ? `/api/public/media/search?q=${encodeURIComponent(query)}`
      : `/api/public/media`;

    console.log('Fetching media from:', url);

    const res = await fetch(url);
    const data = await res.json();

    console.log('Media response:', data);

    // ✅ FIX: handle wrapped response
    const mediaList = Array.isArray(data) ? data : data.media;

    gallery.innerHTML = '';

    if (!mediaList || mediaList.length === 0) {
      gallery.innerHTML = '<p>No media found.</p>';
      return;
    }

    mediaList.forEach(item => {
      const card = document.createElement('div');
      card.className = 'media-card';

      if (item.fileType === 'image') {
        card.innerHTML = `
          <img src="${item.fileUrl}" alt="${item.title}">
          <h3>${item.title}</h3>
        `;
      } else if (item.fileType === 'video') {
        card.innerHTML = `
          <video src="${item.fileUrl}" controls></video>
          <h3>${item.title}</h3>
        `;
      }

      gallery.appendChild(card);
    });

  } catch (err) {
    console.error('Failed to load media', err);
    gallery.innerHTML = '<p>Error loading media.</p>';
  }
}

// search
searchInput?.addEventListener('input', e => {
  fetchMedia(e.target.value.trim());
});

// initial load
fetchMedia();
