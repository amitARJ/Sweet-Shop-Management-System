const API_URL = "http://localhost:8000/api/auth";

export const registerUser = async ({ username, email, password }) => {
  const res = await fetch(`${API_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Registration error");
  }
  const data = await res.json();
  return data;
};

export const loginUser = async ({ email, password }) => {
  const formData = new URLSearchParams();
  formData.append("username", email); // OAuth2PasswordRequestForm expects 'username'
  formData.append("password", password);

  const res = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || "Login error");
  }

  const data = await res.json();
  localStorage.setItem("token", data.access_token);
  return data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

export const getToken = () => localStorage.getItem("token");

export const getCurrentUser = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;
  return token;
};
