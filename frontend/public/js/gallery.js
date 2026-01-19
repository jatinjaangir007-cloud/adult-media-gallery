document.addEventListener('DOMContentLoaded', () => {
  const ageModal = document.getElementById('age-modal');
  const gallery = document.getElementById('gallery');
  const confirmBtn = document.getElementById('confirm-age');
  const searchInput = document.getElementById('search');
  const mediaGrid = document.getElementById('media-grid');

  // Check age confirmation cookie
  if (document.cookie.includes('ageConfirmed=true')) {
    ageModal.classList.add('hidden');
    gallery.classList.remove('hidden');
    loadMedia();
  }

  confirmBtn.addEventListener('click', () => {
    document.cookie = 'ageConfirmed=true; max-age=31536000'; // 1 year
    ageModal.classList.add('hidden');
    gallery.classList.remove('hidden');
    loadMedia();
  });

  searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    loadMedia(query);
  });

  async function loadMedia(query = '') {
    const url = query ? `/api/public/media/search?q=${encodeURIComponent(query)}` : '/api/public/media';
    const res = await fetch(url);
    const media = await res.json();
    mediaGrid.innerHTML = '';
    media.forEach(item => {
      const div = document.createElement('div');
      div.className = 'media-item';
      if (item.type === 'video') {
        div.innerHTML = `<video controls><source src="${item.cloudUrl}" type="video/mp4"></video><p>${item.title}</p><p>Tags: ${item.tags.join(', ')}</p>`;
      } else {
        div.innerHTML = `<img src="${item.cloudUrl}" alt="${item.title}"><p>${item.title}</p><p>Tags: ${item.tags.join(', ')}</p>`;
      }
      mediaGrid.appendChild(div);
    });
  }
});