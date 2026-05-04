// ── Navigation ────────────────────────────────────────────────
const btnLogin = document.getElementById("login-link");
btnLogin.addEventListener("click", () => {
  window.location.href = "login.html";
});

const btnProjets = document.getElementById("projets-link");
btnProjets.addEventListener("click", () => {
  window.location.href = "index.html";
});

// ── Login form ────────────────────────────────────────────────
const formulaireLogin = document.querySelector(".login-content");

formulaireLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  const log = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: myHeaders,
    body: JSON.stringify(log),
  })
      .then((response) => response.json())
      .then((result) => {
        if (result.token) {
          localStorage.setItem("token", result.token);
          // ✅ Redirect to index — don't call perso() here, those DOM elements don't exist on login.html
          window.location.href = "index.html";
        } else {
          const message = document.querySelector(".messageError");
          if (message) {
            message.style.display = "block";
          } else {
            alert("Email ou mot de passe incorrect");
          }
        }
      })
      .catch((error) => console.error("Login error:", error));
});