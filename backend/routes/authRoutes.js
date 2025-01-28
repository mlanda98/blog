const express = require("express");
const passport = require("passport");
const { register, login } = require("../controller/authController");
const jwt = require("jsonwebtoken");
const path = require("path");
require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET;

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

const checkAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  console.log(token);
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ error: "Invalid token" });
    }

    if (!decoded.isAdmin) {
      return res.status(403).json({ error: "Access denied. Admins only" });
    }
    req.user = decoded;
    next();
  });
};

router.get("/admin-dashboard", checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/admin-dashboard.html"));
});

router.get("/viewers-dashboard", checkAdmin, (req, res) => {
  res.sendFile(path.join(__dirname, "../public/viewers-dashboard.html"));
});

module.exports = router;

