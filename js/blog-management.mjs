import { apiRequest, showAlert, API_BASE_URL, USERNAME } from "./common.mjs";

// Функция для получения поста по ID
async function getPostById(postId) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    showAlert("No auth token found. Please login first.", false);
    return null;
  }
  try {
    const response = await apiRequest(
      `${API_BASE_URL}/blog/posts/${USERNAME}/${postId}`,
      "GET",
      { Authorization: `Bearer ${authToken}` }
    );
    return response.data; // Исправление для возврата данных поста
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    showAlert("Failed to fetch blog post: " + error.message, false);
    return null;
  }
}

// Функция для обновления поста
async function updateBlogPost(postId, title, body, tags, mediaUrl, mediaAlt) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No auth token found. Please login first.");
    showAlert("Please login to update the blog post.", false);
    return;
  }

  const updateData = {
    title,
    body,
    tags,
    media: {
      url: mediaUrl,
      alt: mediaAlt,
    },
  };

  try {
    const url = `${API_BASE_URL}/blog/posts/${USERNAME}/${postId}`;
    const data = await apiRequest(
      url,
      "PUT",
      { Authorization: `Bearer ${authToken}` },
      updateData
    );
    showAlert("Blog post updated successfully!", true);
    fetchBlogPosts();
  } catch (error) {
    console.error("Failed to update blog post:", error);
    showAlert("Failed to update blog post: " + error.message, false);
  }
}

// Функция для получения и отображения всех постов
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
      displayCarouselPosts(response.data.slice(-3));
    } else {
      console.error("Unexpected data format:", response);
    }
  } catch (error) {
    console.error("Failed to fetch blog posts:", error);
  }
}

// Функция для отображения всех постов
function displayBlogPosts(posts) {
  const blogContainer = document.getElementById("blog-posts-container");
  if (!blogContainer) return;
  blogContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = createPostElement(post);
    blogContainer.appendChild(postElement);
  });
}

// Функция для отображения постов в карусели
function displayCarouselPosts(posts) {
  const carouselInner = document.querySelector(".carousel-inner");
  if (!carouselInner) return;
  carouselInner.innerHTML = "";
  posts.forEach((post, index) => {
    const slide = createCarouselSlide(post, index === 0);
    carouselInner.appendChild(slide);
  });
}

// Функция для создания элемента поста
function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "card";
  postElement.dataset.hashtags = post.tags.join(" ").toLowerCase(); // Добавление хэштегов в dataset

  const truncatedBody =
    post.body.length > 100 ? post.body.substring(0, 100) + "..." : post.body;

  postElement.innerHTML = `
    <img src="${post.media.url || "default.jpg"}" alt="${post.media.alt}">
    <div class="card-text">
      <h3>${post.title}</h3>
      <p>${truncatedBody}</p>
      <p><strong>Tags:</strong> ${post.tags.join(", ")}</p>
      <a href="#" data-post-id="${post.id}">Read the post</a>
    </div>`;
  return postElement;
}

// Функция для создания слайда карусели
function createCarouselSlide(post, isActive) {
  const slide = document.createElement("div");
  slide.className = `slide ${isActive ? "active" : ""}`;
  slide.style.display = isActive ? "block" : "none";
  slide.innerHTML = `
    <img src="${post.media.url || "default.jpg"}" alt="${post.media.alt}">
    <div class="slide-text">
      <h2>${post.title}</h2>
      <p>${post.body.substring(0, 100)}...</p>
      <a href="/post/index.html?id=${post.id}">Read the post</a>
    </div>`;
  return slide;
}

// Функция для удаления поста
async function deleteBlogPost(postId) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No auth token found. Please login first.");
    showAlert("Please login to delete the blog post.", false);
    return;
  }

  try {
    const url = `${API_BASE_URL}/blog/posts/${USERNAME}/${postId}`;
    await apiRequest(url, "DELETE", { Authorization: `Bearer ${authToken}` });
    showAlert("Blog post deleted successfully!", true);
    fetchBlogPosts();
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    showAlert("Failed to delete blog post: " + error.message, false);
  }
}

export {
  getPostById,
  updateBlogPost,
  fetchBlogPosts,
  deleteBlogPost,
  displayBlogPosts,
};
