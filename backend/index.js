const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const authRoutes = require("./routes/authRoutes");
require("./middleware/passport")(passport);

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

app.use("/auth", authRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
