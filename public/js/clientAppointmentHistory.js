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

const { h, html } = window.gridjs;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      {
        name: "Pet Name(s)",
        width: "150px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Animal Type",
        width: "150px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Breed",
        width: "120px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      { name: "Treatment Date", width: "170px" },
      { name: "Service", width: "130px" },
      {
        name: "Weight (kg)",
        width: "150px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Against",
        width: "150px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Manufacturer",
        width: "170px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Serial/Lot No.",
        width: "160px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Expired Date",
        width: "150px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Treatment Date Done",
        width: "220px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
      {
        name: "Veterinarian",
        width: "160px",
        formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
      },
    ],
    width: "100%",
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
    search: true,
    language: {
      search: {
        placeholder: "🔍 Search...",
      },
    },
    server: {
      url: `/appointments-history-list`,
      method: "GET",
      then: (data) =>
        data.map((item) => {
          return [
            item.pets.map((pet) => "- " + pet.name).join("\n"),
            item.pets.map((pet) => "- " + pet.animalType).join("\n"),
            item.pets.map((pet) => "- " + pet.breed).join("\n"),
            dayjs(item.appointmentDate).format("MMMM DD, YYYY hh:mm A"),
            item.service,
            item.pets
              .map((pet) => (pet.petWeight ? "- " + pet.petWeight : ""))
              .join("\n"),
            item.pets
              .map((pet) => (pet.against ? "- " + pet.against : ""))
              .join("\n"),
            item.pets
              .map((pet) => (pet.manufacturer ? "- " + pet.manufacturer : ""))
              .join("\n"),
            item.pets
              .map((pet) =>
                pet.serialLotNumber ? "- " + pet.serialLotNumber : ""
              )
              .join("\n"),
            item.pets
              .map((pet) => (pet.expiredDate ? "- " + pet.expiredDate : ""))
              .join("\n"),
            item.pets
              .map((pet) =>
                pet.treatmentDateDone
                  ? "- " +
                    dayjs(pet.treatmentDateDone).format("MMMM DD, YYYY hh:mm A")
                  : ""
              )
              .join("\n"),
            item.veterinarian,
          ];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("clientAppointmentHistoryTable"));
});

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
