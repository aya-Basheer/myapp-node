// middlewares/roleMiddleware.js
module.exports = function(allowedRoles = []) {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: 'Auth required' });
    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden - insufficient permissions' });
    }
    next();
  };
};
