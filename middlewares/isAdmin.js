function isAdmin(req, res, next) {
  if (req.user && req.user.role === "admin") {
    return next();
  } else {
    res.redirect("/");
  }
}

export default isAdmin;
