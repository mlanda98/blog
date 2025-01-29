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
        console.log("Token saved to localStorage:", data.token);

        if (data.isAdmin) {
          fetch("/auth/admin-dashboard", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${data.token}`,
            },
          })
            .then((response) => {
              if (response.ok) {
                window.location.href = "/auth/admin-dashboard";
              } else {
                alert("Failed to load admin dashboard");
              }
            })
            .catch((error) => {
              console.error("Error while fetching admin dashboard:", error);
            });
        } else {
          window.location.href = "/auth/viewers-dashboard";
        }
      } else {
        alert(data.error);
      }
    });
});
