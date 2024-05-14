import {
  apiRequest,
  showAlert,
  API_BASE_URL,
  USERNAME,
  handleAuth,
} from "./common.mjs";

async function registerUser(username, email, password) {
  const url = `${API_BASE_URL}/auth/register`;
  try {
    const data = await apiRequest(
      url,
      "POST",
      {},
      { username, email, password }
    );
    showAlert("User registered successfully!", true);
    handleAuth(data);
  } catch (error) {
    showAlert(error.message, false);
  }
}

async function loginUser(email, password) {
  const url = `${API_BASE_URL}/auth/login`;
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (response.ok) {
      if (data.accessToken) {
        localStorage.setItem("authToken", data.accessToken);
        console.log("Authentication successful, token stored.");
      } else {
        console.error("Token not provided in response.");
        // Обработка ситуации, когда токен не пришел, но ответ сервера успешен
      }
    } else {
      throw new Error(data.message || "Authentication failed");
    }
  } catch (error) {
    console.error("Login request failed:", error);
  }
}

function redirectToPage(email) {
  const ALLOWED_EMAIL = "anglapin01435@stud.noroff.no";
  if (email === ALLOWED_EMAIL) {
    window.location.href = "./../post/edit.html";
  } else {
    window.location.href = "./../post/index.html";
  }
}

export { registerUser, loginUser, redirectToPage };
