const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search");

let mediaData = [];

async function fetchMedia() {
  try {
    // ✅ PUBLIC API (NOT admin)
    const res = await fetch('/api/media');

    if (!res.ok) {
      throw new Error('Failed to fetch media');
    }

    mediaData = await res.json();
    renderMedia(mediaData);

  } catch (err) {
    console.error('Failed to load media', err);
  }
}

function renderMedia(data) {
  gallery.innerHTML = "";

  if (!data.length) {
    gallery.innerHTML = "<p style='opacity:0.6'>No media found.</p>";
    return;
  }

  data.forEach(media => {
    const card = document.createElement("div");
    card.className = "media-card";

    let el;
    if (media.fileType === "video") {
      el = document.createElement("video");
      el.src = media.fileUrl;
      el.controls = true;
    } else {
      el = document.createElement("img");
      el.src = media.fileUrl;
    }

    const title = document.createElement("div");
    title.className = "media-info";
    title.textContent = media.title || "Untitled";

    card.appendChild(el);
    card.appendChild(title);
    gallery.appendChild(card);
  });
}

searchInput.addEventListener("input", e => {
  const q = e.target.value.toLowerCase();
  renderMedia(
    mediaData.filter(m =>
      m.title?.toLowerCase().includes(q)
    )
  );
});

fetchMedia();
