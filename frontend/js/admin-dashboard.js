document.addEventListener("DOMContentLoaded", () => {
  const uploadForm = document.getElementById("uploadForm");
  const mediaList = document.getElementById("mediaList");
  const token = localStorage.getItem("token");

     if (!token) {
       window.location.href = "/admin";
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
           headers: {
             Authorization: `Bearer ${token}`
           }
        });

        loadMedia();
      };

      mediaList.appendChild(card);
    });
  }

  uploadForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fileInput = document.getElementById("media");
    const title = document.getElementById("title").value;
    const tags = document.getElementById("tags").value;

    const formData = new FormData();
    formData.append("file", fileInput.files[0]);
    formData.append("title", title);
    formData.append("tags", tags);

   await fetch("/media/upload", {
     method: "POST",
     headers: {
        Authorization: `Bearer ${token}`
     },
     body: formData
   });

    uploadForm.reset();
    loadMedia();
  });

  loadMedia();
});
