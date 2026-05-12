const adminOnly = (req, res, next) => {
  if (!req.user || !['admin', 'master_admin'].includes(req.user.role)) {
    return res.status(403).json({ message: 'Admin only' });
  }
  next();
};

module.exports = adminOnly;
