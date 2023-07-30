const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  // Get the token from the Authorization header
  const authHeader = req.header("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).send({ error: "Access Denied! Bearer token required." });
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    // Verify the token using the jwtSecret from environment variables
    const verified = jwt.verify(token, process.env.jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    res.status(401).send({ error: "Authentication failed. Invalid token." });
  }
};
