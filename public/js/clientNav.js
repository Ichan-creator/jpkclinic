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

function onScheduleAppointmentClick(event) {
  event.preventDefault();

  axios
    .get("/is-profile-complete")
    .then((res) => {
      if (!res.data.isProfileComplete) {
        localStorage.setItem("isProfileComplete", "false");

        return (window.location.href = "/personal-page");
      }

      localStorage.setItem("startAppointmentIntro", "true");
      window.location.href = "/appointment";
    })
    .catch((error) => {
      console.error(error);
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
