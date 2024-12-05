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
                    const cancelModal = document.querySelector(
                      ".cancel-appointment-modal"
                    );
                    cancelModal.style.display = "flex";
                    cancelModal.dataset.appointmentId = row.cells[0].data;
                    cancelModal.dataset.userId = row.cells[8].data;
                    cancelModal.dataset.appointmentDate = row.cells[6].data;
                    cancelModal.dataset.service = row.cells[9].data;

                    appointmentId = row.cells[0].data;
                  },
                },
                "Cancel"
              )
            : null;
        },
      },
      {
        name: "User ID",
        hidden: true,
      },
      { name: "Service", hidden: true },
    ],
    width: "100%",
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
            item["pet.user.id"],
            item.service,
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

function handleCloseCancelAppointment() {
  document.querySelector(".cancel-appointment-modal").style.display = "none";
  appointmentId = null;
}

function handleCancelAppointmentConfirm() {
  const modal = document.querySelector(".cancel-appointment-modal");
  const appointmentId = modal.dataset.appointmentId;
  const userId = modal.dataset.userId;
  const appointmentDate = modal.dataset.appointmentDate;
  const service = modal.dataset.service;

  axios
    .post("/admin-cancel-appointment", {
      appointmentId,
      userId,
      appointmentDate,
      service,
      type: "cancelled",
    })
    .then((res) => {
      const cancelToast = document.getElementById("toast-cancel");
      cancelToast.classList.add("show");

      setTimeout(() => {
        cancelToast.classList.remove("show");
        window.location.reload();
      }, 3000);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      document.querySelector(".cancel-appointment-modal").style.display =
        "none";
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
