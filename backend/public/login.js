document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("login-form")
    .addEventListener("submit", async (e) => {
      e.preventDefault();

      const username = document.getElementById("loginUsername").value;
      const password = document.getElementById("loginPassword").value;

      const response = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);

        const tokenPayload = JSON.parse(atob(data.token.split(".")[1]));
        if (tokenPayload.isAdmin) {
          window.location.href = "admin-dashboard.html";
        } else {
          window.location.href = "viewers-dashboard.html";
        }
      } else {
        alert(data.error);
      }
    });
});
