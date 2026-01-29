document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  try {
    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      alert("Invalid credentials");
      return;
    }

    // ✅ Redirect to REAL route
    window.location.href = "/admin/dashboard";

  } catch (err) {
    alert("Server error");
  }
});
