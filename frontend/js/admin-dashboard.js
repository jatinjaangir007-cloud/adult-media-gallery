document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const mediaList = document.getElementById('mediaList');

  if (!uploadForm || !mediaList) {
    console.error('Dashboard elements not found');
    return;
  }

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('media');
    if (!fileInput || !fileInput.files.length) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);

    try {
      const res = await fetch('/media/upload', {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt);
      }

      alert('Upload successful');
      uploadForm.reset();
      loadMedia();

    } catch (err) {
      console.error('Upload error:', err);
      alert('Upload failed');
    }
  });

  async function loadMedia() {
    try {
      const res = await fetch('/media');
      const media = await res.json();

      mediaList.innerHTML = '';
      media.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<a href="${item.url}" target="_blank">${item.url}</a>`;
        mediaList.appendChild(div);
      });
    } catch (err) {
      console.error('Load error:', err);
      mediaList.innerHTML = '<p>Error loading media</p>';
    }
  }

  loadMedia();
});
