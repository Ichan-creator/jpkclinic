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
      console.log(error);
    });
});

const { h, html } = window.gridjs;

window.addEventListener("load", () => {
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
        title: "Hello and welcome 👋",
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
      "Name",
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
