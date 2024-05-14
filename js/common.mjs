export const API_BASE_URL = "https://v2.api.noroff.dev";
export const USERNAME = "angelinalapin";

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
  if (data.accessToken) {
    localStorage.setItem("authToken", data.accessToken);
    console.log("Authentication successful, token stored.");
  } else {
    console.error("Token not provided in the response.");
  }
}
