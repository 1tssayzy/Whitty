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
const User = require("./models/user");
const { connectDB, redisConnect } = require("./database");
const auth = require("../routes/auth");
const { requireAuth } = require("./middleware/authMiddleware");
const avatarRouter = require("../routes/upload.router");
const avatarSyncRouter = require("../routes/avatar.router");
const user = require("./models/user");

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
app.use("/imgSite", express.static(path.join(__dirname, "../uploads/imgSite")));
app.use("/api", avatarRouter);
app.use("/api", avatarSyncRouter);

io.use(async (socket, next) => {
  const cookieHeader = socket.handshake.headers.cookie || "";
  const cookies = Object.fromEntries(
    cookieHeader.split("; ").map((c) => c.split("="))
  );

  const token = cookies.jwt;
  if (!token) return next(new Error("No token provided"));

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    if (user) {
      socket.data.avatar = user.avatar;
      socket.data.username = user.login;
    } else {
      socket.data.avatar = "/avatars/default.png";
      socket.data.username = "Anonymous";
    }
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
const onlineUsers = new Map();

io.on("connection", (socket) => {
  const username = socket.data.username;
  onlineUsers.set(username,socket.id);
  
  console.log(`${username} connected`,socket.id);
  console.log(onlineUsers.entries());

  

  socket.on("user_connection",(user) => {
     onlineUsers.set(user.id, user.usermame);
     console.log(onlineUsers);
    })
  
 

  socket.emit("user_info", {
    username: socket.data.username,
    avatar: socket.data.avatar,
    status: socket.data.status,
  });

  socket.on("registration", (username) => {
    socket.data.username = username;
  });

  socket.on("sendMessage", (msg) => {
    const username = socket.data.username;
    const isOnline = Array.from(onlineUsers.values()).includes(username);
    io.emit("new_message", {
      username: socket.data.username,
      avatar: socket.data.avatar,
      message: msg,
      isOnline
    });
  });
  socket.on("disconnect", () => {
    console.log(" ❌ Client disconnected", socket.data.username,socket.id);
    onlineUsers.delete(username,socket.id)
    console.log(onlineUsers.entries());
  });
});

server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  connectDB();
});
