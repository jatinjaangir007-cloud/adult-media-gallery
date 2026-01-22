document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginBox = document.getElementById('loginBox');
  const uploadBox = document.getElementById('uploadBox');
  const logoutBtn = document.getElementById('logoutBtn');

  // =====================
  // AUTO LOGIN CHECK
  // =====================
  if (localStorage.getItem('isAdmin') === 'true') {
    loginBox.style.display = 'none';
    uploadBox.style.display = 'block';
  }

  // =====================
  // LOGIN
  // =====================
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!data.success) {
        alert('Invalid username or password');
        return;
      }

      // SAVE SESSION
      localStorage.setItem('isAdmin', 'true');

      // SHOW DASHBOARD
      loginBox.style.display = 'none';
      uploadBox.style.display = 'block';

    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  });

  // =====================
  // LOGOUT
  // =====================
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    location.reload();
  });
});
