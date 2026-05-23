document.addEventListener('DOMContentLoaded', () => {
  const btn   = document.getElementById('loginBtn');
  const errEl = document.getElementById('loginError');

  async function doLogin() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;

    if (!username || !password) {
      errEl.textContent = 'Please enter username and password.';
      errEl.classList.remove('hidden');
      return;
    }

    btn.textContent = 'Signing in…';
    btn.disabled = true;
    errEl.classList.add('hidden');

    try {
      const res  = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await res.json();

      if (!res.ok) {
        errEl.textContent = data.message || 'Invalid credentials.';
        errEl.classList.remove('hidden');
        btn.textContent = 'Sign In';
        btn.disabled = false;
        return;
      }

      localStorage.setItem('isAdmin',    'true');
      localStorage.setItem('adminToken', data.token);
      window.location.href = '/dashboard';

    } catch (err) {
      errEl.textContent = 'Server error. Please try again.';
      errEl.classList.remove('hidden');
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }
  }

  btn.addEventListener('click', doLogin);

  // Allow Enter key
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') doLogin();
  });
});
