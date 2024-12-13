const recurringEvents = [
  {
    title: "New Year's Day",
    rrule: {
      freq: "yearly",
      bymonth: 1,
      bymonthday: 1,
    },
  },
  {
    title: "Day of Valor",
    rrule: {
      freq: "yearly",
      bymonth: 4,
      bymonthday: 9,
    },
  },
  {
    title: "Labor Day",
    rrule: {
      freq: "yearly",
      bymonth: 5,
      bymonthday: 1,
    },
  },
  {
    title: "Independence Day",
    rrule: {
      freq: "yearly",
      bymonth: 6,
      bymonthday: 12,
    },
  },
  {
    title: "Ninoy Aquino Day",
    rrule: {
      freq: "yearly",
      bymonth: 8,
      bymonthday: 21,
    },
  },
  {
    title: "National Heroes Day",
    rrule: {
      freq: "yearly",
      bymonth: 8,
      bymonthday: 26,
    },
  },
  {
    title: "All Saints' Day",
    rrule: {
      freq: "yearly",
      bymonth: 11,
      bymonthday: 1,
    },
  },
  {
    title: "All Souls' Day",
    rrule: {
      freq: "yearly",
      bymonth: 11,
      bymonthday: 2,
    },
  },
  {
    title: "Bonifacio Day",
    rrule: {
      freq: "yearly",
      bymonth: 11,
      bymonthday: 30,
    },
  },
  {
    title: "Feast of the Immaculate Conception of Mary",
    rrule: {
      freq: "yearly",
      bymonth: 12,
      bymonthday: 8,
    },
  },
  {
    title: "Christmas Eve",
    rrule: {
      freq: "yearly",
      bymonth: 12,
      bymonthday: 24,
    },
  },
  {
    title: "Christmas Day",
    rrule: {
      freq: "yearly",
      bymonth: 12,
      bymonthday: 25,
    },
  },
  {
    title: "Rizal Day",
    rrule: {
      freq: "yearly",
      bymonth: 12,
      bymonthday: 30,
    },
  },
  {
    title: "New Year's Eve",
    rrule: {
      freq: "yearly",
      bymonth: 12,
      bymonthday: 31,
    },
  },
];

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

const appointmentModal = document.getElementById("appointmentModal");

window.addEventListener("load", () => {
  const calendarEl = document.getElementById("adminCalendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    customButtons: {
      appointmentListBtn: {
        text: "Appointments",
        click: () => {
          appointmentModal.style.display = "block";
        },
      },
    },
    headerToolbar: {
      start: "title",
      center: "appointmentListBtn",
      end: "prevYear,prev today next,nextYear",
    },
    events: recurringEvents,
    eventSources: ["/admin-appointments-calendar"],
    eventMouseEnter: function (info) {
      const formattedAppointmentDate = dayjs(info.event.start).format(
        "MMMM D, YYYY - hh:mm A"
      );

      tippy(info.el, {
        content: `Service: ${info.event.title}<br />Date: ${formattedAppointmentDate}`,
        allowHTML: true,
      });
    },
  });
  calendar.render();
});

let appointmentsListTable = new gridjs.Grid({
  columns: [
    { name: "id", hidden: true },
    { name: "userId", hidden: true },
    "Client Name",
    { name: "Date & Time", sort: true },
    "Service",
    { name: "petNames", hidden: true },
    { name: "Date Approved", sort: true },
    {
      id: "action",
      name: "",
      formatter: (cell, row) => {
        const isApproved = row.cells[6].data !== "Pending";

        const buttonText = isApproved ? "Approved" : "Approve Appointment";

        const approveAppointment = h(
          "button",
          {
            className: `${
              isApproved
                ? "disabled-approve-appointment"
                : "approve-appointment"
            }`,
            disabled: isApproved ? true : false,
            onClick: () => {
              document.querySelector(".approve-confirm-modal").style.display =
                "flex";

              const modal = document.querySelector(".approve-confirm-modal");
              modal.dataset.appointmentId = row.cells[0].data;
              modal.dataset.userId = row.cells[1].data;
              modal.dataset.appointmentDate = row.cells[3].data;
              modal.dataset.service = row.cells[4].data;
              modal.dataset.petNames = row.cells[5].data;
            },
          },
          `${buttonText}`
        );

        return approveAppointment;
      },
    },
  ],
  width: "100%",
  height: "430px",
  server: getServerConfig("/admin-pending-appointment-list"),
  fixedHeader: true,
  pagination: {
    limit: 10,
    summary: true,
    resetPageOnUpdate: true,
  },
});

function getServerConfig(url) {
  let serverConfig = null;

  switch (url) {
    case "/admin-pending-appointment-list":
      serverConfig = {
        url,
        method: "GET",
        then: (data) =>
          data.map((item) => {
            console.log(item);
            return [
              item.id,
              item.user.id,
              item.user.fullName,
              dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
              item.service,
              item.petNames,
              item.dateApproved === "Pending"
                ? "Pending"
                : item.dateApproved === "CANCELLED"
                ? "CANCELLED"
                : dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A"),
              null,
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
        url,
        method: "GET",
        then: (data) =>
          data.map((item) => {
            return [
              item.user.fullName,
              dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
              item.service,
              item.dateApproved === "Pending"
                ? "Pending"
                : item.dateApproved === "CANCELLED"
                ? "CANCELLED"
                : dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A"),
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
        url,
        method: "GET",
        then: (data) =>
          data.map((item) => [
            item.user.fullName,
            dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
            item.service,
            item.dateApproved === "Pending"
              ? "Pending"
              : item.dateApproved === "CANCELLED"
              ? "CANCELLED"
              : dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A"),
          ]),
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

window.addEventListener("load", () => {
  appointmentsListTable.render(document.getElementById("appointments"));
});

window.addEventListener("click", (event) => {
  if (event.target == appointmentModal) {
    appointmentModal.style.display = "none";
  }
});

function handleCloseAppointmentList() {
  appointmentModal.style.display = "none";
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

function handleApproveConfirm() {
  const modal = document.querySelector(".approve-confirm-modal");
  const appointmentId = modal.dataset.appointmentId;
  const userId = modal.dataset.userId;
  const appointmentDate = modal.dataset.appointmentDate;
  const service = modal.dataset.service;
  const petNames = modal.dataset.petNames;

  axios
    .post("/approve-appointment", {
      appointmentId,
      userId,
      appointmentDate,
      service,
      petNames,
      type: "approved",
    })
    .then((res) => {
      const toast = document.getElementById("toast");
      toast.classList.add("notif-show");

      setTimeout(() => {
        toast.classList.remove("show");
        window.location.reload();
      }, 3000);
    })
    .catch((error) => {
      console.error(error);
    })
    .finally(() => {
      document.querySelector(".approve-confirm-modal").style.display = "none";
    });
}

function handleApproveCancelConfirm() {
  document.querySelector(".approve-confirm-modal").style.display = "none";
}

document.querySelectorAll(".appointment-toggles button").forEach((button) => {
  button.addEventListener("click", () => {
    if (button.classList.contains("active")) {
      return;
    }

    document
      .querySelectorAll(".appointment-toggles button")
      .forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");

    if (button.id === "pendingToggle") {
      appointmentsListTable
        .updateConfig({
          columns: [
            { name: "id", hidden: true },
            { name: "userId", hidden: true },
            "Client Name",
            { name: "Date & Time", sort: true },
            "Service",
            { name: "petNames", hidden: true },
            { name: "Date Approved", sort: true },
            {
              id: "action",
              name: "",
              formatter: (cell, row) => {
                const isApproved = row.cells[6].data !== "Pending";

                const buttonText = isApproved
                  ? "Approved"
                  : "Approve Appointment";

                const approveAppointment = h(
                  "button",
                  {
                    className: `${
                      isApproved
                        ? "disabled-approve-appointment"
                        : "approve-appointment"
                    }`,
                    disabled: isApproved ? true : false,
                    onClick: () => {
                      document.querySelector(
                        ".approve-confirm-modal"
                      ).style.display = "flex";

                      const modal = document.querySelector(
                        ".approve-confirm-modal"
                      );
                      modal.dataset.appointmentId = row.cells[0].data;
                      modal.dataset.userId = row.cells[1].data;
                      modal.dataset.appointmentDate = row.cells[3].data;
                      modal.dataset.service = row.cells[4].data;
                      modal.dataset.petNames = row.cells[5].data;
                    },
                  },
                  `${buttonText}`
                );

                return approveAppointment;
              },
            },
          ],
          server: getServerConfig("/admin-pending-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "approvedToggle") {
      appointmentsListTable
        .updateConfig({
          columns: ["Client Name", "Date & Time", "Service", "Date Approved"],
          server: getServerConfig("/admin-approved-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "cancelledToggle") {
      appointmentsListTable
        .updateConfig({
          server: getServerConfig("/admin-cancelled-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    }
  });
});

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

function handleShowNotif() {
  const calendarBtn = document.querySelectorAll(".fc-toolbar-chunk")[2];

  calendarBtn.style.zIndex = 10;
}

function handleCloseNotif() {
  const calendarBtn = document.querySelectorAll(".fc-toolbar-chunk")[2];

  calendarBtn.style.zIndex = 100;
}
