function handleLogout(event) {
  event.preventDefault();

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
