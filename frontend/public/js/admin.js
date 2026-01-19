// ===============================
// ADMIN AUTH + DASHBOARD SCRIPT
// ===============================

// Elements
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");
const statusText = document.getElementById("upload-status");

// On page load: check token
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("adminToken");
  if (token) {
    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
  }
});

// ===============================
// LOGIN FUNCTION
// ===============================
function login() {
  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  fetch("/admin/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ username, password })
  })
    .then(res => res.json())
    .then(data => {
      if (data.token) {
        localStorage.setItem("adminToken", data.token);
        loginSection.classList.add("hidden");
        dashboardSection.classList.remove("hidden");
      } else {
        alert("Invalid credentials");
      }
    })
    .catch(() => {
      alert("Login failed. Server error.");
    });
}

// ===============================
// UPLOAD FUNCTION
// ===============================
function upload() {
  const token = localStorage.getItem("adminToken");
  if (!token) {
    alert("Not authenticated");
    return;
  }

  const title = document.getElementById("title").value.trim();
  const tags = document.getElementById("tags").value.trim();
  const fileInput = document.getElementById("file");

  if (!title || !fileInput.files.length) {
    alert("Title and file are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("tags", tags);
  formData.append("file", fileInput.files[0]);

  statusText.innerText = "Uploading...";

  fetch("/admin/upload", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    },
    body: formData
  })
    .then(res => res.json())
    .then(data => {
      if (data.success) {
        statusText.innerText = "Upload successful ✅";
        document.getElementById("title").value = "";
        document.getElementById("tags").value = "";
        fileInput.value = "";
      } else {
        statusText.innerText = "Upload failed ❌";
      }
    })
    .catch(() => {
      statusText.innerText = "Server error during upload ❌";
    });
}

// ===============================
// LOGOUT (OPTIONAL)
// ===============================
function logout() {
  localStorage.removeItem("adminToken");
  dashboardSection.classList.add("hidden");
  loginSection.classList.remove("hidden");
}
