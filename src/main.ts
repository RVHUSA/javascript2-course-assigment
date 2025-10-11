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
      window.location.href = "/feed.html"; 
    } catch (error) {
      const errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.textContent = "Login failed. Check your email and password.";
      loginForm.appendChild(errorMsg);
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
      window.location.href = "/login.html"; 
    } catch (error) {
      const errorMsg = document.createElement("p");
      errorMsg.style.color = "red";
      errorMsg.textContent = "Registration failed. Try again.";
      registerForm.appendChild(errorMsg);
      console.error(error);
    }
  });
}
