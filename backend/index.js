const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const path = require("path");
const authRoutes = require("./routes/authRoutes");
const postRoutes = require("./routes/postRoutes");
require("./passport")(passport);
const jwtStrategy = require("./passport");
dotenv.config();
const cors = require("cors");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));

app.use(express.json());
app.use(cors());
app.use(passport.initialize());

app.use("/auth", authRoutes);
app.use("/posts", postRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
