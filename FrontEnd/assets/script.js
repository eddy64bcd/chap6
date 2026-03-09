const gallery = document.querySelector(".gallery");
let token = 0;
const modalGaleryContent = document.querySelector(".modal-galery");
const modalAjoutPhoto = document.querySelector(".modal-ajout-photo");
const btnValidModal = document.querySelector(".btn-validation");
const modalTitle = document.querySelector(".modal-title");
const btnModif = document.querySelector(".modif");
const modale = document.querySelector(".modale");
const spanClose = document.querySelector(".close");
const modalContent = document.querySelector(".modal-content");
const arrowLeft = document.querySelector(".arrow-left");

// Récupération des données de l'API et affichage dans la galerie
async function getUser() {
  try {
    const response = await fetch("http://localhost:5678/api/works");

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // ✅ call response.json() here
    const result = await response.json();
    return result;
  } catch (err) {}
}

getUser().then((res) => {
  const categoryObjets = res.filter((work) => work.category.name === "Objets");
  console.log(categoryObjets);
  const categoryAppartements = res.filter(
    (work) => work.category.name === "Appartements",
  );
  console.log(categoryAppartements);
  const categoryHotels = res.filter(
    (work) => work.category.name === "Hotels & restaurants",
  );
  console.log(categoryHotels);

  btns.forEach((btn) => {
    btn.addEventListener("click", () => {
      btns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      if (btn.textContent === "Objets") {
        gallery.innerHTML = "";
        categoryObjets.forEach((objet) => {
          gallery.innerHTML += `
				<div class="gallery-item">
					<img src="${objet.imageUrl}" alt="${objet.title}">
					<h3>${objet.title}</h3>
				</div>
				`;
        });
      }
      if (btn.textContent === "Appartements") {
        gallery.innerHTML = "";
        categoryAppartements.forEach((appartement) => {
          gallery.innerHTML += `
				<div class="gallery-item">
					<img src="${appartement.imageUrl}" alt="${appartement.title}">
					<h3>${appartement.title}</h3>
				</div>
				`;
        });
      }
      if (btn.textContent === "Hotels & restaurants") {
        gallery.innerHTML = "";
        categoryHotels.forEach((hotel) => {
          gallery.innerHTML += `
				<div class="gallery-item">
					<img src="${hotel.imageUrl}" alt="${hotel.title}">
					<h3>${hotel.title}</h3>
				</div>
				`;
        });
      }
      if (btn.textContent === "Tous") {
        gallery.innerHTML = "";
        res.forEach((work) => {
          gallery.innerHTML += ` 
				 <div class="gallery-item"> 
				     <img src="${work.imageUrl}" alt="${work.title}"> 
				     <h3>${work.title}</h3> 
				 </div>
				  `;
        });
      }
    });
  });
});

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

//**********Formulaire de connexion**********//

const formulaireLogin = document.querySelector(".login-content");

// Création de la demande de connexion à l'API

const log = {
  email: "sophie.bluel@test.tld",
  password: "S0phie",
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
      token = result.token;
      perso();
    } else {
      alert("Email ou mot de passe incorrect");
    }
  })
  .catch((error) => console.log("error", error));

//**********Personnalisation de l'accueil**********//
function perso() {
  if (token != null) {
    getUser().then((res) => {
      {
        gallery.innerHTML = "";
        res.forEach((work) => {
          gallery.innerHTML += ` 
				 <div class="gallery-item"> 
				     <img src="${work.imageUrl}" alt="${work.title}"> 
				     <h3>${work.title}</h3> 
				 </div>
				  `;
        });
      }
    });
    document.getElementById("login-link").textContent = "logout"; // Transforme Login en Logout si le token est présent
    document.querySelector(".banner-edition").style.display = "block"; // Affiche la bannière d'édition si le token est présent
    //Affiche le bouton de modification si le token est présent
    document.querySelectorAll(".filter").forEach((filter) => {
      filter.style.display = "none";
    }); // supprime les boutons de filtrage si le token est présent

    btnModif.style.display = "block"; //affiche bouton modification

    btnModif.addEventListener("click", (event) => {
      event.preventDefault();
      modalGaleryContent.innerHTML = "";
      modalGalery();

      spanClose.addEventListener("click", (event) => {
        event.preventDefault();
        modale.style.display = "none";
      });

      window.addEventListener("click", (event) => {
        if (event.target === modale) {
          modale.style.display = "none";
        }
      });
    });
    if (btnLogin) {
      btnLogin.addEventListener("click", () => {
        deconnexion();
      });
    }
  } else {
    document.getElementById("login-link").textContent = "login"; // Affiche les boutons de filtrage si le token est absent
  }
}
//*************Deconnexion**********/

function deconnexion() {
  localStorage.removeItem("token");
  btnLogin.textContent = "login";
  document.querySelector(".banner-edition").style.display = "none"; // Cache la bannière d'édition si le token est absent
  document.querySelector(".modif").style.display = "none"; // Cache le bouton de modification si le token est absent
  document.querySelectorAll(".filter").forEach((filter) => {
    filter.style.display = "flex";
  }); // Affiche les boutons de filtrage si le token est absent
}

//**********Modale************/

function modalGalery() {
  modalAjoutPhoto.innerHTML = "";
  modale.style.display = "block";
  arrowLeft.style.display = "none";
  btnValidModal.textContent = "Ajouter une photo";
  modalTitle.textContent = "Galerie photo";
  btnValidModal.style.background = "#1D6154";

  getUser().then((res) => {
    modalGaleryContent.innerHTML = "";
    btnValidModal.textContent = "Ajouter une photo";
    modalTitle.textContent = "Galerie photo";

    res.forEach((work) => {
      modalGaleryContent.innerHTML += ` 
	             <div class="gallery-item">
				    <img src="${work.imageUrl}" alt="${work.title}"> 
				   	<div class="trash-container">
					    <i class="fa-solid fa-trash-can  trash-icone"></i>
					</div>
			     </div> `;
    });
  });

  btnValidModal.addEventListener("click", () => {
    ajoutPhoto();
  });
}

function ajoutPhoto() {
  modalGaleryContent.innerHTML = "";
  modalTitle.textContent = "Ajout photo";
  btnValidModal.textContent = "Valider";
  btnValidModal.style.background = "#A7A7A7";
  btnValidModal.style.border = "no border";
  arrowLeft.style.display = "block";

  modalAjoutPhoto.innerHTML = `
    <form id="add-photo-form">
	 <div class="image-preview">
	<img class="logo-paysage"src="./assets/icons/logo-paysage.png" alt="logo paysage">   
   	<img class="btn-ajout-photo" src="./assets/icons/btn-ajout-photo.png" alt="bouton ajout photo">  
	       <p>jpg,png : 4mo max</p>
	 </div>
	 <div class="image-text">
	  <label for="title">Titre</label>
	 <input class="cont-text photo-title">
	  <label for="category">Catégorie</label>
	  <select class="cont-text photo-category" name="category" required>
		<option value=""></option>
		<option value="1">Objets</option>
		<option value="2">Appartements</option>
		<option value="3">Hotels & restaurants</option>
	  </select>
	  </div>
  </form>`;

  arrowLeft.addEventListener("click", (event) => {
    event.preventDefault();
    modalAjoutPhoto.innerHTML = "";
    modalGaleryContent.innerHTML = "";
    modalGalery();
  });
}

function trashPhoto() {
  const trashing = document.querySelectorAll(".trash-container");

  trashing.addEventListener("click", () => {
    console.log("coucou");
  });
}
