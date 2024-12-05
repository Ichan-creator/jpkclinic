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

let adminUserId = null;

window.addEventListener("load", () => {
  new gridjs.Grid({
    columns: [
      { name: "Admin ID", width: 200 },
      { name: "Username", hidden: true },
      { name: "Password", hidden: true },
      "Name",
      "User Type",
      "Email",
      {
        id: "action",
        name: "action",
        formatter: (cell, row) => {
          const editButton = h(
            "button",
            {
              className: "edit-button",
              onClick: () => {
                const editRecordModal =
                  document.querySelector(".edit-record-modal");
                editRecordModal.style.display = "flex";

                document.getElementById("editRecordId").value =
                  row.cells[0].data;
                document.getElementById("editRecordUsername").value =
                  row.cells[1].data;
                document.getElementById("editRecordUserType").value =
                  row.cells[4].data;
                document.getElementById("editRecordName").value =
                  row.cells[3].data;
                document.getElementById("editRecordEmail").value =
                  row.cells[5].data;
              },
            },
            "Edit"
          );
          const deleteButton = h(
            "button",
            {
              className: "delete-button",
              onClick: () => {
                adminUserId = row.cells[0].data;
                document.querySelector(".delete-record-modal").style.display =
                  "flex";
              },
            },
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
    language: {
      search: {
        placeholder: "🔍 Search...",
      },
    },
    server: {
      url: `/admin-employees-list`,
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
  }).render(document.getElementById("employeesTable"));
});

window.addEventListener("load", () => {
  if (localStorage.getItem("addRecordToast")) {
    localStorage.removeItem("addRecordToast");

    const addRecordToast = document.getElementById("add-record-toast");
    addRecordToast.classList.add("show");

    setTimeout(() => {
      addRecordToast.classList.remove("show");
    }, 3000);
  }

  if (localStorage.getItem("editRecordToast")) {
    localStorage.removeItem("editRecordToast");

    const editRecordToast = document.getElementById("edit-record-toast");
    editRecordToast.classList.add("show");

    setTimeout(() => {
      editRecordToast.classList.remove("show");
    }, 3000);
  }

  if (localStorage.getItem("deleteRecordToast")) {
    localStorage.removeItem("deleteRecordToast");

    const deleteRecordToast = document.getElementById("delete-record-toast");
    deleteRecordToast.classList.add("show");

    setTimeout(() => {
      deleteRecordToast.classList.remove("show");
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

function handleCloseEditRecord() {
  document.querySelector(".edit-record-modal").style.display = "none";
}

function handleDeleteRecordConfirm() {
  axios
    .post("/delete-record", { adminUserId })
    .then((res) => {
      localStorage.setItem("deleteRecordToast", "true");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
}

function handleCloseDeleteRecord() {
  document.querySelector(".delete-record-modal").style.display = "none";
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
      const existingRecordToast = document.getElementById(
        "existing-record-toast"
      );
      document.querySelector(".existing-record-message-toast").textContent =
        error.response.data.message;

      existingRecordToast.classList.add("show");

      setTimeout(() => {
        existingRecordToast.classList.remove("show");
      }, 3000);

      console.error(error);
    });
});

const editRecordForm = document.getElementById("editRecordForm");
editRecordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const editRecordId = editRecordForm.editRecordId.value;
  const newRecordName = editRecordForm.editRecordName.value;
  const newRecordEmail = editRecordForm.editRecordEmail.value;

  axios
    .post("/edit-record", { editRecordId, newRecordName, newRecordEmail })
    .then((res) => {
      localStorage.setItem("editRecordToast", "true");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
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
