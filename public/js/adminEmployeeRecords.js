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
      { name: "Admin ID", width: 200 },
      "Name",
      "User Type",
      "Email",
      {
        id: "action",
        name: "action",
        formatter: (cell, row) => {
          const editButton = h(
            "button",
            { className: "edit-button", onClick: () => {} },
            "Edit"
          );
          const deleteButton = h(
            "button",
            { className: "delete-button", onClick: () => {} },
            "Delete"
          );

          return [editButton, deleteButton];
        },
      },
    ],
    width: "100%",
    fixedHeader: true,
    pagination: {
      limit: 5,
      summary: true,
      resetPageOnUpdate: true,
    },
    search: true,
    server: {
      url: `/admin-employees-list`,
      method: "GET",
      then: (data) =>
        data.map((item) => {
          return [item.id, item.fullName, item.role, item.email];
        }),
      handle: (res) => {
        if (res.status === 404) return { data: [] };
        if (res.ok) return res.json();

        throw Error("oh no :(");
      },
    },
  }).render(document.getElementById("employeesTable"));
});

console.log(document.getElementById("action"));

window.addEventListener("load", () => {
  if (localStorage.getItem("addRecordToast")) {
    localStorage.removeItem("addRecordToast");

    const addRecordToast = document.getElementById("add-record-toast");
    addRecordToast.classList.add("show");

    setTimeout(() => {
      addRecordToast.classList.remove("show");
    }, 3000);
  }
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

function handleAddRecordClick() {
  document.querySelector(".add-record-modal").style.display = "flex";
}

function handleCloseAddRecord() {
  document.querySelector(".add-record-modal").style.display = "none";
}

const addRecordForm = document.getElementById("addRecordForm");
addRecordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const recordUsername = addRecordForm.recordUsername.value;
  const recordPassword = addRecordForm.recordPassword.value;
  const recordName = addRecordForm.recordName.value;
  const recordEmail = addRecordForm.recordEmail.value;

  axios
    .post("/add-record", {
      recordUsername,
      recordPassword,
      recordName,
      recordEmail,
    })
    .then((res) => {
      localStorage.setItem("addRecordToast", "true");
      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});
