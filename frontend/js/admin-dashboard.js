document.addEventListener('DOMContentLoaded', () => {
  const uploadForm = document.getElementById('uploadForm');
  const mediaList = document.getElementById('mediaList');

  async function loadMedia() {
    try {
      const res = await fetch('/media'); // ✅ FIXED
      const data = await res.json();

      mediaList.innerHTML = '';

      if (!data.length) {
        mediaList.innerHTML = '<p>No media uploaded.</p>';
        return;
      }

      data.forEach(item => {
        const div = document.createElement('div');
        div.innerHTML = `<a href="${item.url}" target="_blank">${item.url}</a>`;
        mediaList.appendChild(div);
      });
    } catch {
      mediaList.innerHTML = '<p>Error loading media</p>';
    }
  }

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('media');
    if (!fileInput || !fileInput.files.length) {
      alert('Select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]); // ✅ FIXED

    const res = await fetch('/media/upload', {
      method: 'POST',
      body: formData
    });

    if (res.ok) {
      alert('Upload successful');
      uploadForm.reset();
      loadMedia();
    } else {
      alert('Upload failed');
    }
  });

  loadMedia();
});
