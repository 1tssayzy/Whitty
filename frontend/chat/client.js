const socket = io("http://localhost:8080", {
  transports: ["websocket"],
  withCredentials: true,
});

const formChat = document.getElementById("formChat");
const input = document.getElementById("input");
const messages = document.getElementById("messages");

    const modal = document.getElementById('postModal');
    const openBtn = document.getElementById('openPostModalBtn');
    const closeBtn = document.getElementById('closePostModalBtn');
    const formPost = document.getElementById('createPostForm');

 
    openBtn.addEventListener('click', () => {
        modal.style.display = 'flex';
    });

  
    closeBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });

    
    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });
socket.on("connect", () => {
  console.log("Connected to chat server");
});
socket.on("user_info", (data) => {
  document.getElementById("username").textContent = data.username;
  document.getElementById("avatar").src = data.avatar || "/imgSite/default.jpg";
});
socket.on("new_message", (data) => {
  const messageElement = document.createElement("li");
  const avatarImg = document.createElement("img");
  avatarImg.src = data.avatar || "/imgSite/default.jpg";
  avatarImg.alt = "User Avatar";
  avatarImg.classList.add("avatar");
  avatarImg.width = 30;
  avatarImg.height = 30;
  avatarImg.style.borderRadius = "50%";
  avatarImg.style.marginRight = "8px";

 const statusOnline = document.createElement("span");
  statusOnline.textContent = data.isOnline ? "🟢" : "🔴";
  statusOnline.style.marginRight = "5px";
  
  const usernameSpan = document.createElement("span");
  usernameSpan.textContent = data.username + ": ";
  usernameSpan.style.fontWeight = "common";
  
  const textSpan = document.createElement("span")
  textSpan.textContent = data.message  
  
  messageElement.appendChild(avatarImg)
  messageElement.appendChild(statusOnline)
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

formPost.addEventListener('submit', async (e) => {
        e.preventDefault(); 

        const formData = new FormData();
        const content = document.getElementById('postContent').value;
        const imageFile = document.getElementById('postImage').files[0];

        formData.append('content', content);
        if (imageFile) {
            formData.append('image', imageFile);
        }

        try {
            const response = await fetch('/api/posts', { 
                method: 'POST',
                body: formData 
            });

            if (response.ok) {
                alert('✅ Post created successfully!');
                modal.style.display = 'none';
                form.reset(); 
                
                window.location.reload(); 
            } else {
                const errorData = await response.json();
                alert('❌ Error: ' + errorData.message);
            }
        } catch (error) {
            console.error(error);
            alert('Something went wrong!');
        }
    });
});
