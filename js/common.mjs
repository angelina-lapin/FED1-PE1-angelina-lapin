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

  console.log("Making API request to:", url);
  console.log("Request options:", options);

  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return;
    }

    const data = await response.json();
    if (!response.ok) {
      console.error("API request failed:", data);
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
  alert(message);
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
    window.location.href = "/account/login.html";
  }
}
