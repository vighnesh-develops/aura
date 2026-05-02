function requireAdmin(req, res, next) {
  const user = req.session?.user;
  if (user && user.role === "admin") {
    return next();
  }
  res.status(403).json({ error: "Admin access required" });
}

module.exports = { requireAdmin };
