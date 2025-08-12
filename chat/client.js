const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});
const form = document.getElementById("formChat");
const input = document.getElementById("input");
socket.on("connect", () => {
  console.log("Connected to chat server");
});
socket.on("message", (message) => {
  const messageElement = document.createElement("div");
  messageElement.textContent = message;
  document.body.appendChild(messageElement);
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
