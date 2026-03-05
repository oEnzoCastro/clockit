const jwtService = require('../utils/jwt');

exports.isAuthenticated = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: "No token provided" });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwtService.verifyAccessToken(token);

    // anexa no request pra rotas usarem
    req.userId = decoded.userId;
    req.institute_role = decoded.institute_role;

    return next();
  } catch (error) {
    return res.status(401).json({
      message: "Invalid or expired token",
      error: error.message || error
    });
  }
};

exports.isAuthorized = (req, res, next) => {
  // reaproveita isAuthenticated primeiro
  exports.isAuthenticated(req, res, () => {
    if (req.institute_role === 'manager') return next();
    return res.status(403).json({ message: "Access denied: You are not a manager" });
  });
};