const modal = document.getElementById("postModal");
const openBtn = document.getElementById("openPostModalBtn");
const closeBtn = document.getElementById("closePostModalBtn");
const formPost = document.getElementById("createPostForm");


openBtn.addEventListener("click", () => {
  modal.style.display = "flex";
});

closeBtn.addEventListener("click", () => {
  modal.style.display = "none";
});

window.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.style.display = "none";
  }
});
formPost.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData();
  const content = document.getElementById("postContent").value;
  const imageFile = document.getElementById("postImage").files[0];
  formData.append("caption", content );
  formData.append("content", content );
  if (imageFile) {
    formData.append("image", imageFile);
  }

  try {
    const response = await fetch("http://localhost:8080/api/post", {
      method: "POST",
      body: formData,
    });

    if (response.ok) {
      alert("✅ Post created successfully!");
      modal.style.display = "none";
      formPost.reset();

      window.location.reload();
    } else {
      const errorData = await response.json();
      alert("❌ Error: " + errorData.message);
    }
  } catch (error) {
    console.error(error);
    alert("Something went wrong!");
  }
});
