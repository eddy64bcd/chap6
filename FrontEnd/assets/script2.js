const btnModif = document.querySelector(".modif");
// Navigation vers la page de login//
const btnLogin = document.getElementById("login-link");
btnLogin.addEventListener("click", () => {
  pageLogin();
  validLogin();
});
// Navigation vers la page de projets//
const btnProjets = document.getElementById("projets-link");
btnProjets.addEventListener("click", () => {
  window.location.href = "index.html";
});


// Récupération des pièces depuis le fichier JSON
const response = await fetch("http://localhost:5678/api/works");
const pieces = await response.json();

function genererPieces(pieces) {
  for (let i = 0; i < pieces.length; i++) {
    const article = pieces[i];

    const sectionFiches = document.querySelector(".gallery");

    const pieceElement = document.createElement("article");
    const imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    const nomElement = document.createElement("p");
    nomElement.innerText = article.title;

    sectionFiches.appendChild(pieceElement);
    pieceElement.appendChild(imageElement);
    pieceElement.appendChild(nomElement);

  }
}

genererPieces(pieces);
console.log(pieces);

  
//gestion des Filtres////////////////////////
const btnObjets = document.querySelector(".objets");

const reponse = await fetch("http://localhost:5678/api/works");
const category = await reponse.json();

btnObjets.addEventListener("click", function () {
  const pieceObjets = category.filter((item) => item.categoryId === 1);
  document.querySelector(".gallery").innerHTML = "";
  genererPieces(pieceObjets);
});

const btnAppartements = document.querySelector(".appartements");
btnAppartements.addEventListener("click", function () {
  const pieceAppartements = category.filter((item) => item.categoryId === 2);
  document.querySelector(".gallery").innerHTML = "";
  genererPieces(pieceAppartements);
});

const btnHotels = document.querySelector(".hotels");
btnHotels.addEventListener("click", function () {
  const pieceHotels = category.filter((item) => item.categoryId === 3);
  document.querySelector(".gallery").innerHTML = "";
  genererPieces(pieceHotels);
});

const btnTous = document.querySelector(".tous");
btnTous.addEventListener("click", function () {
  document.querySelector(".gallery").innerHTML = "";
  genererPieces(category);
});

//////page Login//////////////
const homePage = document.querySelector(".homePage");

function pageLogin() {
  homePage.style.display = "none";
  const loginPage = document.querySelector(".loginPage");
  const loginSection = document.createElement("section");
  loginSection.classList.add("login");
  const titleSection = document.createElement("h2");
  titleSection.innerText = "Login";
  const formSection = document.createElement("form");
  formSection.classList.add("login-content");
  const formGroup1 = document.createElement("div");
  formGroup1.classList.add("form-group");

  formGroup1.innerHTML = `<label for="email">E-mail</label>
                        <input type="email" name="email" id="email" required>`;

  const formGroup2 = document.createElement("div");
  formGroup2.classList.add("form-group");

  formGroup2.innerHTML = `<label for="password">Mot de passe</label>
                        <input type="password" name="password" id="password" required>
                        <button id="btn-login" type="submit">Se connecter</button>
                        <a class="forgot-password" href="#">Mot de passe oublié </a>`;

  loginPage.appendChild(loginSection);
  loginSection.appendChild(titleSection);
  loginSection.appendChild(formSection);
  formSection.appendChild(formGroup1);
  formSection.appendChild(formGroup2);
}

function validLogin() {
   const formulaireLogin = document.querySelector(".login-content");

  formulaireLogin.addEventListener("submit", function (event) {
    event.preventDefault();
    // Création de la demande de connexion à l'API

    const secret = {
      email: document.getElementById("email").value,
      password: document.getElementById("password").value,
    };

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(secret);
    console.log(raw);

    const requestOptions = {
      method: "POST",
      headers: myHeaders,
      body: raw,
      redirect: "follow",
    };

  fetch("http://localhost:5678/api/users/login", requestOptions)
    .then(response => response.json())
    .then(result => {
	  console.log(result);
	  if (result.token) {
		localStorage.setItem("token", result.token);
	perso();

	} else {
		alert("Email ou mot de passe incorrect");
	}
  })
  .catch(error => console.log("error", error));
   
  });

  //**********Personnalisation de l'accueil**********//
  function perso() {
    const iconeModif = document.querySelector(".icone-modif");
    const loginPage = document.querySelector(".loginPage");
    const btnFilter = document.querySelector(".btn-content");
    if (localStorage.getItem("token")) {
      document.getElementById("login-link").textContent = "logout"; // Transforme Login en Logout si le token est présent
      document.querySelector(".banner-edition").style.display = "block"; // Affiche la bannière d'édition si le token est présent
      loginPage.style.display = "none";
      homePage.style.display = "block";
      btnModif.style.display = "block";
      iconeModif.style.display = "block";
      btnFilter.style.display = "none";

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
    window.location.href = "index.html";
    document.querySelector(".banner-edition").style.display = "none"; // Cache la bannière d'édition si le token est absent
    btnModif.style.display = "none"; // Cache le bouton de modification si le token est absent
    document.querySelectorAll(".filter").forEach((filter) => {
      filter.style.display = "block";
    }); 
    homePage.style.display = "block";
    btnLogin.textContent = "login";
    btnLogin.addEventListener("click", () => {
    pageLogin();
    validLogin();
 });

  }
}

//**********Modale************/

const modalGaleryContent = document.querySelector(".modal-galery");
const btnValidModal = document.querySelector(".btn-validation");
const modalTitle = document.querySelector(".modal-title");
const modale = document.querySelector(".modale");
const spanClose = document.querySelector(".close");

btnModif.addEventListener("click", () => {
  modalGalery(pieces);
});

function modalGalery(pieces) {
  modale.style.display = "block";
  modalGaleryContent.innerHTML = "";
  btnValidModal.textContent = "Ajouter une photo";
  modalTitle.textContent = "Galerie photo";

  genererPieces(pieces);
  for (let i = 0; i < pieces.length; i++) {
    const work = pieces[i];

    const workElement = document.createElement("div");
    workElement.classList.add("gallery-item");
    const imgElement = document.createElement("img");
    imgElement.src = work.imageUrl;
    const trashContainer = document.createElement("div");
    trashContainer.classList.add("trash-container");
    trashContainer.id = work.id;
    trashContainer.innerHTML = `<i class="fa-solid fa-trash-can  trash-icone"></i>`;

    modalGaleryContent.appendChild(workElement);
    workElement.appendChild(imgElement);
    workElement.appendChild(trashContainer);
        
    btnValidModal.addEventListener("click", () => {
      ajoutPhoto();
    });

    spanClose.addEventListener("click", () => {
      modale.style.display = "none";
      document.querySelector(".gallery").innerHTML = "";
      genererPieces(pieces);
    });
    
    window.addEventListener("click", (event) => {
      if (event.target === modale) {
        modale.style.display = "none";
        document.querySelector(".gallery").innerHTML = "";
        genererPieces(pieces);
      }
    });

    trashContainer.addEventListener("click", (event) => {
      let imgRemoveId = event.target.parentElement.id;
    
      const numberId = parseInt(imgRemoveId, 10);
         
      let listId = pieces.map(piece => piece.id);
         
      let index = listId.indexOf(numberId);
      pieces.splice(index,1);
     
       modalGalery(pieces);
    
  


      const urlApi = "http://localhost:5678/api/works/";
      const token =window.localStorage.getItem("token");

const deleteWork = async () => {
try {
  const result = await fetch(urlApi + imgRemoveId,{
        method: `DELETE`,
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
         },
});
     if (result.ok) {
        console.log('Post deleted successfully.');
   
        deleteWork();


    } else {
      console.error('Failed to delete post. Status:', result.status);
    }
    } catch (error) {
    console.error('Error deleting post:', error);
  }
}


});
 

const modalPhoto = document.querySelector(".modal-ajout-photo");
const arrowLeft = document.querySelector(".arrow-left");
function ajoutPhoto() {
  modalGaleryContent.innerHTML = "";
  modalTitle.textContent = "Ajout photo";
  btnValidModal.textContent = "Valider";
  btnValidModal.style.background = "#A7A7A7";
  btnValidModal.style.border = "no border";
  arrowLeft.style.display = "block";
  modalPhoto.style.display = "block";

  arrowLeft.addEventListener("click", (event) => {
    event.preventDefault();
    modalPhoto.innerHTML = "";
    modalGaleryContent.innerHTML = "";
    arrowLeft.style.display = "none";
    modalGalery();
  });
};
  }

}


