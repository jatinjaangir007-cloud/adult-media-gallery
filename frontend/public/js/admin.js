document.addEventListener('DOMContentLoaded', () => {
  const loginDiv = document.getElementById('login');
  const dashboard = document.getElementById('dashboard');
  const loginBtn = document.getElementById('login-btn');
  const uploadForm = document.getElementById('upload-form');
  const adminGrid = document.getElementById('admin-media-grid');

  // Check if logged in
  if (document.cookie.includes('adminToken')) {
    loginDiv.classList.add('hidden');
    dashboard.classList.remove('hidden');
    loadAdminMedia();
  } else {
    loginDiv.classList.remove('hidden');
  }

  loginBtn.addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (res.ok) {
      loginDiv.classList.add('hidden');
      dashboard.classList.remove('hidden');
      loadAdminMedia();
    } else {
      alert('Invalid credentials');
    }
  });

  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const formData = new FormData(uploadForm);
    const res = await fetch('/api/admin/media', {
      method: 'POST',
      body: formData
    });
    if (res.ok) {
      loadAdminMedia();
      uploadForm.reset();
    }
  });

  async function loadAdminMedia() {
    const res = await fetch('/api/public/media');
    const media = await res.json();
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
        const id = form.dataset.id;
        const formData = new FormData(form);
        const res = await fetch(`/api/admin/media/${id}`, {
          method: 'PUT',
          body: formData
        });
        if (res.ok) {
          loadAdminMedia();
        }
      });
    });

    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', async () => {
        const id = btn.closest('.edit-form').dataset.id;
        const res = await fetch(`/api/admin/media/${id}`, {
          method: 'DELETE'
        });
        if (res.ok) {
          loadAdminMedia();
        }
      });
    });
  }
});