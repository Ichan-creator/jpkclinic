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
      { name: "Pet ID", width: 200 },
      "Name",
      "Owner Name",
      "Animal Type",
      "Breed",
      {
        id: "action",
        name: "Action",
        formatter: (cell, row) => {
          return h(
            "viewResultButton",
            {
              className: "view-result-button",
              onClick: () => {
                const petId = row.cells[0].data;

                window.location.href = `/admin-pet-repository/${petId}`;
              },
            },
            "View Result"
          );
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
      url: "/admin-pets-list",
      method: "GET",
      then: (data) =>
        data.map((item) => {
          return [
            item.id,
            item.name,
            item["user.fullName"],
            item.animalType,
            item.breed,
            null,
          ];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("petsTable"));
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
