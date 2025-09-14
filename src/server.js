// Required modules
const express = require("express");
const dotenv = require("dotenv");
const bodyParser = require("body-parser");
const path = require("path");
const cookieParser = require("cookie-parser");
const { Server } = require("socket.io");
const { createServer } = require("http");
const jwt = require("jsonwebtoken");
// Models
const User = require("../models/user");
const connectDB = require("./database");
const auth = require("../routes/auth");
const { requireAuth } = require("../middleware/authMiddleware");
const avatarRouter = require("../routes/upload.router");
const avatarSyncRouter = require("../routes/avatar.router");

// Load environment variables
const env = dotenv.config();
const port = process.env.PORT;
const app = express();
const server = createServer(app);
const io = new Server(server, {
  cors: {
    credentials: true,
  },
});

//Middleware setup
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//routing setup
app.use("/auth", auth);
app.use("/styles", express.static(path.join(__dirname, "../styles")));
app.use("/src", express.static(path.join(__dirname, "../src")));
app.use("/public", express.static(path.join(__dirname, "../public")));
app.use("/chat", express.static(path.join(__dirname, "../chat")));
app.use("/avatars", express.static(path.join(__dirname, "../uploads/avatars")));
app.use("/api", avatarRouter);
app.use("/api", avatarSyncRouter);

io.use((socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  const token = cookies.jwt;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    socket.data.username = decoded.username;
    next();
  } catch (err) {
    next(new Error("Authentication error"));
  }
});


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
  console.log(`${socket.data.username} connected`);

  socket.emit("user_info", { username: socket.data.username });

  socket.on("sendMessage", (message) => {
    io.emit("new_message", {
      username: socket.data.username,
      message,
    });
  });
  socket.on("disconnect", () => {
    console.log(" ❌ Client disconnected", socket.id);
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
