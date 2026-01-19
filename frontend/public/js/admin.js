// ===============================
// ELEMENT REFERENCES
// ===============================
const loginForm = document.getElementById("login-form");
const uploadForm = document.getElementById("upload-form");
const loginSection = document.getElementById("login-section");
const dashboardSection = document.getElementById("dashboard-section");

// ===============================
// AUTO CHECK LOGIN (JWT)
// ===============================
const token = localStorage.getItem("adminToken");
if (token) {
  loginSection.classList.add("hidden");
  dashboardSection.classList.remove("hidden");
}

// ===============================
// ADMIN LOGIN
// ===============================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!username || !password) {
    alert("Please enter username and password");
    return;
  }

  try {
    const res = await fetch("/admin/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    if (!res.ok) {
      throw new Error("Invalid credentials");
    }

    const data = await res.json();

    localStorage.setItem("adminToken", data.token);

    loginSection.classList.add("hidden");
    dashboardSection.classList.remove("hidden");
  } catch (err) {
    alert("Invalid username or password");
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

  if (!title || !fileInput.files.length) {
    alert("Title and file are required");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("tags", tags);
  formData.append("file", fileInput.files[0]);

  try {
    const res = await fetch("/admin/upload", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
      },
      body: formData
    });

    if (!res.ok) {
      throw new Error("Upload failed");
    }

    alert("Upload successful");
    uploadForm.reset();
  } catch (err) {
    alert("Upload failed. Please login again.");
    localStorage.removeItem("adminToken");
    location.reload();
  }
});

// ===============================
// LOGOUT (OPTIONAL BUTTON)
// ===============================
const logoutBtn = document.getElementById("logout");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("adminToken");
    location.reload();
  });
}
