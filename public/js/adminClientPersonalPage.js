const showNavbar = (toggleId, navId, bodyId, headerId) => {
  const toggle = document.getElementById(toggleId),
    nav = document.getElementById(navId),
    bodypd = document.getElementById(bodyId),
    headerpd = document.getElementById(headerId);

  if (nav && bodypd && headerpd) {
      nav.addEventListener("mouseenter", () => {
      nav.classList.add("show");

      toggle.classList.add("bx-x");

      bodypd.classList.add("body-pd");
      headerpd.classList.add("body-pd");
    });

      nav.addEventListener("mouseleave", () => {
      nav.classList.remove("show");

      toggle.classList.remove("bx-x");

      bodypd.classList.remove("body-pd");
      headerpd.classList.remove("body-pd");
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

const currentPath = window.location.pathname;

const pathSegments = currentPath.split("/");
const userId = pathSegments[pathSegments.length - 1];

const editProfileForm = document.getElementById("profile-modal-form");
editProfileForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const profileFullName = editProfileForm.profileFullName.value;
  const profileBirthdate = editProfileForm.profileBirthdate.value;
  const profileEmail = editProfileForm.profileEmail.value;
  const profileContactNumber = editProfileForm.profileContactNumber.value;
  const profileGender = editProfileForm.profileGender.value;

  axios
    .post("/admin-edit-client-profile", {
      profileFullName,
      profileBirthdate,
      profileEmail,
      profileContactNumber,
      profileGender,
      userId,
    })
    .then((res) => {
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
});

const { h } = window.gridjs;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "Pet ID", width: "200" },
      "Pet Name",
      "Animal",
      "Breed",
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          return h(
            "button",
            {
              className: "button button1",
              onClick: () => {
                const id = row.cells[0].data;

                window.location.href = `/admin-owned-pets/${id}`;
              },
            },
            "View Pet Record"
          );
        },
      },
    ],
    server: {
      url: `/admin-client-owned-pets/${userId}`,
      method: "GET",
      then: (data) =>
        data.map((item) => [
          item.id,
          item.name,
          item.animalType,
          item.breed,
          item.status,
        ]),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("pet-table"));
});
