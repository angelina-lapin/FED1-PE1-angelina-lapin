import { registerUser, loginUser, redirectToPage } from "./user-management.mjs";
import { createBlogPost, fetchBlogPosts } from "./blog-management.mjs";

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");
  const postForm = document.getElementById("post-form");

  // Установка обработчика событий для формы регистрации
  registerForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    registerUser(username, email, password);
  });

  // Установка обработчика событий для формы входа
  loginForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(email, password);
  });

  // Установка обработчика событий для формы создания блог-поста
  postForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const title = document.getElementById("post-title").value;
    const authors = document.getElementById("authors").value;
    const tags = document.getElementById("tags").value;
    const content = document.getElementById("main-text").value;
    createBlogPost(title, content, authors, tags);
  });

  // Загрузка блог-постов при загрузке страницы
  fetchBlogPosts();
});
