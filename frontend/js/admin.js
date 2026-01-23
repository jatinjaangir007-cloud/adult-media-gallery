document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = document.querySelector("input[name='username']").value;
    const password = document.querySelector("input[name='password']").value;

    try {
      const response = await fetch("/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message);
        return;
      }

      alert(data.message);
      // later you can redirect to dashboard
    } catch (err) {
      alert("Server error");
      console.error(err);
    }
  });
});
