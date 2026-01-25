document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const usernameEl = document.getElementById("username");
    const passwordEl = document.getElementById("password");

    if (!usernameEl || !passwordEl) {
      alert("Login inputs not found");
      return;
    }

    const username = usernameEl.value.trim();
    const password = passwordEl.value.trim();

    if (!username || !password) {
      alert("Missing credentials");
      return;
    }

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed");
        return;
      }

      // ✅ THIS WAS MISSING (CRITICAL)
      localStorage.setItem("token", data.token);

      // optional sanity check
      console.log("JWT stored:", data.token);

      // redirect AFTER token is saved
      window.location.href = "/admin/dashboard";

    } catch (err) {
      console.error("Login error:", err);
      alert("Server error during login");
    }
  });
});
