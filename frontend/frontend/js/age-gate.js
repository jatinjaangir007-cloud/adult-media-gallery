const ageGate = document.getElementById("age-gate");
const yesBtn = document.getElementById("age-yes");
const noBtn = document.getElementById("age-no");

if (localStorage.getItem("ageVerified") === "true") {
  ageGate.style.display = "none";
}

yesBtn.addEventListener("click", () => {
  localStorage.setItem("ageVerified", "true");
  ageGate.style.display = "none";
});

noBtn.addEventListener("click", () => {
  window.location.href = "https://www.google.com";
});
