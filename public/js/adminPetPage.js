const showNavbar = (toggleId, navId, bodyId, headerId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

  if (toggle && nav && bodypd && headerpd) {
    toggle.addEventListener("click", () => {
      nav.classList.toggle("show");

      toggle.classList.toggle("bx-x");

      bodypd.classList.toggle("body-pd");

      headerpd.classList.toggle("body-pd");
    });
  }
};

showNavbar("header-toggle", "nav-bar", "body-pd", "header");

const linkColor = document.querySelectorAll(".nav__link");

function colorLink() {
  if (linkColor) {
    linkColor.forEach((l) => l.classList.remove("active"));
    this.classList.add("active");
  }
}
linkColor.forEach((l) => l.addEventListener("click", colorLink));

const petProfileName = document.getElementById("petProfileName").textContent;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: ["Date Picked", "Service", "Date Approved"],
    server: {
      url: `/admin-visitation-history/${petProfileName}`,
      method: "GET",
      then: (data) =>
        data.map((item) => [
          dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
          item.service,
          item.dateApproved,
        ]),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("admin-visitation-table"));
});

const breedIcons = {
  dog: {
    Labrador: "/images/Dog1.png",
    Bulldog: "/images/Dog2.png",
    Poodle: "/images/Dog3.png",
    "Afghan-Hound": "/images/Dog4.png",
    "Australian Kelpie": "/images/Dog5.png",
    "Australian Shepherd": "/images/Dog6.png",
    "Basset-Hound": "/images/Dog7.png",
    "Bearded Collie": "/images/Dog8.png",
    "Bernese Mountain": "/images/Dog9.png",
    "Bichon Frise": "/images/Dog10.png",
    "Border Collie": "/images/Dog11.png",
    "Border Terrier": "/images/Dog12.png",
    Boxer: "/images/Dog13.png",
    Mastiff: "/images/Dog14.png",
    Brittany: "/images/Dog15.png",
    "Cane Corso": "/images/Dog16.png",
    "Cavalier King Charles Spaniel": "/images/Dog17.png",
    Chihuahua: "/images/Dog18.png",
    "Cocker Spaniel": "/images/Dog19.png",
    "Dachshund Red": "/images/Dog20.png",
    "Dachshund Wire Haired": "/images/Dog21.png",
    Dachshund: "/images/Dog22.png",
    Dalmatian: "/images/Dog23.png",
    Doberman: "/images/Dog24.png",
    "English Foxhound": "/images/Dog25.png",
    "French Bulldog": "/images/Dog26.png",
    "German Shepherd": "/images/Dog27.png",
    "German Shorthaired Pointer": "/images/Dog28.png",
    "Giant Schnauzer": "/images/Dog29.png",
    "Golden Retriever": "/images/Dog30.png",
    "Grand Basset Griffon Vendeen": "/images/Dog31.png",
    "Great Dane": "/images/Dog32.png",
    Greyhound: "/images/Dog33.png",
    "Irish Red Setter": "/images/Dog34.png",
    "Irish Wolfhound": "/images/Dog35.png",
    "Jack Russel Terrier": "/images/Dog36.png",
    "Japanese-Chin": "/images/Dog37.png",
    "Labrador Black": "/images/Dog38.png",
    "Labrador Brown": "/images/Dog39.png",
    Maltesee: "/images/Dog40.png",
    "Miniature Schnauzer": "/images/Dog41.png",
    Papillon: "/images/Dog42.png",
    Pekingese: "/images/Dog43.png",
    "Pharaoh Hound": "/images/Dog44.png",
    Pomeranian: "/images/Dog45.png",
    "Poodle Toy": "/images/Dog46.png",
    Pug: "/images/Dog47.png",
    Retriever: "/images/Dog48.png",
    "Rhodesian Ridgeback": "/images/Dog49.png",
    Rottweiler: "/images/Dog50.png",
    "Shar Pei": "/images/Dog51.png",
    "Shetland Sheepdog": "/images/Dog52.png",
    "Shiba-Inu": "/images/Dog53.png",
    "Shih-Tzu(Brown)": "/images/Dog54.png",
    "Siberian Husky": "/images/Dog55.png",
    "St. Bernard": "/images/Dog56.png",
    Vizsla: "/images/Dog57.png",
    Weimaraner: "/images/Dog58.png",
    "Yorkshire Terrier": "/images/Dog59.png",
    Beagle: "/images/Dog60.png",
    Aspin: "/images/Dog61.png",
    "Shih-Tzu(Black)": "/images/Dog62.png",
    "Shih-Tzu(White Brown)": "/images/Dog63.png",
    "Shih-Tzu": "/images/Dog64.png",
    "Shih-Tzu(White)": "/images/Dog65.png",
    "Shih-Tzu(White Gray)": "/images/Dog66.png",
  },
  cat: {
    Siamese: "/images/Cat1.png",
    Persian: "/images/Cat2.png",
    British: "/images/Cat3.png",
    "Russian Blue": "/images/Cat4.png",
    Abyssinian: "/images/Cat5.png",
    Balinesian: "/images/Cat6.png",
    "American Curl": "/images/Cat7.png",
    Burmese: "/images/Cat8.png",
    "Exotic Shorthair": "/images/Cat9.png",
    "Devon Rex": "/images/Cat10.png",
    "Norwegian Forest": "/images/Cat11.png",
    Ragdoll: "/images/Cat12.png",
    Savanah: "/images/Cat13.png",
    "Scottish Fold": "/images/Cat14.png",
    Singapura: "/images/Cat15.png",
    Sphynx: "/images/Cat16.png",
    "Himalayan Catt": "/images/Cat17.png",
    "Turkish Van": "/images/Cat18.png",
    Siberian: "/images/Cat19.png",
    "Maine Coon": "/images/Cat20.png",
    Korat: "/images/Cat21.png",
    "American Shorthair": "/images/Cat22.png",
    Chartreux: "/images/Cat23.png",
    Bombay: "/images/Cat24.png",
    Savannah: "/images/Cat25.png",
    Ocicat: "/images/Cat26.png",
    Burnesse: "/images/Cat27.png",
    "Turkish Angora": "/images/Cat28.png",
    Cymric: "/images/Cat29.png",
    Aegean: "/images/Cat30.png",
    "German Rex": "/images/Cat31.png",
    "Aphrodite Giant": "/images/Cat32.png",
    "La-Perm": "/images/Cat33.png",
    "European Burmese": "/images/Cat34.png",
    "Australian Mist": "/images/Cat35.png",
    "Don Sphynx": "/images/Cat36.png",
    Birman: "/images/Cat37.png",
    Chausie: "/images/Cat38.png",
    "Kurilian Bobtail": "/images/Cat39.png",
    Somali: "/images/Cat40.png",
    "British Shorthair": "/images/Cat41.png",
    "Oriental Bicolor": "/images/Cat42.png",
    "Selkirk Rex": "/images/Cat43.png",
    "Toyger(Toy Tiger)": "/images/Cat44.png",
    "Japanese Bobtail": "/images/Cat45.png",
    "Chincila Persian": "/images/Cat46.png",
    Oregonrex: "/images/Cat47.png",
    Sokoke: "/images/Cat48.png",
    Skokum: "/images/Cat49.png",
    "Pixie Bob": "/images/Cat50.png",
    Snowshoe: "/images/Cat51.png",
    Ragamuffin: "/images/Cat52.png",
    Calico: "/images/Cat53.png",
    "Persian Red": "/images/Cat54.png",
    "Egyptian Mau": "/images/Cat55.png",
    Mucnhkin: "/images/Cat56.png",
    Manx: "/images/Cat57.png",
    "Tabby Cream": "/images/Cat58.png",
    Nebelung: "/images/Cat59.png",
    Laperm: "/images/Cat60.png",
  },
};

const animalIcon = document.getElementById("animalIcon");
const animalType = document
  .getElementById("animalType")
  .textContent.toLowerCase();
const petBreed = document.getElementById("petBreed").textContent;

function getRandomBreedIcon(breedIcons) {
  const iconKeys = Object.keys(breedIcons);
  const randomKey = iconKeys[Math.floor(Math.random() * iconKeys.length)];
  return breedIcons[randomKey];
}

if (animalType === "dog" && breedIcons.dog[petBreed]) {
  animalIcon.src = breedIcons.dog[petBreed];
} else if (animalType === "cat" && breedIcons.cat[petBreed]) {
  animalIcon.src = breedIcons.cat[petBreed];
} else if (animalType === "dog") {
  animalIcon.src = dogIcons[Math.floor(Math.random() * dogIcons.length)];
} else if (animalType === "cat") {
  animalIcon.src = catIcons[Math.floor(Math.random() * catIcons.length)];
} else {
  animalIcon.src = "/images/profile-icon.png";
}

function handleLogout(event) {
  event.preventDefault();

  fetch("/logout", { method: "POST" })
    .then((response) => {
      if (response.ok) {
        window.location.replace("/login");

        setTimeout(() => {
          window.history.pushState(null, null, "/login");
        }, 500);
      }
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
}
