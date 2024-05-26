import { apiRequest, handleAuth, API_BASE_URL } from "./common.mjs";

export async function registerUser(username, email, password) {
  if (!username || !email || !password) {
    console.error("All fields are required");
    alert("All fields are required");
    return;
  }

  const usernamePattern = /^[\w]+$/;
  const emailPattern = /^[\w\-.]+@(stud\.)?noroff\.no$/;

  if (!usernamePattern.test(username)) {
    console.error(
      "Username must contain only alphanumeric characters and underscores."
    );
    alert(
      "Username must contain only alphanumeric characters and underscores."
    );
    return;
  }

  if (!emailPattern.test(email)) {
    console.error("Email must be a valid noroff.no or stud.noroff.no address.");
    alert("Email must be a valid noroff.no or stud.noroff.no address.");
    return;
  }

  if (password.length < 8) {
    console.error("Password must be at least 8 characters long.");
    alert("Password must be at least 8 characters long.");
    return;
  }

  const url = `${API_BASE_URL}/auth/register`;
  const payload = {
    name: username,
    email: email,
    password: password,
  };

  console.log("Registering user with payload:", payload);

  try {
    const data = await apiRequest(url, "POST", {}, payload);
    console.log("registerUser received data:", data);
    handleAuth(data);
    alert("Registration successful!");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Registration failed:", error);
    if (error.errors && Array.isArray(error.errors)) {
      error.errors.forEach((err) => console.error(err.message));
      alert(
        `Registration failed: ${error.errors
          .map((err) => err.message)
          .join(", ")}`
      );
    } else {
      alert(`Registration failed: ${error.message}`);
    }
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
