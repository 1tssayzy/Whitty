async function loadPosts() {
const container = document.getElementById('feed-list');

try {
    const response = fetch("http://localhost:8080/api/post");
   
    container.innerHTML = '';

    const posts = await response.json();

    posts.forEach(post => {
        const postElement = document.createElement('div');
        postElement.className = 'post-card';
        const date = new Date(post.created_at).toLocaleString();
        const author = post.user.avatar;
        const authorUsername = post.user.username;

        const postImageHTML = post.imageUrl
        ? `<div class="post-image"><img src="${post.imageUrl}" alt="Post image"></div>` 
        : '';
        postElement.innerHTML = `
        <div class="post-header">
            <img src="${authorAvatar}" alt="Avatar" class="avatar-small">
            <span class="username">${authorName}</span>
            <span class="date">${date}</span>
        </div>
        
        <div class="post-content">
            <p>${post.caption || post.content || ''}</p> 
        </div>

        ${postImageHTML} <div class="post-footer">
            <button>❤️ Like</button>
        </div>
      `;

      container.appendChild(postElement);
    });

  } catch (error) {
    console.error('Error loading posts:', error);
    container.innerHTML = '<p>Error loading feed.</p>';
  }
}


loadPosts();

