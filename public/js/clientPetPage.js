const showNavbar = (toggleId, navId, bodyId, headerId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

  if (toggle && nav && bodypd && headerpd) {
    nav.addEventListener("mouseenter", () => {
      if (window.innerWidth > 768) {
        nav.classList.add("show");
        toggle.classList.add("bx-x");
        bodypd.classList.add("body-pd");
        headerpd.classList.add("body-pd");
      }
    });

    nav.addEventListener("mouseleave", () => {
      if (window.innerWidth > 768) {
        nav.classList.remove("show");
        toggle.classList.remove("bx-x");
        bodypd.classList.remove("body-pd");
        headerpd.classList.remove("body-pd");
      }
    });

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

function toggleTabs(selectedCheckbox) {
  const allContents = document.querySelectorAll(".tab-content");
  allContents.forEach((content) => {
    content.style.maxHeight = "0";
    content.style.opacity = "0";
    content.style.transition = "max-height 0.3s ease, opacity 0.3s ease";
  });
  if (selectedCheckbox.checked) {
    const content = selectedCheckbox.nextElementSibling.nextElementSibling;
    content.style.maxHeight = content.scrollHeight + "px";
    content.style.opacity = "1";
  }
  const checkboxes = document.querySelectorAll('.tab input[type="checkbox"]');
  checkboxes.forEach((checkbox) => {
    if (checkbox !== selectedCheckbox) {
      checkbox.checked = false;
    }
  });
}

const petProfileModal = document.getElementById("pet-profile-modal");
const editPetProfileBtn = document.getElementById("editPetProfileBtn");
const closeEditPetProfilelBtn = document.getElementById(
  "closeEditPetProfilelBtn"
);

editPetProfileBtn.addEventListener("click", () => {
  petProfileModal.style.display = "flex";
});

closeEditPetProfilelBtn.addEventListener("click", () => {
  petProfileModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == petProfileModal) {
    petProfileModal.style.display = "none";
  }

  if (event.target == petRecordModal) {
    petRecordModal.style.display = "none";
  }
});

const editPetProfileForm = document.getElementById("pet-profile-modal-form");
const petProfileName = editPetProfileForm.petProfileName.value;

const urlPath = window.location.pathname;
const petId = urlPath.substring(urlPath.lastIndexOf("/") + 1);

editPetProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const petBirthdate = editPetProfileForm.petBirthdate.value;
  const animalType = editPetProfileForm.animalType.value;
  const petBreed = editPetProfileForm.petBreed.value;
  const petGender = editPetProfileForm.petGender.value;

  axios
    .post("/edit-pet-profile", {
      petId,
      petBirthdate,
      animalType,
      petBreed,
      petGender,
    })
    .then((res) => {
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});

const { h } = window.gridjs;

const petRecordModal = document.getElementById("pet-record-modal");

const closePetRecordModalButton = document.getElementById(
  "closePetRecordModalButton"
);
closePetRecordModalButton.addEventListener("click", () => {
  petRecordModal.style.display = "none";
});

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { id: "appointmentId", name: "ID", hidden: true },
      "Treatment Date",
      "Service",
      "Treatment Done Date",
      {
        name: "Status",
        formatter: (cell, row) => {
          const status = row.cells[4].data;

          let statusClassName = "";

          switch (status) {
            case "PENDING":
              statusClassName = "pending-status";
              break;
            case "COMPLETE":
              statusClassName = "complete-status";
              break;
            case "ON-GOING":
              statusClassName = "ongoing-status";
              break;
            case "CANCELLED":
              statusClassName = "cancelled-status";
              break;
            default:
              statusClassName = "";
          }

          return h("statusData", { className: statusClassName }, status);
        },
      },
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          return h(
            "viewResultButton",
            {
              className: "view-result-button",
              onClick: () => {
                const appointmentId = row.cells[0].data;

                axios
                  .get(`/pet-record/${appointmentId}`)
                  .then((res) => {
                    const {
                      appointmentDate,
                      service,
                      treatmentDateDone,
                      petWeight,
                      temperature,
                      ppm,
                      cbc,
                      urinalysisResult,
                      respiratoryRate,
                      observation,
                      prescription,
                    } = res.data;

                    document.getElementById("appointmentId").value =
                      appointmentId;
                    document.getElementById("treatmentDate").value =
                      dayjs(appointmentDate).format("YYYY-MM-DDTHH:mm");
                    document.getElementById("service").value = service;
                    document.getElementById("treatmentDateDone").value =
                      treatmentDateDone;
                    document.getElementById("petWeight").value = petWeight;
                    document.getElementById("temperature").value = temperature;
                    document.getElementById("ppm").value = ppm;
                    document.getElementById("cbc").value = cbc;
                    document.getElementById("urinalysisResult").value =
                      urinalysisResult;
                    document.getElementById("respiratoryRate").value =
                      respiratoryRate;
                    document.getElementById("observation").value = observation;
                    document.getElementById("prescription").value =
                      prescription;
                  })
                  .catch((error) => {
                    console.error(error);
                  });

                petRecordModal.style.display = "flex";
              },
            },
            "View Result"
          );
        },
      },
    ],
    server: {
      url: `/visitation-history/${petProfileName}`,
      method: "GET",
      then: (data) =>
        data.map((item) => [
          item.id,
          dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
          item.service,
          item.treatmentDateDone,
          item.medicalRecordStatus,
        ]),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("visitation-table"));
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
const animalType = document.getElementById("animalType").value.toLowerCase();
const petBreed = editPetProfileForm.petBreed.value;

if (animalType === "dog" && breedIcons.dog[petBreed]) {
  animalIcon.src = breedIcons.dog[petBreed];
} else if (animalType === "cat" && breedIcons.cat[petBreed]) {
  animalIcon.src = breedIcons.cat[petBreed];
} else if (animalType === "dog") {
  animalIcon.src = "/images/defaultDog.jpg";
} else if (animalType === "cat") {
  animalIcon.src = "/images/defaultCat.jpg";
} else {
  animalIcon.src = "/images/profile-icon.png";
}
