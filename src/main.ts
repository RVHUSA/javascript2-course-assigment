import { login, register } from "./api/auth";

// --- LOGIN ---
const loginForm = document.getElementById("loginForm") as HTMLFormElement | null;

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      await login(email, password);
      alert("Login successful!");
      window.location.href = "/index.html"; 
    } catch (error) {
      alert("Login failed. Check your email and password.");
      console.error(error);
    }
  });
}

// --- REGISTER ---
const registerForm = document.getElementById("registerForm") as HTMLFormElement | null;

if (registerForm) {
  registerForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = (document.getElementById("name") as HTMLInputElement).value;
    const email = (document.getElementById("email") as HTMLInputElement).value;
    const password = (document.getElementById("password") as HTMLInputElement).value;

    try {
      await register(name, email, password);
      alert("Registration successful! You can now log in.");
      window.location.href = "/login.html"; 
    } catch (error) {
      alert("Registration failed. Try again.");
      console.error(error);
    }
  });
}
