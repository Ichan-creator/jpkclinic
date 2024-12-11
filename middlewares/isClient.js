function isClient(req, res, next) {
  if (req.user && req.user.role === "client") {
    return next();
  } else if (req.user && req.user.role === "admin") {
    return res.redirect("/admin");
  } else {
    res.redirect("/welcome");
  }
}

export default isClient;
