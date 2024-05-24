import { apiRequest, showAlert, handleAuth, API_BASE_URL } from "./common.mjs";

export async function registerUser(username, email, password) {
  const url = `${API_BASE_URL}/auth/register`;
  try {
    const data = await apiRequest(
      url,
      "POST",
      {},
      { username, email, password }
    );
    console.log("registerUser received data:", data);
    handleAuth(data);
    alert("Registration successful!");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Registration failed:", error);
    alert(`Registration failed: ${error.message}`);
  }
}

export async function loginUser(email, password) {
  const url = `${API_BASE_URL}/auth/login`;
  try {
    const data = await apiRequest(url, "POST", {}, { email, password });
    console.log("loginUser received data:", data);
    handleAuth(data);
    alert("Login successful!");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Login failed:", error);
    alert(`Login failed: ${error.message}`);
  }
}
