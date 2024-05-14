import { apiRequest, showAlert, API_BASE_URL, USERNAME } from "./common.mjs";

async function createBlogPost(title, content, authors, tags) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No auth token found. Please login first.");
    return;
  }

  try {
    const data = await apiRequest(
      `${API_BASE_URL}/blog/posts/${USERNAME}`,
      "POST",
      { Authorization: `Bearer ${authToken}` },
      { title, content, authors, tags }
    );
    showAlert("Blog post created successfully!");
    fetchBlogPosts(); // Обновить список постов после создания нового
  } catch (error) {
    console.error("Failed to create blog post:", error);
  }
}

async function fetchBlogPosts() {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    showAlert("No auth token found. Please login first.", false);
    return;
  }
  try {
    const response = await apiRequest(
      `${API_BASE_URL}/blog/posts/${USERNAME}`,
      "GET",
      { Authorization: `Bearer ${authToken}` }
    );
    if (response && response.data && Array.isArray(response.data)) {
      displayBlogPosts(response.data);
    } else {
      console.error("Unexpected data format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }
}

function displayBlogPosts(posts) {
  const blogContainer = document.getElementById("blog-posts-container");
  if (!blogContainer) return;
  blogContainer.innerHTML = ""; // Очистить контейнер перед добавлением новых постов
  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "card";
    postElement.innerHTML = `<img src="/img/${
      post.image || "default.jpg"
    }" alt="Post Image" />
      <div class="card-text">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <a href="/blogpost.html">Read the post</a>
        <button onclick="deletePost('${post.id}')">Delete</button>
      </div>`;
    blogContainer.appendChild(postElement);
  });
}

export { createBlogPost, fetchBlogPosts };
