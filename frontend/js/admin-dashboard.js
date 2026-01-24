document.addEventListener('DOMContentLoaded', () => {
  const loginDiv = document.getElementById('login');
  const dashboard = document.getElementById('dashboard');
  const loginBtn = document.getElementById('login-btn');
  const uploadForm = document.getElementById('upload-form');
  const adminGrid = document.getElementById('admin-media-grid');

  // Check if logged in
  if (document.cookie.includes('adminToken')) {
    if (loginDiv) loginDiv.classList.add('hidden');
    if (dashboard) dashboard.classList.remove('hidden');
    loadAdminMedia();
  } else {
    if (loginDiv) loginDiv.classList.remove('hidden');
  }

  if (loginBtn) {
    loginBtn.addEventListener('click', async () => {
      const usernameInput = document.getElementById('username');
      const passwordInput = document.getElementById('password');
      if (!usernameInput || !passwordInput) {
        alert('Login form elements not found. Please refresh the page.');
        return;
      }
      const username = usernameInput.value;
      const password = passwordInput.value;
      try {
        const res = await fetch('/api/admin/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (res.ok) {
          if (loginDiv) loginDiv.classList.add('hidden');
          if (dashboard) dashboard.classList.remove('hidden');
          loadAdminMedia();
        } else {
          const error = await res.text();
          alert(`Login failed: ${error}`);
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Login failed. Check console for details.');
      }
    });
  }

  if (uploadForm) {
    uploadForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.querySelector('#upload-form input[name="media"]');
      if (!fileInput || !fileInput.files || fileInput.files.length === 0) {
        alert('No file selected. Please choose a file to upload.');
        return;
      }
      try {
        const formData = new FormData(uploadForm);
        const res = await fetch('/api/admin/media', {  // Correct URL for upload
          method: 'POST',
          body: formData
        });
        if (res.ok) {
          loadAdminMedia();
          uploadForm.reset();
          alert('Upload successful!');
        } else {
          const error = await res.text();
          alert(`Upload failed: ${error}`);
        }
      } catch (err) {
        console.error('Upload error:', err);
        alert('Upload failed. Check console for details.');
      }
    });
  }

  async function loadAdminMedia() {
    try {
      const res = await fetch('/api/public/media');
      const media = await res.json();
      if (adminGrid) {
        adminGrid.innerHTML = '';
        media.forEach(item => {
          const div = document.createElement('div');
          div.className = 'media-item';
          div.innerHTML = `
            <img src="${item.cloudUrl}" alt="${item.title}" style="max-width:100px;">
            <p>${item.title}</p>
            <form class="edit-form" data-id="${item._id}">
              <input type="text" name="title" value="${item.title}" required>
              <input type="text" name="tags" value="${item.tags.join(', ')}">
              <button type="submit">Edit</button>
              <button type="button" class="delete-btn">Delete</button>
            </form>
          `;
          adminGrid.appendChild(div);
        });

        // Attach edit/delete handlers
        document.querySelectorAll('.edit-form').forEach(form => {
          form.addEventListener('submit', async (e) => {
            e.preventDefault();
            try {
              const id = form.dataset.id;
              const title = form.querySelector('[name="title"]').value;
              const tags = form.querySelector('[name="tags"]').value;
              const res = await fetch(`/api/admin/media/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, tags })
              });
              if (res.ok) {
                loadAdminMedia();
                alert('Edit successful!');
              } else {
                const error = await res.text();
                alert(`Edit failed: ${error}`);
              }
            } catch (err) {
              console.error('Edit error:', err);
              alert('Edit failed. Check console for details.');
            }
          });
        });

        document.querySelectorAll('.delete-btn').forEach(btn => {
          btn.addEventListener('click', async () => {
            try {
              const id = btn.closest('.edit-form').dataset.id;
              const res = await fetch(`/api/admin/media/${id}`, {
                method: 'DELETE'
              });
              if (res.ok) {
                loadAdminMedia();
                alert('Delete successful!');
              } else {
                const error = await res.text();
                alert(`Delete failed: ${error}`);
              }
            } catch (err) {
              console.error('Delete error:', err);
              alert('Delete failed. Check console for details.');
            }
          });
        });
      }
    } catch (err) {
      console.error('Load media error:', err);
      if (adminGrid) adminGrid.innerHTML = '<p>Error loading media.</p>';
    }
  }
});