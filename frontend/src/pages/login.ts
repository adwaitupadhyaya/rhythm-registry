import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import { toggleTheme } from "@/utils/theme";
import {
  isValidEmail,
  isRequired,
  showFieldError,
  clearFormErrors,
  setFormDisabled,
} from "@/utils/validation";

export async function renderLogin(): Promise<void> {
  const app = document.getElementById("app");
  if (!app) return;

  app.innerHTML = `
    <div class="auth-layout">
      <button id="auth-theme-toggle" class="btn btn--icon" style="position: fixed; top: 1rem; right: 1rem; z-index: 1000;" title="Toggle theme">
        👁️
      </button>
      <div class="auth-card">
        <div class="auth-card__logo">
          <h1>Rhythm Registry</h1>
          <p class="auth-card__subtitle">Artist Management System</p>
        </div>

        <form id="login-form" class="form" novalidate>
          <div class="form-group">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              class="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div class="form-group">
            <label for="password" class="form-label">Password</label>
            <div style="position: relative;">
              <input
                type="password"
                id="password"
                name="password"
                class="form-input"
                placeholder="Enter your password"
                required
              />
              <button
                type="button"
                id="password-toggle"
                class="btn btn--icon"
                style="position: absolute; right: 0.5rem; top: 50%; transform: translateY(-50%); padding: 0.5rem; cursor: pointer;"
                title="Toggle password visibility"
              >
                👁️
              </button>
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--block">
            Sign In
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">
            Don't have an account?
          </p>
          <a href="/register" class="text-link" data-link>Create an account</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById("login-form") as HTMLFormElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const passwordToggle = document.getElementById(
    "password-toggle",
  ) as HTMLButtonElement;
  const authThemeToggle = document.getElementById(
    "auth-theme-toggle",
  ) as HTMLButtonElement;

  passwordToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    passwordToggle.textContent = isPassword ? "🙈" : "👁️";
  });

  authThemeToggle.addEventListener("click", () => {
    toggleTheme();
    const isDarkMode =
      document.documentElement.getAttribute("data-theme") === "dark";
    authThemeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  });

  // Set initial theme icon
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";
  authThemeToggle.textContent = isDarkMode ? "☀️" : "🌙";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormErrors(form);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasErrors = false;

    if (!isRequired(email)) {
      showFieldError(emailInput, "Email is required");
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, "Please enter a valid email");
      hasErrors = true;
    }

    if (!isRequired(password)) {
      showFieldError(passwordInput, "Password is required");
      hasErrors = true;
    }

    if (hasErrors) return;

    setFormDisabled(form, true);

    try {
      await authService.login({ email, password });
      showToast("Login successful!", "success");

      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 500);
    } catch (error) {
      showToast((error as Error).message, "error");
      setFormDisabled(form, false);
      passwordInput.focus();
    }
  });

  emailInput.focus();
}
