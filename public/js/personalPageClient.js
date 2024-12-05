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

const logoutModal = document.getElementById("logoutModal");

function handleLogout(event) {
  event.preventDefault();

  logoutModal.style.display = "flex";
  logoutModal.style.alignItems = "center";
  logoutModal.style.justifyContent = "center";
}

function handleConfirmLogout() {
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

function handleCancelLogout() {
  logoutModal.style.display = "none";
}

const profileModal = document.getElementById("profile-modal");
const editProfileBtn = document.getElementById("editProfileBtn");
const closeEditProfilelBtn = document.getElementById("closeEditProfilelBtn");

editProfileBtn.addEventListener("click", () => {
  profileModal.style.display = "flex";
});

closeEditProfilelBtn.addEventListener("click", () => {
  profileModal.style.display = "none";
});

window.addEventListener("click", (event) => {
  if (event.target == document.querySelector(".add-pet-modal")) {
    document.querySelector(".add-pet-modal").style.display = "none";
  }

  if (event.target == profileModal) {
    profileModal.style.display = "none";
  }
});

const editProfileForm = document.getElementById("profile-modal-form");
editProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profileFullName = editProfileForm.profileFullName.value;
  const profileBirthdate = editProfileForm.profileBirthdate.value;
  const profileEmail = editProfileForm.profileEmail.value;
  const profileContactNumber = editProfileForm.profileContactNumber.value;
  const profileGender = editProfileForm.profileGender.value;

  axios
    .post("/edit-profile", {
      profileFullName,
      profileBirthdate,
      profileEmail,
      profileContactNumber,
      profileGender,
    })
    .then((res) => {
      const url = new URL(window.location);
      url.searchParams.delete("firstTimeLogin");

      window.history.replaceState({}, document.title, url);

      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});

const { h, html } = window.gridjs;

window.addEventListener("load", () => {
  if (localStorage.getItem("viewAllPets") === "true") {
    setTimeout(() => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }, 1000);
    localStorage.removeItem("viewAllPets");
    return;
  }

  const urlParams = new URLSearchParams(window.location.search);
  const isFirstTime = urlParams.get("firstTimeLogin");

  const intro = introJs();

  if (localStorage.getItem("isProfileComplete") === "false") {
    intro.setOptions({
      steps: [
        {
          title: "Profile Update Required!",
          intro:
            "You need to complete your profile setup first before making an appointment.",
        },
      ],
      exitOnEsc: false,
      exitOnOverlayClick: false,
    });
    intro.onexit(() => {
      this.localStorage.removeItem("isProfileComplete");
    });

    return intro.start();
  }

  intro.setOptions({
    disableInteraction: true,
    steps: [
      {
        title: "Hello and welcome👋",
        intro:
          "Welcome to JPK Veterinary Clinic's Online System. To get started, let's setup your profile first 🙂",
      },
      {
        element: this.document.getElementById("step1"),
        intro: "This is your personal profile section.",
      },
      {
        element: this.document.getElementById("step2"),
        intro: "You can view your personal information here...",
      },
      {
        element: this.document.getElementById("editProfileBtn"),
        intro: "... and update them here.",
      },
      {
        element: this.document.getElementById("step4"),
        intro:
          "This is where you can view your list of pets. After making an appointment, they are recorded here for your reference.",
      },
    ],
    dontShowAgain: true,
    showProgress: true,
    showStepNumbers: true,
    exitOnEsc: false,
    exitOnOverlayClick: false,
  });

  intro.onbeforeexit(() => {
    const editBtn = document.querySelector(".button2");

    editBtn.setAttribute("data-hint", "Update your profile here");
    editBtn.setAttribute("data-hint-position", "middle-right");

    intro.addHints();

    axios
      .post("/update-is-first-time-login")
      .then((res) => {})
      .catch((error) => {
        console.error(error);
      });
  });

  if (isFirstTime) {
    intro.start();
  }
});

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "Pet ID", width: "200" },
      "Pet Name",
      "Animal",
      {
        name: "Breed",
        formatter: (cell, row) => {
          const intro = introJs();
          intro.setOptions({
            steps: [
              {
                title: "Pet Profile Update Required",
                intro: "Pet information needs to be updated.",
                element: document.querySelector(
                  `button[data-pet-id="${row.cells[0].data}"]`
                ),
              },
            ],
            exitOnEsc: false,
            exitOnOverlayClick: false,
          });
          intro.onexit(() => {
            const id = row.cells[0].data;

            window.location.href = `/owned-pets/${id}`;
          });

          return cell ? cell : intro.start();
        },
      },
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          return h(
            "button",
            {
              className: "button button1",
              "data-pet-id": row.cells[0].data,
              onClick: () => {
                const id = row.cells[0].data;

                window.location.href = `/owned-pets/${id}`;
              },
            },
            "View Pet Record"
          );
        },
      },
    ],
    server: {
      url: "/owned-pets",
      method: "GET",
      then: (data) =>
        data.map((item) => [item.id, item.name, item.animalType, item.breed]),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("pet-table"));
});

const profilePictureForm = document.getElementById("profilePictureForm");
const profilePicture = document.getElementById("profilePicture");
const selectedFile = document.getElementById("selectedFile");
const personalIcon = document.getElementById("personalIcon");
const uploadImageButton = document.getElementById("uploadImageButton");

profilePicture.addEventListener("change", (event) => {
  const file = event.target.files[0];

  if (file) {
    if (file.type.startsWith("image/")) {
      selectedFile.style.display = "block";
      uploadImageButton.style.display = "block";
      selectedFile.textContent = `Selected file: ${file.name}`;

      const reader = new FileReader();
      reader.onload = function (e) {
        personalIcon.src = e.target.result;
      };
      reader.readAsDataURL(file);
    } else {
      alert("Only images are allowed!");
      return;
    }
  }
});

function uploadImage() {
  const profilePictureFile = profilePicture.files[0];

  if (!profilePictureFile) return;

  const formData = new FormData();
  formData.append("profilePicture", profilePictureFile);

  axios
    .post("/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then((res) => {
      if (res.data.success) {
        personalIcon.src = res.data.imageUrl;
        window.location.reload();
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleReadAllNotifications(event) {
  event.preventDefault();

  axios
    .post("/read-all-notifications")
    .then((res) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleClickAddPet() {
  document.querySelector(".add-pet-modal").style.display = "flex";
}

function handleClickCloseAddPet() {
  document.querySelector(".add-pet-modal").style.display = "none";
}

const addPetForm = document.getElementById("add-pet-form");
addPetForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const petName = addPetForm.petName.value;
  const petBirthdate = addPetForm.petBirthdate.value;
  const animalType = addPetForm.animalType.value;
  const petBreed = addPetForm.petBreed.value;
  const petGender = addPetForm.petGender.value;

  axios
    .post("/add-pet", {
      petName,
      petBirthdate,
      animalType,
      petBreed,
      petGender,
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});
