import { registerUser, loginUser } from "./user-management.mjs";
import { fetchBlogPosts } from "./blog-management.mjs";

document.addEventListener("DOMContentLoaded", function () {
  const registerForm = document.getElementById("register-form");
  const loginForm = document.getElementById("login-form");

  // Регистрация пользователя
  registerForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    registerUser(username, email, password);
  });

  // Вход пользователя
  loginForm?.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(email, password);
  });

  // Загрузка блог-постов
  fetchBlogPosts().then(() => {
    // Обработчик кликов на ссылки после загрузки постов
    document.querySelectorAll(".card a").forEach((link) => {
      link.addEventListener("click", function (event) {
        event.preventDefault();
        const authToken = localStorage.getItem("authToken");
        const postId = this.getAttribute("data-post-id");
        if (authToken) {
          const isAdmin = checkAdminRights(authToken);
          if (isAdmin) {
            window.location.href = `/post/edit.html?id=${postId}`;
          } else {
            window.location.href = `/post/index.html?id=${postId}`;
          }
        } else {
          alert("You need to log in to edit posts.");
          window.location.href = "/account/login.html";
        }
      });
    });
  });
});

function checkAdminRights(token) {
  // Предполагаем, что если токен есть, то это админ (для простоты)
  // Реальная проверка может быть выполнена на сервере или с использованием данных из токена (JWT)
  return true;
}

// Загрузка блог-постов при загрузке страницы
fetchBlogPosts();
