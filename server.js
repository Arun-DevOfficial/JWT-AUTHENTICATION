const express = require("express");
const app = express();
require("dotenv").config();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("jsonwebtoken");

const { authenticateToken, generateAccessToken } = require("./auth");

// Middleware
app.use(cors());

// Middleware to parse JSON and URL-encoded bodies using body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const posts = [
  {
    Name: "Arun",
    Title: "Post One",
  },
  {
    Name: "Arun & Priya Weds",
    Title: "Post One",
  },
  {
    Name: "Priya",
    Title: "Post One",
  },
];

app.get("/post", authenticateToken, (req, res) => {
  return res.json(posts.filter((post) => post.Name === req.user.Name));
});

let refreshTokens = [];

app.post("/token", (req, res) => {
  const refreshToken = req.body.token;
  if (refreshToken === null) return res.sendStatus(401);
  if (!refreshTokens.includes(refreshToken)) return res.sendStatus(403);

  // Verify refresh Token
  jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);

    // Generate new access token
    const accessToken = generateAccessToken({ Name: user.Name });

    res.json({ AccessToken: accessToken });
  });
});

app.delete("/logout", (req, res) => {
  refreshTokens = refreshTokens.filter((token) => token !== req.body.token);
  res.json("NO ACCESS YOU HAVE!!").sendStatus(204);

});

app.post("/login", (req, res) => {
  // Authenticate User
  const username = req.body.username;

  // Payload
  const user = {
    Name: username,
  };

  // Access Token
  const accessToken = generateAccessToken(user);

  // Refresh Token
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET);
  refreshTokens.push(refreshToken);
  return res.json({ AccessToken: accessToken, RefreshToken: refreshToken });
});

// PORT
const PORT = process.env.PORT || 4050;

// Server Listen
app.listen(PORT, (err) => {
  if (err) return console.log(`Error:`, err);
  console.log(`Server is running on http://localhost:${PORT}`);
});
