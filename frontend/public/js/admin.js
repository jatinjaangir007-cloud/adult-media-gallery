document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const uploadForm = document.getElementById("uploadForm");
  const loginBox = document.getElementById("loginBox");
  const uploadBox = document.getElementById("uploadBox");
  const logoutBtn = document.getElementById("logoutBtn");

  // ===============================
  // AUTH CHECK
  // ===============================
  const token = localStorage.getItem("adminToken");
  if (token) {
    loginBox.style.display = "none";
    uploadBox.style.display = "block";
  }

  // ===============================
  // LOGIN
  // ===============================
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      localStorage.setItem("adminToken", data.token);
      location.reload();

    } catch (err) {
      console.error(err);
      alert("Server error during login");
    }
  });

  // ===============================
  // UPLOAD MEDIA
  // ===============================
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const tags = document.getElementById("tags").value.trim();
    const fileInput = document.getElementById("file");

    if (!fileInput.files.length) {
      alert("Please choose a file");
      return;
    }

    const file = fileInput.files[0];

    // IMPORTANT: backend expects "photo" or "video"
    const mediaType = file.type.startsWith("video/")
      ? "video"
      : "photo";

    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("type", mediaType);
    formData.append("file", file);

    try {
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("adminToken")
        },
        body: formData
      });

      const data = await res.json();

      if (!res.ok) {
        console.error(data);
        alert(data.message || "Upload failed");
        return;
      }

      alert("Upload successful ✅");
      uploadForm.reset();

    } catch (err) {
      console.error(err);
      alert("Server error during upload");
    }
  });

  // ===============================
  // LOGOUT
  // ===============================
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    location.reload();
  });

});
