const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});
const formChat = document.getElementById("formChat");
const input = document.getElementById("input");
const messages = document.getElementById("messages");
socket.on("connect", () => {
  console.log("Connected to chat server");
});
socket.on("user_info", (data) => {
  document.getElementById("username").textContent = data.username;
  document.getElementById("avatar").src = data.avatar || "/avatars/default.png";
});
socket.on("new_message", (data) => {
  const messageElement = document.createElement("li");
  
  const avatarImg = document.createElement("img");
  avatarImg.src = data.avatar || "/avatars/default.png";
  avatarImg.alt = "User Avatar";
  avatarImg.classList.add("avatar");
  avatarImg.width = 30;
  avatarImg.height = 30;
  avatarImg.style.borderRadius = "50%";
  avatarImg.style.marginRight = "8px";

  const statusOnline = document.createElement("a")
  statusOnline.textContent = data.status + ": ";
  
  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = data.username + ": ";
  usernameSpan.style.fontWeight = "common";
  
  const textSpan = document.createElement("span")
  textSpan.textContent = data.message
  
  
  messageElement.appendChild(avatarImg)
  messageElement.appendChild(usernameSpan)
  messageElement.appendChild(textSpan)
  
  document.getElementById("messages").appendChild(messageElement);
  
});

formChat.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("sendMessage", input.value);
    console.log("Message sent :", input.value);
    const messageElement = document.createElement("div");
    input.value = "";
  }
});
