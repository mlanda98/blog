const prisma = require("../prisma");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ExtractJwt } = require("passport-jwt");

const JWT_SECRET = process.env.JWT_SECRET;

exports.register = async (req, res) => {
  const { username, password, isAdmin } = req.body;
  try {
    const existingUser = await prisma.user.findUnique({ where: { username } });
    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { username, password: hashedPassword, isAdmin: isAdmin || false },
    });

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "User created successfully.",
      user: { id: user.id, username: user.username },
      token,
    });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid username or password" });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    const redirect = user.isAdmin ? "admin-dashboard" : "viewers-dashboard";
    res.status(200).json({ message: "Login successful", token, redirect });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
};
