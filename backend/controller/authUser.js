const jwt = require("jsonwebtoken");
require("dotenv").config();

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateUser = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.redirect("/auth/login");
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.clearCookie("token");
    return res.redirect("/auth/login");
  }
};


module.exports = authenticateUser;