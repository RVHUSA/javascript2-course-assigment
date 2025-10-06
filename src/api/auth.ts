import { AUTH_URL } from "./config";
import { saveToken, saveUser } from "../utils/storage";

interface LoginResponse {
  accessToken: string;
  name: string;
  email: string;
}

export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) throw new Error("Login failed");

  const data: LoginResponse = await response.json();

  saveToken(data.accessToken);
  saveUser({ name: data.name, email: data.email });
}

export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) throw new Error("Registration failed");

  const data = await response.json();
  return data;
}
