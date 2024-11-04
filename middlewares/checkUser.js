function checkUser(req, res, next) {
  if (!req.user) {
    return res.redirect("/welcome");
  }
  next();
}

export default checkUser;
