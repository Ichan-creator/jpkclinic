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
      const tooltip = document.getElementById("event-tooltip");
      const tooltipContent = document.getElementById("event-tooltip-content");

      const formattedAppointmentDate = dayjs(info.event.start).format("MMMM D, YYYY - hh:mm A");

      tooltipContent.innerHTML = `Service: ${info.event.title}<br />Date: ${formattedAppointmentDate}`;

      tooltip.style.display = "block";
      tooltip.style.left = info.jsEvent.clientX + 10 + "px";
      tooltip.style.top = info.jsEvent.clientY + 10 + "px";
    },
    eventMouseLeave: function (info) {
      const tooltip = document.getElementById("event-tooltip");
      tooltip.style.display = "none";
    },
  });
  calendar.render();
});

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "id", hidden: true },
      { name: "petNames", hidden: true },
      { name: "userId", hidden: true },
      "Client Name",
      { name: "Date & Time", sort: true },
      "Service",
      { name: "Date Approved", sort: true },
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          const isApproved = row.cells[6].data !== "Pending";

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
                const approveAppointment = confirm(
                  "Are you sure you want to approve this appointment?"
                );

                if (approveAppointment) {
                  axios
                    .post("/approve-appointment", {
                      appointmentId: row.cells[0].data,
                      userId: row.cells[2].data,
                      appointmentDate: row.cells[4].data,
                      service: row.cells[5].data,
                      petNames: row.cells[1].data,
                      type: "approved",
                    })
                    .then((res) => {
                      location.reload();
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              },
            },
            "Approve Appointment"
          );

          const rejectAppointment = h(
            "button",
            {
              className: `${
                isApproved
                  ? "disabled-reject-appointment"
                  : "reject-appointment"
              }`,
              disabled: isApproved ? true : false,
              onClick: () => {
                const rejectAppointment = confirm(
                  "Are you sure you want to reject this appointment?"
                );

                if (rejectAppointment) {
                  axios
                    .post("/reject-appointment", {
                      appointmentId: row.cells[0].data,
                      dateAndTime: row.cells[3].data,
                      userId: row.cells[1].data,
                      service: row.cells[4].data,
                      type: "rejected",
                    })
                    .then((res) => {
                      location.reload();
                    })
                    .catch((error) => {
                      console.error(error);
                    });
                }
              },
            },
            "Reject Appointment"
          );

          return [approveAppointment, rejectAppointment];
        },
      },
    ],
    width: "100%",
    height: "430px",
    server: {
      url: "/admin-appointment-list",
      method: "GET",
      then: (data) =>
        data.map((item) => {
          return [
            item.id,
            item.petNames,
            item["user.id"],
            item["user.fullName"],
            dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
            item.service,
            item.dateApproved
              ? item.dateApproved !== "Pending"
                ? dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A"): "Pending" : "",
            null,
          ];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
    fixedHeader: true,
    pagination: {
      limit: 10,
      summary: true,
      resetPageOnUpdate: true,
    },
  }).render(document.getElementById("appointments"));
});

window.addEventListener("click", (event) => {
  if (event.target == appointmentModal) {
    appointmentModal.style.display = "none";
  }
});

function handleCloseAppointmentList() {
  appointmentModal.style.display = "none";
}

function handleLogout(event) {
  event.preventDefault();

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
