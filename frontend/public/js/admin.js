document.addEventListener('DOMContentLoaded', () => {

  const uploadForm = document.getElementById('uploadForm');
  const logoutBtn = document.getElementById('logoutBtn');

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const formData = new FormData(uploadForm);

      try {
        const res = await fetch('/api/admin/upload', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (!res.ok) {
          console.error(data);
          alert('Upload failed');
          return;
        }

        alert('Upload successful');
        uploadForm.reset();

      } catch (err) {
        console.error(err);
        alert('Server error');
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener('click', () => {
      localStorage.removeItem('adminToken');
      location.reload();
    });
  }

});
