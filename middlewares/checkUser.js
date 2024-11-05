function checkUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/login?sessionExpired=true");
  }
  next();
}

export default checkUser;
