document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const mediaList = document.getElementById("mediaList");

  // LOAD MEDIA
  async function loadMedia() {
    mediaList.innerHTML = "Loading...";
    try {
      const res = await fetch("/media");
      const data = await res.json();

      mediaList.innerHTML = "";

      if (!data.length) {
        mediaList.innerHTML = "<p>No media uploaded.</p>";
        return;
      }

      data.forEach(item => {
        const card = document.createElement("div");
        card.className = "media-card";

        if (item.type.startsWith("video")) {
          card.innerHTML = `
            <video controls src="${item.url}"></video>
            <button class="delete">Delete</button>
          `;
        } else {
          card.innerHTML = `
            <img src="${item.url}" />
            <button class="delete">Delete</button>
          `;
        }

        card.querySelector(".delete").onclick = async () => {
          await fetch(`/media/${item._id}`, { method: "DELETE" });
          loadMedia();
        };

        mediaList.appendChild(card);
      });

    } catch (err) {
      mediaList.innerHTML = "Error loading media";
    }
  }

  // UPLOAD MEDIA
  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("file");
    if (!fileInput || !fileInput.files[0]) {
      return alert("Select a file");
    }

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);

    const res = await fetch("/media/upload", {
      method: "POST",
      body: formData
    });

    if (res.ok) {
      alert("Uploaded successfully");
      uploadForm.reset();
      loadMedia();
    } else {
      alert("Upload failed");
    }
  });

  loadMedia();
});
