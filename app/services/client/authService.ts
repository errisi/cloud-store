import { authClient } from "../../http/authClient";

async function register(email: string, password: string) {
  return authClient.post("/users/register", {
    email,
    password,
  });
}

async function login(email: string, password: string) {
  return authClient.post("/users/login", { email, password });
}

async function sendResetToken(email: string) {
  return authClient.post("/users/forgot-password", { email });
}

async function resetPassword(resetToken: string, password: string) {
  return authClient.post(`/users/reset-password/${resetToken}`, { password });
}

async function logout() {
  return authClient.post("/users/logout");
}

async function activate(activationToken: string) {
  return authClient.get(`/users/activate/${activationToken}`);
}

async function refresh() {
  return authClient.get("/users/refresh");
}

export const authService = {
  register,
  login,
  logout,
  activate,
  refresh,
  sendResetToken,
  resetPassword,
};
