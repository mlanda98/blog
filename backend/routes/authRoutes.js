const express = require("express");
const bcrypt = require("bcryptjs");
const prisma = require("../prisma");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const authenticateUser = require("../controller/authUser");

const router = express.Router();
router.use(cookieParser());

router.post("/register", async (req, res) => {
  const { username, password} = req.body;
  const isAdmin = req.body.isAdmin === "on";
  console.log("Received data:", req.body);

  try {
    const existingUser = await prisma.user.findUnique({
      where: { username },
    });

    if (existingUser) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.create({
      data: {
        username,
        password: hashedPassword,
        isAdmin,
      },
    });

    res.redirect("/auth/login");
  } catch (error) {
    res.status(500).json({ error: "Something went wrong", details: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  console.log("Login data:", req.body);

  try {
    const user = await prisma.user.findUnique({
      where: { username },
    });

    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.cookie("token", token, { httpOnly: true });

    res.redirect(
      user.isAdmin ? "/auth/admin-dashboard" : "/auth/viewers-dashboard"
    );
  } catch (error) {
    res
      .status(500)
      .json({ error: "Something went wrong", details: error.message });
  }
});

router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/auth/login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.get("/admin-dashboard", authenticateUser, (req, res) => {
  res.render("admin-dashboard", { username: req.user.username || "Admin" });
});

router.get("/viewers-dashboard", authenticateUser, (req, res) => {
  res.render("viewers-dashboard", { username: req.user.username || "Viewer"});
});

module.exports = router;
