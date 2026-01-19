document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");
  const uploadForm = document.getElementById("upload-form");

  // ===== LOGIN =====
  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      try {
        const res = await fetch("/api/admin/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Login failed");
          return;
        }

        localStorage.setItem("adminToken", data.token);
        alert("Login successful");

        loginForm.style.display = "none";
        uploadForm.style.display = "block";
      } catch (err) {
        console.error(err);
        alert("Server error");
      }
    });
  }

  // ===== UPLOAD =====
  if (uploadForm) {
    uploadForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const token = localStorage.getItem("adminToken");
      if (!token) {
        alert("Not authenticated");
        return;
      }

      const formData = new FormData();
      formData.append("title", document.getElementById("title").value);
      formData.append("tags", document.getElementById("tags").value);
      formData.append("file", document.getElementById("file").files[0]);

      try {
        const res = await fetch("/api/admin/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        });

        const data = await res.json();

        if (!res.ok) {
          alert(data.error || "Upload failed");
          return;
        }

        alert("Upload successful");
        uploadForm.reset();
      } catch (err) {
        console.error(err);
        alert("Upload error");
      }
    });
  }
});
