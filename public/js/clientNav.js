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

function onScheduleAppointmentClick(event) {
  event.preventDefault();

  axios
    .get("/is-profile-complete")
    .then((res) => {
      if (!res.data.isProfileComplete) {
        localStorage.setItem("isProfileComplete", "false");

        return (window.location.href = "/personal-page");
      }

      localStorage.setItem("startAppointmentIntro", "true");
      window.location.href = "/appointment";
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

const { h, html } = window.gridjs;

window.addEventListener("load", () => {
  const calendarEl = document.getElementById("calendar-table");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    eventSources: ["/appointments-calendar"],
  });
  calendar.render();
});

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "id", hidden: true },
      { name: "Date and Time", sort: true },
      "Service",
      { name: "Date Approved", sort: true },
    ],
    width: "100%",
    server: {
      url: "/appointments-list",
      method: "GET",
      then: (data) =>
        data.map((item) => [
          item.id,
          dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
          item.service,
          item.dateApproved
            ? item.dateApproved !== "Pending"
              ? dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A")
              : "Pending"
            : "",
        ]),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
  }).render(document.getElementById("upcoming-appointments-table"));
});

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "Pet ID", hidden: true },
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
              className: "action-buttons",
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
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
  }).render(document.getElementById("animals-table"));
});

function viewAllAppointments() {
  localStorage.setItem("viewAllAppointments", "true");

  window.location.href = "/appointment";
}

function viewAllPets() {
  localStorage.setItem("viewAllPets", "true");

  window.location.href = "/personal-page";
}
