export const API_BASE_URL = "https://v2.api.noroff.dev";
export const USERNAME = "angelinalapina";

export async function apiRequest(url, method, headers = {}, body = null) {
  const options = {
    method: method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
      Authorization: `Bearer ${localStorage.getItem("authToken")}`,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();
    if (!response.ok) {
      throw data;
    }
    return data;
  } catch (error) {
    console.error("API request failed:", error);
    checkAuthError(error);
    throw error;
  }
}

export function showAlert(message, isSuccess = true) {
  alert(message); // Простое текстовое уведомление
}

export function handleAuth(data) {
  console.log("handleAuth received data:", data);
  const token = data.data?.accessToken;
  if (token) {
    localStorage.setItem("authToken", token);
    console.log("Authentication successful, token stored.");
  } else {
    console.error("Token not provided in the response.");
  }
}

function checkAuthError(error) {
  if (error.statusCode === 401) {
    showAlert("Session expired. Please log in again.", false);
    // Редирект на страницу входа
    window.location.href = "/account/login.html";
  }
}
