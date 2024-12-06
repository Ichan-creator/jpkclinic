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
    { name: "Admin ID", width: 200 },
    { name: "Username", hidden: true },
    { name: "Password", hidden: true },
    "Name",
    "User Type",
    "Email",
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
    url: `/admin-pending-appointment-list`,
    method: "GET",
    then: (data) =>
      data.map((item) => {
        return [
          item.id,
          item.name,
          item.password,
          item.fullName,
          item.role,
          item.email,
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
  return {
    url: url,
    method: "GET",
    then: (data) =>
      data.map((item) => [
        item.id,
        item["user.id"],
        item["user.fullName"],
        dayjs(item.appointmentDate).format("MMMM DD, YYYY - hh:mm A"),
        item.service,
        item.petNames,
        item.dateApproved === "Pending"
          ? "Pending"
          : item.dateApproved === "CANCELLED"
          ? "CANCELLED"
          : dayjs(item.dateApproved).format("MMMM DD, YYYY - hh:mm A"),
        null,
      ]),
    handle: (res) => {
      if (res.status === 404) return { data: [] };
      if (res.ok) return res.json();

      throw Error("oh no :(");
    },
  };
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
      adminHistoryTable
        .updateConfig({
          server: getServerConfig("/admin-pending-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "approvedToggle") {
      adminHistoryTable
        .updateConfig({
          server: getServerConfig("/admin-approved-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "cancelledToggle") {
      adminHistoryTable
        .updateConfig({
          server: getServerConfig("/admin-cancelled-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    } else if (button.id === "completedToggle") {
      adminHistoryTable
        .updateConfig({
          server: getServerConfig("/admin-completed-appointment-list"),
          noRecordsFound: "No matching records found",
        })
        .forceRender();
    }
  });
});
