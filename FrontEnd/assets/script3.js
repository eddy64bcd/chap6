// Navigation vers la page de login//
const btnLogin = document.getElementById("login-link");
btnLogin.addEventListener("click", () => {
  window.location.href = "login.html";
});
// Navigation vers la page de projets//
const btnProjets = document.getElementById("projets-link");
btnProjets.addEventListener("click", () => {
  window.location.href = "index.html";
});

console.log(localStorage);

const formulaireLogin = document.querySelector(".login-content");

formulaireLogin.addEventListener("submit", function (event) {
  event.preventDefault();

  // Création de la demande de connexion à l'API

  const log = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(log);
  console.log(raw);

  const requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  fetch("http://localhost:5678/api/users/login", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      console.log(result);
      if (result.token) {
        localStorage.setItem("token", result.token);
        perso();
      } else {
        alert("Email ou mot de passe incorrect");
      }
    })
    .catch((error) => console.log("error", error));
});

//**********Personnalisation de l'accueil**********//
function perso() {
  const btnModif = document.querySelector(".modif");

  if (localStorage.getItem("token")) {
    document.getElementById("login-link").textContent = "logout"; // Transforme Login en Logout si le token est présent
    document.querySelector(".banner-edition").style.display = "block"; // Affiche la bannière d'édition si le token est présent
    //Affiche le bouton de modification si le token est présent
    btnModif.style.display = "block";

    document.querySelectorAll(".filter").forEach((filter) => {
      filter.style.display = "none";
    }); // supprime les boutons de filtrage si le token est présent

    if (btnLogin) {
      btnLogin.addEventListener("click", () => {
        deconnexion();
      });
    }
  } else {
    document.getElementById("login-link").textContent = "login"; // Affiche les boutons de filtrage si le token est absent
  }
}

function deconnexion() {
  localStorage.removeItem("token");
  btnLogin.textContent = "login";
  document.querySelector(".banner-edition").style.display = "none"; // Cache la bannière d'édition si le token est absent
  document.querySelector(".modif").style.display = "none"; // Cache le bouton de modification si le token est absent
  document.querySelectorAll(".filter").forEach((filter) => {
    filter.style.display = "flex";
  }); // Affiche les boutons de filtrage si le token est absent
}
