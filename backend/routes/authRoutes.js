const express = require("express");
const passport = require("passport");
const {register, login} = require("../controller/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/protected",
  passport.authenticate("jwt", {session: false}),
  (req, res) => {
    res.status(200).json({message: "You have accessed a protected route!, user: req.user"});
  }
);

module.exports = router;