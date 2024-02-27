const jwt = require("jsonwebtoken");

// Handler for authorization
function authenticateToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) return res.sendStatus(401);
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

// Function to generate access token
function generateAccessToken(user) { // Pass the 'user' as an argument
  return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "25s" }); // Use ACCESS_TOKEN_SECRET instead of REFRESH_TOKEN_SECRET
}

module.exports = { authenticateToken, generateAccessToken }; // Export as an object
