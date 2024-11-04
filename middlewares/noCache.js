function noCache(req, res, next) {
  res.header("Cache-Control", "no-cache, no-store, must-revalidate");
  res.header("Expires", "0");
  res.header("Pragma", "no-cache");
  next();
}

export default noCache;
