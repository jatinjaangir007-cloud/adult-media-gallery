const loginBtn = document.querySelector('button');

loginBtn.addEventListener('click', async () => {
  const username = document.querySelector('#username').value;
  const password = document.querySelector('#password').value;

  try {
    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem('isAdmin', 'true');
      window.location.href = '/admin/dashboard';
    } else {
      alert('Login failed');
    }
  } catch (err) {
    console.error(err);
    alert('Server error');
  }
});
