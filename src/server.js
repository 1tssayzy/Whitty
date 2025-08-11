const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");

const user = require("../models/user");
const connectDB = require("./database");
const auth = require("../routes/auth");
const { requireAuth } = require("../middleware/authMiddleware");

const env = dotenv.config();
const port = process.env.PORT;
const app = express();

//Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//routing setup
app.use("/auth", auth);
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/src", express.static(path.join(__dirname, "../src")));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/chat", express.static(path.join(__dirname, "../chat")));

const server = createServer(app);
const io = new Server(server);
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
app.get("/chat", requireAuth, (req, res) => {
  res.sendFile(path.join(__dirname, "../pages/chat.html"));
});
io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("sendMessage", (message) => {
    console.log("Сообщение от пользователя:", message);
    io.emit("new_message", message);
  });
  socket.on("disconnect", () => {
    console.log(" ❌ Client disconnected", socket.id);
  });
});
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
