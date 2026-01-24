document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const mediaList = document.getElementById('mediaList');

  async function loadMedia() {
    try {
      const res = await fetch('/api/admin/media');
      const data = await res.json();

      mediaList.innerHTML = '';

      if (!data.length) {
        mediaList.innerHTML = '<p>No media uploaded.</p>';
        return;
      }

      data.forEach(item => {
        const el = document.createElement('div');
        el.innerHTML = `<a href="${item.url}" target="_blank">${item.url}</a>`;
        mediaList.appendChild(el);
      });
    } catch (err) {
      mediaList.innerHTML = '<p>Error loading media</p>';
    }
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('media');
    if (!fileInput.files.length) return alert('Select a file');

    const formData = new FormData();
    formData.append('media', fileInput.files[0]);

    const res = await fetch('/api/admin/media/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Upload successful');
      loadMedia();
    } else {
      alert('Upload failed');
    }
  });

  loadMedia();
});
