const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");

const user = require("../models/user");
const connectDB = require("./database");
const auth = require("../routes/auth");
const { requireAuth } = require("../middleware/authMiddleware");

const env = dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/src", express.static(path.join(__dirname, "../src")));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/register.html"));
});
app.get("/profile", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/profile.html"));
});
app.get("/logout", (req, res) => {
  res.clearCookie("jwt");
  res.sendFile(path.join(__dirname, "../public/index.html"));
});
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
