// ── DOM refs ──────────────────────────────────────────────────
const gallery = document.querySelector(".gallery");
const btnModif = document.querySelector(".modif");
const modale = document.querySelector(".modale");
const modalGaleryContent = document.querySelector(".modal-galery");
const modalTitle = document.querySelector(".modal-title");
const spanClose = document.querySelector(".close");
const arrowLeft = document.querySelector(".arrow-left");
const modalPhoto = document.querySelector(".modal-ajout-photo");
const contentAjoutPhoto = document.querySelector(".content-ajout-photo");
const btnAjouterPhoto = document.querySelector(".btn-ajouter-photo");
const imagePreview = document.querySelector(".cont-preview");
const file = document.getElementById("file");
const formWork = document.querySelector(".form-add-work");
const btnLoginLink = document.getElementById("login-link");

let pieces = [];

// ──  Appel Fetch & affichage de la galerie ────────────────────────────────────────────────//  
async function fetchWorks() {
  try {
    const response = await fetch("http://localhost:5678/api/works");
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } catch (err) {
    console.error("Error fetching works:", err);
    return [];
  }
}

function genererPieces(works) {
  gallery.innerHTML = "";
  works.forEach((work) => {
    const article = document.createElement("article");
    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;
    const p = document.createElement("p");
    p.innerText = work.title;
    article.appendChild(img);
    article.appendChild(p);
    gallery.appendChild(article);
  });
}

// ── initiation de la galerie ─────────────────────────────
fetchWorks().then((works) => {
  pieces = works;
  genererPieces(pieces);
});

// ── Boutons de filtre ────────────────────────────────────────────
document.querySelector(".tous").addEventListener("click", () => {
  genererPieces(pieces);
});

document.querySelector(".objets").addEventListener("click", () => {
  genererPieces(pieces.filter((w) => w.categoryId === 1));
});

document.querySelector(".appartements").addEventListener("click", () => {
  genererPieces(pieces.filter((w) => w.categoryId === 2));
});

document.querySelector(".hotels").addEventListener("click", () => {
  genererPieces(pieces.filter((w) => w.categoryId === 3));
});

// ── Navigation ────────────────────────────────────────────────
document.getElementById("projets-link").addEventListener("click", () => {
  window.location.href = "index.html";
});

// ── Vérification de l'état de connexion ──────────────────────
function checkLoginState() {
  const token = localStorage.getItem("token");
  if (!token) {
    btnLoginLink.textContent = "login";
    btnLoginLink.onclick = () => {
      window.location.href = "login.html";
    };
    return;
  }

  // Utilisateur connecté — afficher les éléments d'édition
  document.querySelector(".banner-edition").style.display = "block";
  document.querySelector(".icone-modif").style.display = "block";
  btnModif.style.display = "block";
  document.querySelector(".btn-content").style.display = "none";
  btnLoginLink.textContent = "logout";

  //  utilisateur deconnecté — configurer affichage et token
  btnLoginLink.onclick = () => {
    localStorage.removeItem("token");
    window.location.href = "index.html";
  };
}

checkLoginState();

// ── Fermeture de la modal ──────────────────────────────────────
function closeModal() {
  modale.style.display = "none";
  modalPhoto.style.display = "none";
  contentAjoutPhoto.style.display = "none";
  arrowLeft.style.display = "none";
  imagePreview.style.display = "none";
  imagePreview.innerHTML = "";
  modalGaleryContent.innerHTML = "";
}

spanClose.onclick = () => closeModal();

window.addEventListener("click", (event) => {
  if (event.target === modale) closeModal();
});

// ── affichage de la modal galerie ───────────────────────────────────────
btnModif.addEventListener("click", () => {
  modalGalery(pieces);
});
 
function modalGalery(works) {
  modale.style.display = "block";
  modalGaleryContent.innerHTML = "";
  modalTitle.textContent = "Galerie photo";
  contentAjoutPhoto.style.display = "block";
  btnAjouterPhoto.style.display = "block";
  modalPhoto.style.display = "none";
  arrowLeft.style.display = "none";

  btnAjouterPhoto.onclick = () => ajoutPhoto();

  works.forEach((work) => {
    const workEl = document.createElement("div");
    workEl.classList.add("gallery-item");

    const img = document.createElement("img");
    img.src = work.imageUrl;
    img.alt = work.title;

    const trash = document.createElement("div");
    trash.classList.add("trash-container");
    trash.dataset.id = work.id;
    trash.innerHTML = `<i class="fa-solid fa-trash-can trash-icone"></i>`;

    workEl.appendChild(img);
    workEl.appendChild(trash);
    modalGaleryContent.appendChild(workEl);

    trash.addEventListener("click", async () => {
      const workId = parseInt(trash.dataset.id, 10);
      const token = localStorage.getItem("token");

      try {
        const result = await fetch(`http://localhost:5678/api/works/${workId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (result.ok) {
          pieces = pieces.filter((p) => p.id !== workId);
          genererPieces(pieces);
          modalGalery(pieces);
        } else {
          console.error("Failed to delete. Status:", result.status);
        }
      } catch (err) {
        console.error("Error deleting work:", err);
      }
    });
  });
}

// ── affichage de la modal d'ajout photo ───────────────────────────────────────
function ajoutPhoto() {
  modalGaleryContent.innerHTML = "";
  modalTitle.textContent = "Ajout photo";
  arrowLeft.style.display = "block";
  modalPhoto.style.display = "block";
  btnAjouterPhoto.style.display = "none";
  contentAjoutPhoto.style.display = "none";

  arrowLeft.onclick = (e) => {
    e.preventDefault();
    imagePreview.style.display = "none";
    imagePreview.innerHTML = "";
    modalPhoto.style.display = "none";
    arrowLeft.style.display = "none";
    modalGalery(pieces);
  };
}

// ── Aperçu de l'image ─────────────────────────────────────────────
file.addEventListener("change", function () {
  const selectedFile = file.files[0];
  if (selectedFile) {
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.innerHTML = `<img src="${e.target.result}" alt="Preview" class="preview-image">`;
      imagePreview.style.display = "block";
    };
    reader.readAsDataURL(selectedFile);
  } else {
    imagePreview.innerHTML = "";
    imagePreview.style.display = "none";
  }
});

// ── Soumission du formulaire d'ajout de travaux ──────────────────────────────────────
formWork.addEventListener("submit", async (e) => {
  e.preventDefault();


  const token = localStorage.getItem("token");

  if (!token) {
    console.error("No token — user not authenticated.");
    return;
  }

  const title = document.getElementById("title").value;
  const categoryId = parseInt(document.getElementById("category").value, 10);
  const imageFile = file.files[0];

  if (!title || !categoryId || !imageFile) {
    console.error("Missing fields.");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", categoryId);
  formData.append("image", imageFile);

  try {
    const response = await fetch("http://localhost:5678/api/works/", {
      method: "POST",
      headers: {
       
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const err = await response.json().catch(() => null);
      console.error(`HTTP ${response.status}:`, err);
      return;
    }

    const newWork = await response.json();
    console.log("Work added:", newWork);

    //mise à jour de la galerie
    pieces.push(newWork);
    genererPieces(pieces);
    modalGalery(pieces);
    closeModal();
  } catch (err) {
    console.error("Network error:", err);
  }
});

