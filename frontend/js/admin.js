document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  const loginBox = document.getElementById('loginBox');
  const uploadBox = document.getElementById('uploadBox');
  const uploadForm = document.getElementById('uploadForm');
  const logoutBtn = document.getElementById('logoutBtn');

  /* ================= AUTO LOGIN ================= */
  if (localStorage.getItem('isAdmin') === 'true') {
    loginBox.style.display = 'none';
    uploadBox.style.display = 'block';
  }

  /* ================= LOGIN ================= */
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    fetch("/admin/login", {
      method: "POST",
      headers: {
          "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: username.value,
        password: password.value
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        alert("Login successful");
      } else {
        alert(data.message || "Login failed");
      }
    });


    const data = await res.json();

    if (!data.success) {
      alert('Invalid credentials');
      return;
    }

    localStorage.setItem('isAdmin', 'true');
    loginBox.style.display = 'none';
    uploadBox.style.display = 'block';
  });

  /* ================= UPLOAD ================= */
  uploadForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(uploadForm);

    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      body: formData
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Upload failed');
      return;
    }

    alert('Upload successful ✅');
    uploadForm.reset();
  });

  /* ================= LOGOUT ================= */
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('isAdmin');
    location.reload();
  });
});
