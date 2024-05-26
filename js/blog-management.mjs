import { apiRequest, showAlert, API_BASE_URL, USERNAME } from "./common.mjs";

const POSTS_PER_PAGE = 12;

export async function getPostById(postId) {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  try {
    const response = await apiRequest(
      `${API_BASE_URL}/blog/posts/${USERNAME}/${postId}`,
      "GET",
      headers
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch blog post:", error);
    showAlert("Failed to fetch blog post: " + error.message, false);
    return null;
  }
}

export async function updateBlogPost(
  postId,
  title,
  body,
  tags,
  mediaUrl,
  mediaAlt
) {
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
    media: { url: mediaUrl, alt: mediaAlt },
  };
  try {
    const url = `${API_BASE_URL}/blog/posts/${USERNAME}/${postId}`;
    await apiRequest(
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

export async function fetchBlogPosts(page = 1, sort = "date", filter = "all") {
  const authToken = localStorage.getItem("authToken");
  const headers = authToken ? { Authorization: `Bearer ${authToken}` } : {};
  try {
    const response = await apiRequest(
      `${API_BASE_URL}/blog/posts/${USERNAME}`,
      "GET",
      headers
    );
    if (response && response.data && Array.isArray(response.data)) {
      let posts = response.data;

      // Filter posts by hashtag
      if (filter !== "all") {
        const normalizedFilter = filter.replace("#", "").toLowerCase();
        posts = posts.filter((post) =>
          post.tags.map((tag) => tag.toLowerCase()).includes(normalizedFilter)
        );
      }

      // Sort posts
      posts.sort((a, b) => {
        if (sort === "alphabet") {
          return a.title.localeCompare(b.title);
        } else if (sort === "date") {
          return new Date(b.date) - new Date(a.date);
        }
        return 0;
      });

      const totalPosts = posts.length;
      const totalPages = Math.ceil(totalPosts / POSTS_PER_PAGE);
      const paginatedPosts = posts.slice(
        (page - 1) * POSTS_PER_PAGE,
        page * POSTS_PER_PAGE
      );

      displayBlogPosts(paginatedPosts);
      displayCarouselPosts(posts.slice(-3));
      createPaginationControls(totalPages, page);
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
  blogContainer.innerHTML = "";
  posts.forEach((post) => {
    const postElement = createPostElement(post);
    blogContainer.appendChild(postElement);
  });
}

function displayCarouselPosts(posts) {
  const carouselInner = document.querySelector(".carousel-inner");
  if (!carouselInner) return;
  carouselInner.innerHTML = "";
  posts.forEach((post, index) => {
    const slide = createCarouselSlide(post, index === 0);
    carouselInner.appendChild(slide);
  });
}

function createPostElement(post) {
  const postElement = document.createElement("div");
  postElement.className = "card";
  postElement.dataset.hashtags = post.tags.join(" ").toLowerCase();
  postElement.dataset.date = post.date;

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

  postElement.addEventListener("click", function (event) {
    event.preventDefault();
    const authToken = localStorage.getItem("authToken");
    const postId = post.id;
    if (authToken && checkAdminRights(authToken)) {
      window.location.href = `/post/edit.html?id=${postId}`;
    } else {
      window.location.href = `/post/index.html?id=${postId}`;
    }
  });

  postElement.querySelector("a").addEventListener("click", function (event) {
    event.preventDefault(); // Prevent default behavior for link
    event.stopPropagation(); // Stop propagation to prevent triggering card click
    const authToken = localStorage.getItem("authToken");
    const postId = this.getAttribute("data-post-id");
    if (authToken && checkAdminRights(authToken)) {
      window.location.href = `/post/edit.html?id=${postId}`;
    } else {
      window.location.href = `/post/index.html?id=${postId}`;
    }
  });

  return postElement;
}

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

export async function deleteBlogPost(postId) {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No auth token found. Please login first.");
    showAlert("Please login to delete the blog post.", false);
    return;
  }

  try {
    const url = `${API_BASE_URL}/blog/posts/${USERNAME}/${postId}`;
    console.log("Deleting post with URL:", url);
    await apiRequest(url, "DELETE", { Authorization: `Bearer ${authToken}` });
    fetchBlogPosts();
  } catch (error) {
    console.error("Failed to delete blog post:", error);
    showAlert("Failed to delete blog post: " + error.message, false);
  }
}

function createPaginationControls(totalPages, currentPage) {
  const paginationContainer = document.getElementById("pagination-container");
  if (!paginationContainer) return;

  paginationContainer.innerHTML = "";

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = i === currentPage ? "active" : "";
    pageButton.addEventListener("click", () => fetchBlogPosts(i));
    paginationContainer.appendChild(pageButton);
  }
}

function checkAdminRights(token) {
  const adminEmail = "anglapin01435@stud.noroff.no";
  const email = parseJwt(token).email;
  return email === adminEmail;
}

function parseJwt(token) {
  const base64Url = token.split(".")[1];
  const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  const jsonPayload = decodeURIComponent(
    atob(base64)
      .split("")
      .map(function (c) {
        return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
      })
      .join("")
  );
  return JSON.parse(jsonPayload);
}
