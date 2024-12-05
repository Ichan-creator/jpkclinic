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

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "id", hidden: true },
      "Client Name",
      "Email",
      "Phone Number",
      {
        id: "action",
        name: "",
        formatter: (cell, row) => {
          const editRecord = h(
            "button",
            {
              className: "edit-record",
              onClick: () => {
                const id = row.cells[0].data;

                window.location.href = `/admin-client-personal-page/${id}`;
              },
            },
            "Edit Record"
          );

          return [editRecord];
        },
      },
    ],
    width: "100%",
    fixedHeader: true,
    pagination: {
      limit: 10,
      summary: true,
      resetPageOnUpdate: true,
    },
    search: true,

    server: {
      url: "/admin-client-list",
      method: "GET",
      then: (data) =>
        data.map((item) => [
          item.id,
          item.fullName,
          item.email,
          item.contactNumber,
        ]),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("clientTable"));
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
