document.addEventListener("DOMContentLoaded", () => {

  const loginForm = document.getElementById("loginForm");
  const uploadForm = document.getElementById("uploadForm");
  const loginBox = document.getElementById("loginBox");
  const uploadBox = document.getElementById("uploadBox");
  const logoutBtn = document.getElementById("logoutBtn");

  // SAFETY CHECK (prevents ALL null errors)
  if (!loginForm || !loginBox || !uploadBox) {
    console.error("Admin HTML IDs are missing");
    return;
  }

  // AUTH CHECK
  const token = localStorage.getItem("adminToken");
  if (token) {
    loginBox.style.display = "none";
    uploadBox.style.display = "block";
  }

  // LOGIN
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

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
  });

  // UPLOAD
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("file");
    if (!fileInput.files.length) {
      alert("Select a file");
      return;
    }

    const file = fileInput.files[0];
    const type = file.type.startsWith("video/") ? "video" : "photo";

    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("tags", document.getElementById("tags").value);
    formData.append("type", type);
    formData.append("file", file);

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
      alert("Upload failed");
      return;
    }

    alert("Upload successful ✅");
    uploadForm.reset();
  });

  // LOGOUT
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    location.reload();
  });

});
