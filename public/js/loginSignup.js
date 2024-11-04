const inputs = document.querySelectorAll(".input-field");
const toggle_btn = document.querySelectorAll(".toggle");
const main = document.querySelector("main");
const bullets = document.querySelectorAll(".bullets span");
const images = document.querySelectorAll(".image");
const usernameError = document.getElementById("usernameError");
const forbiddenUsernames = ["user", "admin", "test", "guest", "root", "client", "username"];

inputs.forEach((inp) => {
  inp.addEventListener("focus", () => {
    inp.classList.add("active");
  });
  inp.addEventListener("blur", () => {
    if (inp.value != "") return;
    inp.classList.remove("active");
  });
});

toggle_btn.forEach((btn) => {
  btn.addEventListener("click", () => {
    main.classList.toggle("sign-up-mode");
  });
});

function moveSlider(index) {
  let currentImage = document.querySelector(`.img-${index}`);
  images.forEach((img) => img.classList.remove("show"));
  currentImage.classList.add("show");

  const textSlider = document.querySelector(".text-group");
  textSlider.style.transform = `translateY(${-(index - 1) * 2.2}rem)`;

  bullets.forEach((bull) => bull.classList.remove("active"));
  bullets[index - 1].classList.add("active");
}

let currentIndex = 1;
const totalImages = images.length;
moveSlider(currentIndex);

setInterval(() => {
  currentIndex++;
  if (currentIndex > totalImages) {
    currentIndex = 1;
  }
  moveSlider(currentIndex);
}, 3000);

bullets.forEach((bullet) => {
  bullet.addEventListener("click", function () {
    currentIndex = this.dataset.value;
    moveSlider(currentIndex);
  });
});

function hideFlashMessage() {
  const flashMessages = document.getElementsByClassName("flash-message");

  Array.from(flashMessages).forEach((flashMessage) => {
    if (flashMessage.textContent.trim() !== "") {
      flashMessage.style.display = "none";
    }
  });
}

document
  .getElementById("loginUsername")
  .addEventListener("input", hideFlashMessage);
document
  .getElementById("loginPassword")
  .addEventListener("input", hideFlashMessage);

const signUpUsername = document.getElementById("signUpUsername");
const signUpEmail = document.getElementById("signUpEmail");
const signUpPassword = document.getElementById("signUpPassword");
const signUpConfirmPassword = document.getElementById("signUpConfirmPassword");
const signUpError = document.querySelector(".hidden");
const isExistingUserError = document.querySelector(".existing-hidden");

let usernameDebounceTimer;
let isUsernameAvailable = false;

function validateUsername() {
  const username = signUpUsername.value.trim();

  usernameError.textContent = "";
  usernameError.style.display = "none";

  if (!username) return;

  if (forbiddenUsernames.includes(username.toLowerCase())) {
    usernameError.textContent = "This username is not allowed.";
    usernameError.style.display = "block";
    return;
  }

  const invalidChars = /[!@#$%^&*(),.?":{}|<>]/;
  if (invalidChars.test(username)) {
    usernameError.textContent =
      "Invalid username. Special characters are not allowed.";
    usernameError.style.display = "block";
    return;
  }

  axios
    .post("/existing-user", { name: username })
    .then((res) => {
      if (res.data.isExistingUser) {
        isUsernameAvailable = false;
        usernameError.textContent =
          "Username already in use.";
        usernameError.style.display = "block";
        return;
      } else {
        isUsernameAvailable = true;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

signUpUsername.addEventListener("input", () => {
  clearTimeout(usernameDebounceTimer);
  usernameDebounceTimer = setTimeout(validateUsername, 400);
});

let emailDebounceTimer;
let isEmailAvailable = false;

function checkExistingEmail() {
  axios
    .post("/existing-user", { email: signUpEmail.value })
    .then((res) => {
      if (res.data.isExistingUser) {
        isEmailAvailable = false;
        isExistingUserError.classList.remove("existing-hidden");
      } else {
        isEmailAvailable = true;
      }
    })
    .catch((error) => {
      console.error(error);
    });
}

signUpEmail.addEventListener("input", () => {
  clearTimeout(emailDebounceTimer);
  emailDebounceTimer = setTimeout(checkExistingEmail, 400);
});

function togglePassword() {
  const passwordField = document.getElementById("loginPassword");
  const toggleIcon = document.querySelector(".password-toggle");

  if (passwordField.type === "password") {
    passwordField.type = "text";
    toggleIcon.innerHTML = "visibility_off";
  } else {
    passwordField.type = "password";
    toggleIcon.innerHTML = "visibility";
  }
}

const termsModal = document.getElementById("terms-modal");
const closeModalBtn = document.getElementsByClassName("close")[0];

closeModalBtn.addEventListener("click", function () {
  termsModal.style.display = "none";
});

const signUpForm = document.getElementById("signUpForm");

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function handleSignUp() {
  if (!isEmailAvailable) return;

  if (!emailPattern.test(signUpEmail.value)) return;

  if (
    !signUpUsername.value ||
    !signUpEmail.value ||
    !signUpPassword.value ||
    !signUpConfirmPassword.value
  ) {
    return;
  }

  if (signUpPassword.value !== signUpConfirmPassword.value) {
    return signUpError.classList.remove("hidden");
  }

  validateUsername();

  if (usernameError.style.display === "block") return;

  termsModal.style.display = "block";
}

function handleConfirmTermsAndConditions() {
  signUpForm.submit();
}

function hideSignUpErrorMessage() {
  if (!signUpError.classList.contains("hidden")) {
    signUpError.classList.add("hidden");
  }

  if (!isExistingUserError.classList.contains("existing-hidden")) {
    isExistingUserError.classList.add("existing-hidden");
  }
}

signUpEmail.addEventListener("input", hideSignUpErrorMessage);
signUpPassword.addEventListener("input", hideSignUpErrorMessage);
signUpConfirmPassword.addEventListener("input", hideSignUpErrorMessage);

window.onload = () => {
  if (localStorage.getItem("isRegisterClicked") === "true") {
    main.classList.toggle("sign-up-mode");
    localStorage.removeItem("isRegisterClicked");
  }
};

const termsContent = document.getElementById("termsContent");
const readTermsCheckbox = document.getElementById("readTerms");
const acceptTermsCheckbox = document.getElementById("acceptTerms");
const submitButton = document.getElementById("submitButton");

const tolerance = 5;

function checkScrollBottom() {
  const isAtBottom =
    termsContent.scrollTop + termsContent.clientHeight >=
    termsContent.scrollHeight - tolerance;
  if (isAtBottom) {
    readTermsCheckbox.disabled = false;
    readTermsCheckbox.classList.add("enabled");
  }
}

termsContent.addEventListener("scroll", checkScrollBottom);

readTermsCheckbox.addEventListener("change", function () {
  if (readTermsCheckbox.checked) {
    acceptTermsCheckbox.disabled = false;
    acceptTermsCheckbox.classList.add("enabled");
  } else {
    acceptTermsCheckbox.disabled = true;
    acceptTermsCheckbox.checked = false;
    submitButton.disabled = true;
    submitButton.classList.remove("enabled");
  }
});

acceptTermsCheckbox.addEventListener("change", function () {
  if (readTermsCheckbox.checked && acceptTermsCheckbox.checked) {
    submitButton.disabled = false;
    submitButton.classList.add("enabled");
  } else {
    submitButton.disabled = true;
    submitButton.classList.remove("enabled");
  }
});

const termsModal2 = document.getElementById("terms-modal-2");
const closeTermsButton2 = document.getElementById("closeTermsButton2");
closeTermsButton2.addEventListener("click", function () {
  termsModal2.style.display = "none";
});

function handleTermsClick(event) {
  event.preventDefault();

  termsModal2.style.display = "block";
}

window.addEventListener("click", (event) => {
  if (event.target == termsModal2) {
    termsModal2.style.display = "none";
  }
});
