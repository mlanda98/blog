const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
require("./passport")(passport);
const jwtStrategy = require("./passport");

dotenv.config();
jwtStrategy(passport);

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
