const express = require("express");
const dotenv = require("dotenv");
const passport = require("passport");
const routes = require("./routes");

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());
require("./config/passport");

app.use("./api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));