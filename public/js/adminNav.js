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

let appointmentId = null;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "id", hidden: true },
      "#",
      "Client Name",
      "Pet Name",
      "Animal",
      "Veterinarian",
      "Appointment Date",
      {
        name: "Status",
        formatter: (cell, row) => {
          const status = row.cells[7].data;

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

          return h(
            "statusData",
            {
              className: statusClassName,
            },
            status
          );
        },
      },
      {
        name: "Action",
        formatter: (cell, row) => {
          const appointmentStatus = row.cells[7].data;

          return appointmentStatus === "COMPLETE"
            ? h(
                "button",
                {
                  disabled: row.cells[7].data === "CANCELLED" ? true : false,
                  className:
                    row.cells[7].data === "CANCELLED"
                      ? "disabled-cancel-appointment"
                      : "cancel-appointment",
                  onClick: () => {
                    document.querySelector(
                      ".cancel-appointment-modal"
                    ).style.display = "flex";

                    appointmentId = row.cells[0].data;
                  },
                },
                "Cancel"
              )
            : null;

          // return appointmentStatus !== "PENDING"
          //   ? h(
          //       "button",
          //       {
          //         disabled: row.cells[7].data === "CANCELLED" ? true : false,
          //         className:
          //           row.cells[7].data === "CANCELLED"
          //             ? "disabled-cancel-appointment"
          //             : "cancel-appointment",
          //         onClick: () => {
          //           document.querySelector(
          //             ".cancel-appointment-modal"
          //           ).style.display = "flex";

          //           appointmentId = row.cells[0].data;
          //         },
          //       },
          //       "Cancel"
          //     )
          //   : null;
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
            item.id,
            index + 1,
            item["pet.user.fullName"],
            item["pet.name"],
            item["pet.animalType"],
            item.veterinarian,
            dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
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
      "Pet Name",
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

function handleCancelAppointment() {
  axios
    .post("/admin-cancel-appointment", { appointmentId })
    .then((res) => {
      location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleCloseCancelAppointment() {
  document.querySelector(".cancel-appointment-modal").style.display = "none";
  appointmentId = null;
}
