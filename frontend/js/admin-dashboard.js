const uploadForm = document.getElementById('uploadForm');
const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');

uploadForm.addEventListener('submit', (e) => {
  e.preventDefault();

  const title = document.getElementById('title').value;
  const tags = document.getElementById('tags').value;
  const fileInput = document.getElementById('file');

  if (!fileInput.files.length) {
    alert('Please select a file');
    return;
  }

  const file = fileInput.files[0];
  const formData = new FormData();

  formData.append('file', file);
  formData.append('title', title);
  formData.append('tags', tags);

  const xhr = new XMLHttpRequest();

  // ✅ FIXED URL — THIS IS THE CORE BUG
  xhr.open('POST', '/api/admin/media/upload', true);

  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = ((e.loaded / e.total) * 100).toFixed(2);
      progressBar.style.width = percent + '%';
      progressText.innerText = `${(e.loaded / 1024 / 1024).toFixed(2)} MB / ${(e.total / 1024 / 1024).toFixed(2)} MB`;
    }
  };

  xhr.onload = () => {
    if (xhr.status === 200) {
      statusText.innerHTML = 'Upload completed ✅';
      progressBar.style.width = '100%';
    } else {
      statusText.innerHTML = 'Upload failed ❌';
      console.error(xhr.responseText);
    }
  };

  xhr.onerror = () => {
    statusText.innerHTML = 'Upload failed ❌';
  };

  xhr.send(formData);
});
