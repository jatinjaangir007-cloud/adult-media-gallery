document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');

  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || 'Login failed');
        return;
      }

      // ✅ ONLY set this on SUCCESS
      localStorage.setItem('isAdmin', 'true');

      // ✅ redirect ONCE
      window.location.href = '/dashboard';
    } catch (err) {
      console.error('Login error:', err);
      alert('Server error');
    }
  });
});

