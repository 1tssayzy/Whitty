const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");

const user = require("../models/user");
const connectDB = require("./database");
const auth = require("../routes/auth");

const env = dotenv.config();
const port = process.env.PORT;
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/auth", auth);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/src", express.static(path.join(__dirname, "../scripts")));
app.use("/pages", express.static(path.join(__dirname, "../pages")));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
app.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../pages/index.html"));
});

app.post("/login", (req, res) => {
    const { login, password } = req.body;
});
app.get("/register", (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/register.html"));
});
