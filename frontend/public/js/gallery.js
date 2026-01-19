const API_URL = window.location.origin;
const gallery = document.getElementById("gallery");
const searchInput = document.getElementById("search");

let mediaData = [];

async function fetchMedia() {
  try {
    const res = await fetch(`${API_URL}/api/public/media`);
    mediaData = await res.json();
    renderMedia(mediaData);
  } catch (err) {
    console.error("Failed to load media", err);
  }
}

function renderMedia(data) {
  gallery.innerHTML = "";

  if (data.length === 0) {
    gallery.innerHTML = "<p style='opacity:0.6'>No media found.</p>";
    return;
  }

  data.forEach(media => {
    const card = document.createElement("div");
    card.className = "media-card";

    let mediaElement;

    if (media.type === "video") {
      mediaElement = document.createElement("video");
      mediaElement.src = media.url;
      mediaElement.controls = true;
    } else {
      mediaElement = document.createElement("img");
      mediaElement.src = media.url;
    }

    const info = document.createElement("div");
    info.className = "media-info";
    info.textContent = media.title || "Untitled";

    card.appendChild(mediaElement);
    card.appendChild(info);
    gallery.appendChild(card);
  });
}

searchInput.addEventListener("input", e => {
  const query = e.target.value.toLowerCase();
  const filtered = mediaData.filter(item =>
    item.title?.toLowerCase().includes(query) ||
    item.tags?.join(" ").toLowerCase().includes(query)
  );
  renderMedia(filtered);
});

fetchMedia();
