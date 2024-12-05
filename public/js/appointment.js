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

function onScheduleAppointmentClick() {
  localStorage.setItem("startAppointmentIntro", "true");
}

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

const appointmentDateInput = document.getElementById("appointmentDate");
const newAppointmentDateInput = document.getElementById("newAppointmentDate");
appointmentDateInput.setAttribute("min", dayjs().format("YYYY-MM-DDTHH:mm"));
newAppointmentDateInput.setAttribute("min", dayjs().format("YYYY-MM-DDTHH:mm"));

appointmentDateInput.addEventListener("input", function (event) {
  const selectedDate = new Date(appointmentDateInput.value);

  const day = selectedDate.getUTCDay();
  if (day === 0) {
    document.querySelector(".calendar-modal").style.display = "flex";
    appointmentDateInput.value = "";
    appointmentDateInput.blur();
  }
});

newAppointmentDateInput.addEventListener("input", function () {
  const selectedDate = new Date(newAppointmentDateInput.value);
  const day = selectedDate.getUTCDay();
  if (day === 0) {
    document.querySelector(".new-date-modal").style.display = "none";
    document.querySelector(".calendar-modal").style.display = "flex";
    newAppointmentDateInput.value = "";
    newAppointmentDateInput.blur();
  }
});

const formModal = document.getElementById("formModal");
const appointmentModal = document.getElementById("appointmentModal");

const { h } = window.gridjs;

let appointmentId = null;

window.addEventListener("load", () => {
  const calendarEl = document.getElementById("calendar");
  const calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: "dayGridMonth",
    customButtons: {
      makeAppointmentBtn: {
        text: "Make Appointment",
        click: () => {
          axios
            .get("/is-profile-complete")
            .then((res) => {
              if (!res.data.isProfileComplete) {
                localStorage.setItem("isProfileComplete", "false");

                return (window.location.href = "/personal-page");
              }

              formModal.style.display = "block";
              formModal.style.zIndex = 200;
            })
            .catch((error) => {
              console.error(error);
            });
        },
      },
      appointmentListBtn: {
        text: "Appointments",
        click: () => {
          appointmentModal.style.display = "block";
        },
      },
    },
    datesSet: () => {
      document
        .querySelector(".fc-makeAppointmentBtn-button")
        .setAttribute("data-intro", "You can make your appointments here.");
      document
        .querySelector(".fc-appointmentListBtn-button")
        .setAttribute(
          "data-intro",
          "And view all of them here after making an appointment."
        );

      if (localStorage.getItem("startAppointmentIntro") === "true") {
        localStorage.removeItem("startAppointmentIntro");

        const intro = introJs();

        intro.setOptions({
          dontShowAgain: true,
          showProgress: true,
          showStepNumbers: true,
          exitOnEsc: false,
          exitOnOverlayClick: false,
        });

        intro.start();
      }
    },
    headerToolbar: {
      start: "title",
      center: "makeAppointmentBtn appointmentListBtn",
      end: "prevYear,prev today next,nextYear",
    },
    events: recurringEvents,
    eventSources: ["/appointments-calendar"],
    eventMouseEnter: function (info) {
      const tooltip = document.getElementById("event-tooltip");
      const tooltipContent = document.getElementById("event-tooltip-content");

      const formattedAppointmentDate = dayjs(info.event.start).format(
        "MMMM D, YYYY - hh:mm A"
      );

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

let newAppointmentScheduleId = null;
let dateAndTime = null;
let service = null;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "id", hidden: true },
      { name: "Date and Time", sort: true },
      "Service",
      { name: "Date Approved", sort: true },
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          const statusCol = row.cells[3].data;

          const isApproved =
            statusCol !== "Pending" && statusCol !== "CANCELLED";

          const actionArr = [
            h(
              "button",
              {
                className: `${
                  isApproved ? "approved-appointment" : "cancel-appointment"
                }`,
                disabled: isApproved ? true : false,
                onClick: () => {
                  document.querySelector(
                    ".cancel-appointment-modal"
                  ).style.display = "flex";

                  appointmentId = row.cells[0].data;
                  dateAndTime = row.cells[1].data;
                  service = row.cells[2].data;
                },
              },
              "Cancel Appointment"
            ),
            h(
              "button",
              {
                className: "reschedule-appointment",
                onClick: () => {
                  newAppointmentScheduleId = row.cells[0].data;
                  document.querySelector(".new-date-modal").style.display =
                    "flex";
                },
              },
              "Reschedule"
            ),
          ];

          return isApproved
            ? null
            : statusCol === "CANCELLED"
            ? actionArr[1]
            : actionArr;
        },
      },
    ],
    width: "100%",
    height: "430px",
    server: {
      url: "/appointments-list",
      method: "GET",
      then: (data) =>
        data.map((item) => {
          const dateApproved = item.dateApproved;
          const appointmentStatus = item.appointmentStatus;

          return [
            item.id,
            dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
            item.service,
            dateApproved !== "Pending" && dateApproved !== "CANCELLED"
              ? item.appointmentStatus === "CANCELLED"
                ? "CANCELLED"
                : dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A")
              : "Pending",
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
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
  }).render(document.getElementById("appointments"));
});

window.addEventListener("load", () => {
  if (localStorage.getItem("updatePetProfile") === "true") {
    const intro = introJs();
    intro.setOptions({
      steps: [
        {
          title: "Pet Profile Update Required",
          intro:
            "Pet information needs to be updated after making an appointment with a new pet.",
        },
      ],
      exitOnEsc: false,
      exitOnOverlayClick: false,
    });
    intro.onexit(() => {
      window.location.href = "/personal-page";
    });
    localStorage.removeItem("updatePetProfile");
    intro.start();
  }

  if (localStorage.getItem("rescheduleSuccess") === "true") {
    localStorage.removeItem("rescheduleSuccess");
    document.querySelector(".reschedule-success-modal").style.display = "flex";
  }

  if (localStorage.getItem("viewAllAppointments") === "true") {
    document
      .querySelector(
        ".fc-appointmentListBtn-button.fc-button.fc-button-primary"
      )
      .click();

    localStorage.removeItem("viewAllAppointments");
    return;
  }
});

window.addEventListener("click", function (event) {
  if (event.target == formModal) {
    formModal.style.display = "none";
  }
  if (event.target == appointmentModal) {
    appointmentModal.style.display = "none";
  }
});

const petNames = document.getElementById("petNames");

const appointmentForm = document.getElementById("appointment-form");
appointmentForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const userId = appointmentForm.userId.value;
  const petNames = appointmentForm.petNames.value;
  const service = appointmentForm.service.value;
  const gender = appointmentForm.gender.value;
  const concern = appointmentForm.concern.value;
  const contactNumber = appointmentForm.contactNumber.value;
  const email = appointmentForm.email.value;
  const appointmentDate = appointmentForm.appointmentDate.value;
  const veterinarian = appointmentForm.veterinarian.value;

  axios
    .post("/check-availability", { appointmentDate, veterinarian })
    .then((res) => {
      return axios.post("/book-appointment", {
        userId,
        petNames,
        service,
        gender,
        concern,
        contactNumber,
        email,
        appointmentDate,
        veterinarian,
      });
    })
    .then((res2) => {
      if (!res2.data.hasExistingPetRecord) {
        localStorage.setItem("updatePetProfile", "true");
      }

      formModal.style.display = "none";

      setTimeout(() => {
        document.querySelector(".appointment-success-modal").style.display =
          "flex";
      }, 600);
    })
    .catch((error) => {
      document.querySelector(".availability-modal").style.display = "flex";
      console.error(error);
      return;
    });
});

const petNameInput = document.getElementById("petNames");
const genderInput = document.getElementById("gender");

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

function handleCloseForm() {
  formModal.style.display = "none";
}

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

function handleShowNotif() {
  const calendarBtn = document.querySelectorAll(".fc-toolbar-chunk")[2];

  calendarBtn.style.zIndex = 10;
}

function handleCloseNotif() {
  const calendarBtn = document.querySelectorAll(".fc-toolbar-chunk")[2];

  calendarBtn.style.zIndex = 100;
}

function handleOkClick() {
  document.querySelector(".appointment-success-modal").style.display = "none";
  window.location.reload();
}

function handleRescheduleOkClick() {
  document.querySelector(".reschedule-success-modal").style.display = "none";
}

function handleCloseAppointmentSuccess() {
  document.querySelector(".appointment-success-modal").style.display = "none";
  window.location.reload();
}

function handleCloseRescheduleSuccess() {
  document.querySelector(".reschedule-success-modal").style.display = "none";
}

function handleCancelAppointment() {
  axios
    .post("/cancel-appointment", { appointmentId, dateAndTime, service })
    .then((res) => {
      location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
}

function handleCloseCancelAppointment() {
  document.querySelector(".cancel-appointment-modal").style.display = "none";
  appointmentId = null;
}

function handleCloseCalendarModal() {
  document.querySelector(".calendar-modal").style.display = "none";
}

function handleCloseAvailabilityModal() {
  document.querySelector(".availability-modal").style.display = "none";
}

function handleCloseNewDateModal() {
  newAppointmentDateInput.value = null;
  document.querySelector(".new-date-modal").style.display = "none";
}

const rescheduleForm = document.getElementById("reschedule-form");
rescheduleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  axios
    .post("/reschedule-appointment", {
      appointmentId: newAppointmentScheduleId,
      newDate: rescheduleForm.newAppointmentDate.value,
    })
    .then((res) => {
      localStorage.setItem("rescheduleSuccess", "true");
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});
