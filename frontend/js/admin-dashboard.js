document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('uploadForm');
  const progressBar = document.getElementById('progressBar');
  const progressText = document.getElementById('progressText');
  const statusText = document.getElementById('statusText');

  if (!form) {
    console.error('Upload form not found');
    return;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const fileInput = document.getElementById('file');
    const title = document.getElementById('title').value;
    const tags = document.getElementById('tags').value;

    if (!fileInput.files.length) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('title', title);
    formData.append('tags', tags);

    const xhr = new XMLHttpRequest();

    // ✅ CORRECT ENDPOINT
    xhr.open('POST', '/api/admin/media/upload');

    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable) {
        const percent = Math.round((e.loaded / e.total) * 100);
        progressBar.style.width = percent + '%';
        progressText.innerText =
          `${(e.loaded / 1024 / 1024).toFixed(2)} MB / ${(e.total / 1024 / 1024).toFixed(2)} MB`;
      }
    };

    xhr.onload = () => {
      if (xhr.status === 200) {
        statusText.innerText = 'Upload completed ✅';
        statusText.style.color = 'lime';
        form.reset();
        progressBar.style.width = '0%';
      } else {
        statusText.innerText = 'Upload failed ❌';
        statusText.style.color = 'red';
      }
    };

    xhr.onerror = () => {
      statusText.innerText = 'Upload error ❌';
      statusText.style.color = 'red';
    };

    xhr.send(formData);
  });
});
