const API_BASE_URL = "https://v2.api.noroff.dev";
const ALLOWED_USERNAME = "angelina_lapin"; // Укажите разрешённое имя пользователя

async function registerUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
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

async function loginUser(username, password) {
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });
  const data = await response.json();
  if (response.ok) {
    console.log("Login successful:", data);
    alert("Login successful!");
    localStorage.setItem("authToken", data.token); // Сохраните токен в локальное хранилище

    if (username === ADMIN_USERNAME) {
      // Перенаправить на страницу редактирования, если администратор
      window.location.href = "edit.html";
    } else {
      // Перенаправить на главную страницу для обычного пользователя
      window.location.href = "index.html";
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

  const response = await fetch(`${API_BASE_URL}/blog/posts/your_username`, {
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
    const username = document.getElementById("login-username").value;
    const email = document.getElementById("register-email").value;
    const password = document.getElementById("login-password").value;
    loginUser(username, email, password);
  });
