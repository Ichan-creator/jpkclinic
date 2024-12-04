function addNewPasswordFocusStyles() {
  document.querySelector(".input-fields.new-password").classList.add("focus");
  document.getElementById("span-new-password").classList.add("focus");
}

function addConfirmPasswordFocusStyles() {
  document
    .querySelector(".input-fields.confirm-password")
    .classList.add("focus");
  document.getElementById("span-confirm-password").classList.add("focus");
}

function removeNewPasswordFocusStyles() {
  document
    .querySelector(".input-fields.new-password")
    .classList.remove("focus");
  document.getElementById("span-new-password").classList.remove("focus");
}

function removeConfirmPasswordFocusStyles() {
  document
    .querySelector(".input-fields.confirm-password")
    .classList.remove("focus");
  document.getElementById("span-confirm-password").classList.remove("focus");
}

const form = document.getElementById("reset-form");
form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (form.newPassword.value !== form.confirmPassword.value) {
    return alert("Passwords doesn't match!");
  }

  axios
    .post("/reset-password", {
      userId: form.userId.value,
      newPassword: form.newPassword.value,
    })
    .then((res) => {
      document.getElementById("popup-container").style.display = "flex";
    })
    .catch((error) => {
      console.error(error);
    });
});

const togglePasswordIcon = document.getElementById("span-confirm-password");
const passwordField = document.getElementById("password-field");
const confirmPasswordField = document.getElementById("confirm-password-field");

togglePasswordIcon.addEventListener("click", () => {
  if (passwordField.type === "password") {
    togglePasswordIcon.textContent = "visibility_off";
    passwordField.type = "text";
    confirmPasswordField.type = "text";
  } else {
    togglePasswordIcon.textContent = "visibility";
    passwordField.type = "password";
    confirmPasswordField.type = "password";
  }
});
