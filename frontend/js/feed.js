async function loadPosts() {
  const container = document.getElementById('posts-container');

  try {
    const response = await fetch("http://localhost:8080/api/post");
    
    if (!response.ok) {
      throw new Error(`HTTP error! status:${response.status}`);
    }

    const posts = await response.json();
    container.innerHTML = '';

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        
        const date = new Date(post.created_at).toLocaleString();
        const authorAvatar = post.user ? post.user.avatar : '/uploads/avatars/default.png';
        const authorUsername = post.user ? post.user.username : 'Unknown';
        
        const postImageHTML = post.imageUrl
            ? `<div class="post-image"><img src="${post.imageUrl}" alt="Post image"></div>` 
            : '';

        let commentsHTML = '';
        if (post.comments && post.comments.length > 0) {
            commentsHTML = post.comments.map(comment => {
                const commentUser = comment.user ? comment.user.username : 'Anon';
                return `
                    <div class="comment-item" style="margin-bottom: 5px; font-size: 0.9em;">
                        <strong>${commentUser}:</strong> ${comment.comment_text}
                    </div>
                `;
            }).join('');
        } else {
            commentsHTML = '<div style="color: grey; font-size: 0.8em;">No comments yet...</div>';
        }
        postElement.innerHTML = `
        <div class="post-header">
            <img src="${authorAvatar}" alt="Avatar" class="avatar-small">
            <span class="username">${authorUsername}</span>
            <span class="date">${date}</span>
        </div>
        
        <div class="post-content">
            <p>${post.caption || post.content || ''}</p> 
        </div>

        ${postImageHTML} 
        
        <div class="post-footer">
            <button class="like-btn">❤️ Like ${post.likes_count || 0}</button>
        </div>
        
        <hr style="opacity: 0.3; margin: 10px 0;">

        <div class="comments-list" id="comments-for-${post.post_id}">
            ${commentsHTML}
        </div>

        <form class="comment-form" data-post-id="${post.post_id}" style="margin-top: 10px; display: flex;">
            <input type="text" placeholder="Write a comment..." required style="flex:1; padding: 5px;">
            <button type="submit" style="margin-left:5px;">Send</button>
        </form>
      `;

      const form = postElement.querySelector('.comment-form');
      form.addEventListener('submit', async (e) => {
          e.preventDefault();
          const input = form.querySelector('input');
          const text = input.value;
          const postId = form.getAttribute('data-post-id');

          try {
              const res = await fetch("http://localhost:8080/api/comment", { // 
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                      post_id: postId,
                      comment_text: text
                  })
              });

              if (res.ok) {
                  input.value = '';
                  alert("Comment added!");
              } else {
                  alert("Error adding comment");
              }
          } catch (err) {
              console.error(err);
          }
      });

      container.appendChild(postElement);
    });

  } catch (error) {
    console.error('Error loading posts:', error);
    container.innerHTML = '<p>Error loading feed.</p>';
  }
}
loadPosts();