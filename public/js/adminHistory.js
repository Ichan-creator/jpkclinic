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

const { h, html } = window.gridjs;

const logoutModal = document.getElementById("logoutModal");

function handleCancelLogout() {
  logoutModal.style.display = "none";
}

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
        window.location.replace("/admin-login");
        setTimeout(() => {
          window.history.pushState(null, null, "/admin-login");
        }, 500);
      }
    })
    .catch((error) => {
      console.error("Logout failed:", error);
    });
}

function handleClickOpenNotif() {
  document.querySelector(".appointment-toggles").style.zIndex = 1;
}

function handleCloseNotif() {
  document.querySelector(".appointment-toggles").style.zIndex = 500;
}

const adminHistoryTable = new gridjs.Grid({
  columns: [
    {
      name: "Pet Name",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    {
      name: "Animal Type",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    { name: "Breed", formatter: (cell) => html(cell.replace(/\n/g, "<br />")) },
    "Treatment Date",
    "Service",
    {
      name: "Weight (kg)",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    {
      name: "Against",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    {
      name: "Manufacturer",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    {
      name: "Serial/Lot No.",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    {
      name: "Expired Date",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    {
      name: "Treatment Date Done",
      formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
    },
    "Veterinarian",
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
    url: `/admin-pet-records-list`,
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
            .map((pet) =>
              pet.appointment_pets.petWeight
                ? "- " + pet.appointment_pets.petWeight
                : ""
            )
            .join("\n"),
          item.pets
            .map((pet) =>
              pet.appointment_pets.against
                ? "- " + pet.appointment_pets.against
                : ""
            )
            .join("\n"),
          item.pets
            .map((pet) =>
              pet.appointment_pets.manufacturer
                ? "- " + pet.appointment_pets.manufacturer
                : ""
            )
            .join("\n"),
          item.pets
            .map((pet) =>
              pet.appointment_pets.serialLotNumber
                ? "- " + pet.appointment_pets.serialLotNumber
                : ""
            )
            .join("\n"),
          item.pets
            .map((pet) =>
              pet.appointment_pets.expiredDate
                ? "- " +
                  dayjs(pet.appointment_pets.expiredDate).format(
                    "MMMM DD, YYYY hh:mm A"
                  )
                : ""
            )
            .join("\n"),
          item.pets
            .map((pet) =>
              pet.appointment_pets.treatmentDateDone
                ? "- " +
                  dayjs(pet.appointment_pets.treatmentDateDone).format(
                    "MMMM DD, YYYY hh:mm A"
                  )
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
});

window.addEventListener("load", () => {
  adminHistoryTable.render(document.getElementById("adminHistoryTable"));
});

function getServerConfig(url) {
  let serverConfig = null;

  switch (url) {
    case "/admin-pet-records-list":
      serverConfig = {
        url: `/admin-pet-records-list`,
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
                .map((pet) =>
                  pet.appointment_pets.petWeight
                    ? "- " + pet.appointment_pets.petWeight
                    : ""
                )
                .join("\n"),
              item.pets
                .map((pet) =>
                  pet.appointment_pets.against
                    ? "- " + pet.appointment_pets.against
                    : ""
                )
                .join("\n"),
              item.pets
                .map((pet) =>
                  pet.appointment_pets.manufacturer
                    ? "- " + pet.appointment_pets.manufacturer
                    : ""
                )
                .join("\n"),
              item.pets
                .map((pet) =>
                  pet.appointment_pets.serialLotNumber
                    ? "- " + pet.appointment_pets.serialLotNumber
                    : ""
                )
                .join("\n"),
              item.pets
                .map((pet) =>
                  pet.appointment_pets.expiredDate
                    ? "- " +
                      dayjs(pet.appointment_pets.expiredDate).format(
                        "MMMM DD, YYYY hh:mm A"
                      )
                    : ""
                )
                .join("\n"),
              item.pets
                .map((pet) =>
                  pet.appointment_pets.treatmentDateDone
                    ? "- " +
                      dayjs(pet.appointment_pets.treatmentDateDone).format(
                        "MMMM DD, YYYY hh:mm A"
                      )
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
      };
      break;
    case "/admin-approved-appointment-list":
      serverConfig = {
        url: `/admin-approved-appointment-list`,
        method: "GET",
        then: (data) =>
          data.map((item) => {
            return [
              item.id,
              item.service,
              dayjs(item.appointmentDate).format("MMMM DD, YYYY hh:mm A"),
              item.dateApproved,
            ];
          }),
        handle: (res) => {
          if (res.status === 404) return { data: [] };
          if (res.ok) return res.json();

          throw Error("oh no :(");
        },
      };
      break;
    case "/admin-cancelled-appointment-list":
      serverConfig = {
        url: `/admin-cancelled-appointment-list`,
        method: "GET",
        then: (data) =>
          data.map((item) => {
            return [
              item.id,
              item.service,
              dayjs(item.appointmentDate).format("MMMM DD, YYYY hh:mm A"),
              item.dateApproved,
              item.note,
            ];
          }),
        handle: (res) => {
          if (res.status === 404) return { data: [] };
          if (res.ok) return res.json();

          throw Error("oh no :(");
        },
      };
      break;
    case "/admin-completed-appointment-list":
      serverConfig = {
        url: url,
        method: "GET",
        then: (data) =>
          data.map((item) => {
            console.log(item);
            return [
              item.user.fullName,
              item.pets.map((pet) => "- " + pet.name).join("\n"),
              item.pets.map((pet) => "- " + pet.animalType).join("\n"),
              item.pets.map((pet) => "- " + pet.breed).join("\n"),
              item.veterinarian,
              item.service,
              dayjs(item.appointmentDate).format("MMMM DD, YYYY hh:mm A"),
            ];
          }),
        handle: (res) => {
          if (res.status === 404) return { data: [] };
          if (res.ok) return res.json();

          throw Error("oh no :(");
        },
      };
      break;
  }

  return serverConfig;
}

document.querySelectorAll(".appointment-toggles button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active-history")) {
      return;
    }

    document
      .querySelectorAll(".appointment-toggles button")
      .forEach((btn) => btn.classList.remove("active-history"));
    button.classList.add("active-history");

    if (button.id === "petRecordsToggle") {
      adminHistoryTable
        .updateConfig({
          columns: [
            "Pet Name",
            "Animal Type",
            "Breed",
            "Treatment Date",
            "Service",
            "Weight (kg)",
            "Against",
            "Manufacturer",
            "Veterinarian",
          ],
          server: getServerConfig("/admin-pet-records-list"),
        })
        .forceRender();
    } else if (button.id === "approvedToggle") {
      adminHistoryTable
        .updateConfig({
          columns: [
            "Appointment ID",
            "Service",
            "Appointment Date",
            "Date Approved",
          ],
          server: getServerConfig("/admin-approved-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "cancelledToggle") {
      adminHistoryTable
        .updateConfig({
          columns: [
            "Appointment ID",
            "Service",
            "Appointment Date",
            "Date Approved",
            "Note",
          ],
          server: getServerConfig("/admin-cancelled-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "completedToggle") {
      adminHistoryTable
        .updateConfig({
          columns: [
            "Client Name",
            {
              name: "Pet Name",
              formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
            },
            {
              name: "Animal Type",
              formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
            },
            {
              name: "Breed",
              formatter: (cell) => html(cell.replace(/\n/g, "<br />")),
            },
            "Veterinarian",
            "Service",
            "Appointment Date",
          ],
          server: getServerConfig("/admin-completed-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    }
  });
});
