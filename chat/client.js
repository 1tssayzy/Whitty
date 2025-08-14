const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});
const form = document.getElementById("formChat");
const input = document.getElementById("input");
socket.on("connect", () => {
  console.log("Connected to chat server");
});
socket.on("user_info", (data) => {
  document.getElementById("username").textContent = data.username;
});
socket.on("new_message", (data) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = `${data.username}: ${data.message}`;
  document.body.appendChild(messageElement);
});
socket.on("message", (message) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  document.body.appendChild(loginmessageElement);
});
form.addEventListener("submit", (e) => {
  e.preventDefault();
  if (input.value) {
    socket.emit("sendMessage", input.value);
    console.log("Message sent:", input.value);
    const messageElement = document.createElement("div");
    messageElement.textContent = input.value;
    document.body.appendChild(messageElement);
    input.value = "";
  }
});
