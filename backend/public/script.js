document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("register-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const isAdmin = document.getElementById("isAdmin").checked;

      const response = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password, isAdmin }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Registration successful!");

        window.location.href = "login.html";
      } else {
        alert(data.error);
      }
    });
});
