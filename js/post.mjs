import { getPostById } from "./blog-management.mjs";

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
  } else {
    alert("Post not found");
    window.location.href = "/";
  }
});

function displayPost(post) {
  const postContainer = document.getElementById("post-container");
  if (!postContainer) return;

  const tags = Array.isArray(post.tags) ? post.tags.join(", ") : "No tags";

  postContainer.innerHTML = `
    <h2>${post.title}</h2>
    <p><strong>Tags:</strong> ${tags}</p>
    <img src="${post.media.url || "default.jpg"}" alt="${
    post.media.alt || "Image"
  }">
    <p>${post.body}</p>
  `;
}
