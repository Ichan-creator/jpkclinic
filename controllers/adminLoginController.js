import passport from "../config/passport.js";

function handleGetAdminLogin(req, res) {
  res.render("adminLogin", {
    loginError: req.flash("error"),
  });
}

function handlePostAdminLogin(req, res, next) {
  passport.authenticate("admin-local", {
    successReturnToOrRedirect: "/admin",
    failureRedirect: "/admin-login",
    failureFlash: true,
  })(req, res, next);
}

export { handleGetAdminLogin, handlePostAdminLogin };
