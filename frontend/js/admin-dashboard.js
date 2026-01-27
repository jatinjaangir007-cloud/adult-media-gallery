document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const mediaList = document.getElementById("mediaList");

  const uploadStatus = document.getElementById("uploadStatus");
  const uploadBar = document.getElementById("uploadBar");
  const uploadText = document.getElementById("uploadText");
  const uploadSize = document.getElementById("uploadSize");
  const pauseBtn = document.getElementById("pauseBtn");
  const resumeBtn = document.getElementById("resumeBtn");

  const token = localStorage.getItem("token");
  if (!token) window.location.href = "/admin";

  let xhr = null;
  let lastFormData = null;

  function formatMB(bytes) {
    return (bytes / (1024 * 1024)).toFixed(2) + " MB";
  }

  async function loadMedia() {
    const res = await fetch("/media");
    const data = await res.json();
    mediaList.innerHTML = "";

    data.forEach(item => {
      const card = document.createElement("div");
      card.className = "media-card";
      card.innerHTML = `
        ${item.fileType === "video"
          ? `<video controls src="${item.fileUrl}"></video>`
          : `<img src="${item.fileUrl}">`}
        <h4>${item.title}</h4>
        <div class="tags">${(item.tags || []).join(", ")}</div>
        <button class="delete">Delete</button>
      `;

      card.querySelector(".delete").onclick = async () => {
        if (!confirm("Delete this media?")) return;
        await fetch(`/media/${item._id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` }
        });
        loadMedia();
      };

      mediaList.appendChild(card);
    });
  }

  function startUpload(formData) {
    xhr = new XMLHttpRequest();
    xhr.open("POST", "/media/upload", true);
    xhr.setRequestHeader("Authorization", `Bearer ${token}`);

    uploadStatus.style.display = "block";

    xhr.upload.onprogress = (e) => {
      if (!e.lengthComputable) return;

      const percent = Math.round((e.loaded / e.total) * 100);
      uploadBar.style.width = percent + "%";
      uploadText.textContent = `Uploading ${percent}%`;
      uploadSize.textContent =
        `${formatMB(e.loaded)} / ${formatMB(e.total)}`;

      localStorage.setItem("uploadProgress", percent);
    };

    xhr.onload = () => {
      uploadText.textContent = "Upload completed ✅";
      pauseBtn.style.display = "none";
      resumeBtn.style.display = "none";
      localStorage.removeItem("uploadProgress");
      uploadForm.reset();
      loadMedia();
    };

    xhr.onerror = () => {
      uploadText.textContent = "Upload failed ❌";
    };

    xhr.send(formData);
  }

  pauseBtn.onclick = () => {
    if (xhr) {
      xhr.abort();
      uploadText.textContent = "Upload paused ⏸";
      pauseBtn.style.display = "none";
      resumeBtn.style.display = "inline-block";
    }
  };

  resumeBtn.onclick = () => {
    if (lastFormData) {
      uploadText.textContent = "Resuming upload...";
      pauseBtn.style.display = "inline-block";
      resumeBtn.style.display = "none";
      startUpload(lastFormData); // restarts upload
    }
  };

  uploadForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("media");
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("title", document.getElementById("title").value);
    formData.append("tags", document.getElementById("tags").value);

    lastFormData = formData;
    startUpload(formData);
  });

  loadMedia();
});
