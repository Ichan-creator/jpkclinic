function checkUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/login?loginExpired=true");
  }
  next();
}

export default checkUser;
