// ===============================
// VelvetHub Admin Panel Script
// ===============================

const API_BASE = "/api/admin";

// -------------------------------
// Elements
// -------------------------------
const loginForm = document.getElementById("login-form");
const uploadForm = document.getElementById("upload-form");
const dashboard = document.getElementById("dashboard");

// -------------------------------
// JWT helpers
// -------------------------------
function setToken(token) {
  localStorage.setItem("admin_token", token);
}

function getToken() {
  return localStorage.getItem("admin_token");
}

function logout() {
  localStorage.removeItem("admin_token");
  location.reload();
}

// -------------------------------
// LOGIN
// -------------------------------
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      setToken(data.token);

      loginForm.style.display = "none";
      dashboard.style.display = "block";
    } catch (err) {
      console.error(err);
      alert("Server error during login");
    }
  });
}

// -------------------------------
// AUTO LOGIN CHECK
// -------------------------------
if (getToken()) {
  if (loginForm) loginForm.style.display = "none";
  if (dashboard) dashboard.style.display = "block";
}

// -------------------------------
// UPLOAD MEDIA
// -------------------------------
if (uploadForm) {
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const title = document.getElementById("title").value.trim();
    const tags = document.getElementById("tags").value.trim();
    const fileInput = document.getElementById("file");

    if (!fileInput.files.length) {
      alert("Please select a file");
      return;
    }

    const file = fileInput.files[0];

    // ✅ FIXED TYPE LOGIC
    let mediaType = "";
    if (file.type.startsWith("image/")) mediaType = "photo";
    else if (file.type.startsWith("video/")) mediaType = "video";
    else {
      alert("Only image or video allowed");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("tags", tags);
    formData.append("type", mediaType); // ✅ MUST MATCH SCHEMA
    formData.append("file", file);

    try {
      const res = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
        body: formData,
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
}
