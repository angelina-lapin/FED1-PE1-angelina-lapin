import {
  getPostById,
  updateBlogPost,
  deleteBlogPost,
} from "./blog-management.mjs";

document.addEventListener("DOMContentLoaded", async () => {
  const postId = new URLSearchParams(window.location.search).get("id");
  if (!postId) {
    alert("Post ID not found");
    window.location.href = "/";
    return;
  }

  const post = await getPostById(postId);
  if (post) {
    displayPost(post);
    addEventListeners(); // Добавляем обработчики событий после отображения поста
  } else {
    alert("Post not found");
    window.location.href = "/";
  }
});

function displayPost(post) {
  const postContainer = document.getElementById("post-container");
  if (!postContainer) {
    console.error("Post container not found.");
    return;
  }

  postContainer.innerHTML = `
    <form id="post-form">
      <label for="post-title-input">Title</label>
      <input type="text" id="post-title-input" value="${post.title}" required>
      <label for="main-text">Content</label>
      <textarea id="main-text" required>${post.body}</textarea>
      <label for="tags">Tags</label>
      <input type="text" id="tags" value="${post.tags.join(", ")}" required>
      <label for="media-url">Media URL</label>
      <input type="text" id="media-url" value="${post.media.url}">
      <label for="media-alt">Media Alt</label>
      <input type="text" id="media-alt" value="${post.media.alt}">
      <button type="submit">Save</button>
    </form>
    <button id="delete-button">Delete</button>
  `;
}

function addEventListeners() {
  const postForm = document.getElementById("post-form");
  const deleteButton = document.getElementById("delete-button");

  if (!postForm) {
    console.error("Post form not found.");
    return;
  }

  if (!deleteButton) {
    console.error("Delete button not found.");
    return;
  }

  postForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const postId = new URLSearchParams(window.location.search).get("id");
    const title = document.getElementById("post-title-input").value;
    const content = document.getElementById("main-text").value;
    const tags = document.getElementById("tags").value.split(",");
    const mediaUrl =
      document.getElementById("media-url").value || "default.jpg";
    const mediaAlt =
      document.getElementById("media-alt").value || "Default image";
    updateBlogPost(postId, title, content, tags, mediaUrl, mediaAlt);
  });

  deleteButton.addEventListener("click", async function () {
    const postId = new URLSearchParams(window.location.search).get("id");
    if (confirm("Are you sure you want to delete this post?")) {
      await deleteBlogPost(postId);
      window.location.href = "/";
    }
  });
}
