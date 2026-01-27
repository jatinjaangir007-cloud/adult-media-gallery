const uploadBtn = document.getElementById('uploadBtn');
const fileInput = document.getElementById('fileInput');
const titleInput = document.getElementById('titleInput');
const tagsInput = document.getElementById('tagsInput');

const progressBar = document.getElementById('progressBar');
const progressText = document.getElementById('progressText');
const statusText = document.getElementById('statusText');

let xhr = null;
let uploading = false;

uploadBtn.addEventListener('click', () => {
  if (uploading) return;

  const file = fileInput.files[0];
  if (!file) {
    alert('Select a file');
    return;
  }

  uploadVideo(file);
});

function uploadVideo(file) {
  uploading = true;
  uploadBtn.disabled = true;
  statusText.textContent = 'Uploading...';

  xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload', true);

  // 🔴 VERY IMPORTANT FOR LARGE FILES
  xhr.timeout = 0;

  // Upload progress
  xhr.upload.onprogress = (e) => {
    if (e.lengthComputable) {
      const percent = Math.round((e.loaded / e.total) * 100);
      progressBar.style.width = percent + '%';

      progressText.textContent =
        `${(e.loaded / 1024 / 1024).toFixed(2)} MB / ${(e.total / 1024 / 1024).toFixed(2)} MB`;
    }
  };

  // ✅ SUCCESS
  xhr.onload = () => {
    if (xhr.status === 200) {
      statusText.textContent = 'Upload completed ✅';
      resetForm();
    } else {
      statusText.textContent = 'Upload failed ❌';
      uploadBtn.disabled = false;
    }
  };

  // ❌ ERROR
  xhr.onerror = () => {
    statusText.textContent = 'Upload error ❌';
    uploadBtn.disabled = false;
  };

  // ALWAYS END STATE
  xhr.onloadend = () => {
    uploading = false;
  };

  const formData = new FormData();
  formData.append('video', file);
  formData.append('title', titleInput.value);
  formData.append('tags', tagsInput.value);

  xhr.send(formData);
}

function resetForm() {
  uploadBtn.disabled = false;
  fileInput.value = '';
  titleInput.value = '';
  tagsInput.value = '';
  progressBar.style.width = '0%';
  progressText.textContent = '';
}
