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

const { h } = window.gridjs;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      "#",
      "Name",
      "Animal",
      "Veterinarian",
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
            case "ONGOING":
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
    ],
    width: "100%",
    // height: "300px",
    server: {
      url: "/admin-appointment-requests",
      method: "GET",
      then: (data) =>
        data.map((item, index) => {
          return [
            index + 1,
            item["pet.name"],
            item["pet.animalType"],
            item.veterinarian,
            item.appointmentStatus,
          ];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
    search: true,
    language: {
      search: {
        placeholder: "🔍 Search...",
      },
    },
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
  }).render(document.getElementById("appointment-requests-table"));
});

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      "#",
      "Name",
      "Animal",
      "Veterinarian",
      "Service",
      {
        name: "Status",
        formatter: (cell, row) => {
          const status = row.cells[5].data;

          let statusClassName = "";

          switch (status) {
            case "PENDING":
              statusClassName = "pending-status";
              break;
            case "COMPLETE":
              statusClassName = "complete-status";
              break;
            case "ONGOING":
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
    ],
    width: "100%",
    server: {
      url: "/admin-medical-records",
      method: "GET",
      then: (data) =>
        data.map((item, index) => {
          return [
            index + 1,
            item["pet.name"],
            item["pet.animalType"],
            item.veterinarian,
            item.service,
            item.medicalRecordStatus,
          ];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
    search: true,
    language: {
      search: {
        placeholder: "🔍 Search...",
      },
    },
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
  }).render(document.getElementById("medical-records-table"));
});

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

function handleCancelLogout() {
  logoutModal.style.display = "none";
}
