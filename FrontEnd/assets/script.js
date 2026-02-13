
async function getUser() {
  try {
    const response = await fetch('http://localhost:5678/api/works');

    if (!response.ok) {
      throw new Error(`Error! status: ${response.status}`);
    }

    // ✅ call response.json() here
    const result = await response.json();
    return result;
  } catch (err) {
    console.log(err);
  }
}

getUser().then(res => {
  console.log(res);
});


getUser().then(res => {
const categoryObjets = res.filter(work => work.category.name === "Objets");
console.log(categoryObjets);
const categoryAppartements = res.filter(work => work.category.name === "Appartements");
console.log(categoryAppartements);
const categoryHotels = res.filter(work => work.category.name === "Hotels & restaurants");
console.log(categoryHotels);

 

const btns = document.querySelectorAll(".btn");
const gallery = document.querySelector(".gallery");

btns.forEach((btn) => {
	btn.addEventListener("click", () => {
		btns.forEach((b) => b.classList.remove("active"));
		btn.classList.add("active");
        console.log(btn.textContent);

		if (btn.textContent === "Objets") 
			{gallery.innerHTML = "";
			categoryObjets.forEach(objet => {
				gallery.innerHTML += `
				<div class="gallery-item">
					<img src="${objet.imageUrl}" alt="${objet.title}">
					<h3>${objet.title}</h3>
				</div>
				`;
			});
		}
		if (btn.textContent === "Appartements") 
			{gallery.innerHTML = "";
			categoryAppartements.forEach(appartement => {
				gallery.innerHTML += `
				<div class="gallery-item">
					<img src="${appartement.imageUrl}" alt="${appartement.title}">
					<h3>${appartement.title}</h3>
				</div>
				`;
			});
		}
		if (btn.textContent === "Hotels & restaurants") 
			{gallery.innerHTML = "";
			categoryHotels.forEach(hotel => {
				gallery.innerHTML += `
				<div class="gallery-item">
					<img src="${hotel.imageUrl}" alt="${hotel.title}">
					<h3>${hotel.title}</h3>
				</div>
				`;
			});
		}
		if (btn.textContent === "Tous")
			{gallery.innerHTML = ""; res.forEach(work => {
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
location.assign("login.html");
 
});	
// Navigation vers la page de projets//
const btnProjets = document.getElementById("projets-link");
btnProjets.addEventListener("click", () => {
location.reload();
 
});
