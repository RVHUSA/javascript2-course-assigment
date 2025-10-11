import { AUTH_URL, API_KEY } from "./config";
import { saveToken, saveUser } from "../utils/storage";

interface LoginResponse {
  data?: {
    accessToken: string;
    name: string;
    email: string;
  };
  accessToken?: string;
  name?: string;
  email?: string;
}

// --- LOGIN ---
export async function login(email: string, password: string) {
  const response = await fetch(`${AUTH_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.errors?.[0]?.message || "Login failed");
  }

  const data: LoginResponse = await response.json();

  const token = data.accessToken || data.data?.accessToken;
  const name = data.name || data.data?.name;
  const emailRes = data.email || data.data?.email;

  if (!token) {
    console.error("Login succeeded but no token returned:", data);
    throw new Error("Login succeeded but no token returned");
  }

  saveToken(token);
  saveUser({ name: name || "Unknown", email: emailRes || email });
}

// --- REGISTER ---
export async function register(name: string, email: string, password: string) {
  const response = await fetch(`${AUTH_URL}/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Noroff-API-Key": API_KEY,
    },
    body: JSON.stringify({ name, email, password }),
  });

  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.errors?.[0]?.message || "Registration failed");
  }

  return await response.json();
}
