document.addEventListener('DOMContentLoaded', () => {
  const ageModal = document.getElementById('age-modal');
  const gallery = document.getElementById('gallery');
  const confirmBtn = document.getElementById('confirm-age');
  const searchInput = document.getElementById('search');
  const mediaGrid = document.getElementById('media-grid');

  // Check age confirmation cookie
  if (document.cookie.includes('ageConfirmed=true')) {
    if (ageModal) ageModal.classList.add('hidden');
    if (gallery) gallery.classList.remove('hidden');
    loadMedia();
  }

  if (confirmBtn) {
    confirmBtn.addEventListener('click', () => {
      document.cookie = 'ageConfirmed=true; max-age=31536000'; // 1 year
      if (ageModal) ageModal.classList.add('hidden');
      if (gallery) gallery.classList.remove('hidden');
      loadMedia();
    });
  }

  if (searchInput) {
    searchInput.addEventListener('input', () => {
      const query = searchInput.value.trim();
      loadMedia(query);
    });
  }

  async function loadMedia(query = '') {
    if (mediaGrid) mediaGrid.innerHTML = '<p>Loading...</p>';
    try {
      const url = query ? `/api/public/media/search?q=${encodeURIComponent(query)}` : '/api/public/media';
      console.log('Fetching media from:', url);  // Debug log
      const res = await fetch(url);
      console.log('Response status:', res.status, 'Content-Type:', res.headers.get('content-type'));  // Debug log
      if (!res.ok) throw new Error(`Failed to load media: ${res.status} ${res.statusText}`);
      
      let media;
      try {
        media = await res.json();  // Try parsing as JSON
      } catch (parseErr) {
        // If not JSON, log the response and throw
        const text = await res.text();
        console.error('Non-JSON response:', text.substring(0, 200));  // Log first 200 chars
        throw new Error('Server returned HTML instead of JSON. Check backend routes.');
      }

      if (mediaGrid) {
        mediaGrid.innerHTML = '';
        if (media.length === 0) {
          mediaGrid.innerHTML = '<p>No media found.</p>';
          return;
        }
        media.forEach(item => {
          const div = document.createElement('div');
          div.className = 'media-item';
         if (item.fileType === 'video') {
           div.innerHTML = `
             <video controls preload="metadata">
                <source src="${item.fileUrl}" type="video/mp4">
             </video>
             <p>${item.title}</p>
           `;
         } else {
           div.innerHTML = `
             <img src="${item.fileUrl}" alt="${item.title}">
             <p>${item.title}</p>
           `;
         }

          mediaGrid.appendChild(div);
        });
      }
    } catch (err) {
      console.error('Load media error:', err);
      if (mediaGrid) mediaGrid.innerHTML = '<p>Error loading media. Check console for details.</p>';
    }
  }
});