function isAuthenticated(req, res, next) {
  if (!req.isAuthenticated() && req.path.startsWith("/admin")) {
    return res.redirect("/admin-login");
  }

  if (!req.isAuthenticated()) {
    return res.redirect("/login?loginRequired=true");
  }

  next();
}

export default isAuthenticated;
