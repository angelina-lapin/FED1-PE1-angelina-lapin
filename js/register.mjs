const API_BASE_URL = "https://v2.api.noroff.dev";
const ALLOWED_EMAIL = "anglap01435@stud.noroff.no"; // Укажите разрешённое имя пользователя

async function registerUser(username, email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: username,
      email: email,
      password: password,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log("User registered successfully:", data);
    alert("User registered successfully!");
  } else {
    console.error("Registration failed:", data);
    alert(
      "Registration failed: " +
        (data.errors ? data.errors[0].message : "Unknown error")
    );
  }
}

async function loginUser(email, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log("Login successful:", data);
    alert("Login successful!");
    localStorage.setItem("authToken", data.token); // Сохраните токен в локальное хранилище

    if (email === ALLOWED_EMAIL) {
      // Перенаправить на страницу редактирования, если администратор
      window.location.href = "post/edit.html";
    } else {
      // Перенаправить на главную страницу для обычного пользователя
      window.location.href = "post/index.html";
    }
  } else {
    console.error("Login failed:", data);
    alert(
      "Login failed: " +
        (data.errors ? data.errors[0].message : "Unknown error")
    );
  }
}

async function fetchBlogPosts() {
  const authToken = localStorage.getItem("authToken");
  if (!authToken) {
    console.error("No auth token found. Please login first.");
    return;
  }

  const response = await fetch(`${API_BASE_URL}/blog/posts/angelinalapin`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();
  if (response.ok) {
    console.log("Fetched blog posts:", data);
    displayBlogPosts(data); // Вызов функции для отображения блог-постов
  } else {
    console.error("Failed to fetch blog posts:", data);
  }
}

function displayBlogPosts(posts) {
  const blogContainer = document.getElementById("blog-posts-container");
  blogContainer.innerHTML = ""; // Очистить контейнер перед добавлением новых постов

  posts.forEach((post) => {
    const postElement = document.createElement("div");
    postElement.className = "post";
    postElement.innerHTML = `
            <h3>${post.title}</h3>
            <p>${post.content}</p>
        `;
    blogContainer.appendChild(postElement);
  });
}

// Привязываем события к формам
document
  .getElementById("register-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвратить перезагрузку страницы
    const username = document.getElementById("register-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("register-password").value;
    registerUser(username, email, password);
  });

document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault(); // Предотвратить перезагрузку страницы

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(email, password);
  });
