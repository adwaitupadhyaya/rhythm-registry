import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import { toggleTheme } from "@/utils/theme";
import {
  isValidEmail,
  isRequired,
  validatePassword,
  showFieldError,
  clearFormErrors,
  setFormDisabled,
} from "@/utils/validation";

export async function renderRegister(): Promise<void> {
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
          <p class="auth-card__subtitle">Create your account</p>
        </div>

        <form id="register-form" class="form" novalidate>
          <div class="form-row">
            <div class="form-group">
              <label for="first_name" class="form-label">First Name</label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                class="form-input"
                placeholder="Enter your first name"
                required
              />
            </div>

            <div class="form-group">
              <label for="last_name" class="form-label">Last Name</label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                class="form-input"
                placeholder="Enter your last name"
                required
              />
            </div>
          </div>

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

          <div class="form-row">
            <div class="form-group">
              <label for="password" class="form-label">Password</label>
              <div style="position: relative;">
                <input
                  type="password"
                  id="password"
                  name="password"
                  class="form-input"
                  placeholder="Create a strong password"
                  required
                />
                <button
                  type="button"
                  id="password-toggle"
                  class="btn btn--icon"
                  style="position: absolute; right: 0.5rem; top: 0.5rem; padding: 0.5rem; cursor: pointer;"
                  title="Toggle password visibility"
                >
                  👁️
                </button>
              </div>
              <span class="form-helper">
                At least 8 characters with uppercase, lowercase, and number
              </span>
            </div>

            <div class="form-group">
              <label for="confirm_password" class="form-label">Confirm Password</label>
              <div style="position: relative;">
                <input
                  type="password"
                  id="confirm_password"
                  name="confirm_password"
                  class="form-input"
                  placeholder="Re-enter your password"
                  required
                />
                <button
                  type="button"
                  id="confirm-password-toggle"
                  class="btn btn--icon"
                  style="position: absolute; right: 0.5rem; top: 0.5rem; padding: 0.5rem; cursor: pointer;"
                  title="Toggle password visibility"
                >
                  👁️
                </button>
              </div>
            </div>
          </div>

          <button type="submit" class="btn btn--primary btn--block">
            Create Account
          </button>
        </form>

        <div style="text-align: center; margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--color-border);">
          <p style="color: var(--color-text-secondary); font-size: var(--font-size-sm); margin-bottom: 0.5rem;">
            Already have an account?
          </p>
          <a href="/" class="text-link" data-link>Sign in</a>
        </div>
      </div>
    </div>
  `;

  const form = document.getElementById("register-form") as HTMLFormElement;
  const firstNameInput = document.getElementById(
    "first_name",
  ) as HTMLInputElement;
  const lastNameInput = document.getElementById(
    "last_name",
  ) as HTMLInputElement;
  const emailInput = document.getElementById("email") as HTMLInputElement;
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const confirmPasswordInput = document.getElementById(
    "confirm_password",
  ) as HTMLInputElement;
  const passwordToggle = document.getElementById(
    "password-toggle",
  ) as HTMLButtonElement;
  const confirmPasswordToggle = document.getElementById(
    "confirm-password-toggle",
  ) as HTMLButtonElement;

  passwordToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isPassword = passwordInput.type === "password";
    passwordInput.type = isPassword ? "text" : "password";
    passwordToggle.textContent = isPassword ? "🙈" : "👁️";
  });

  confirmPasswordToggle.addEventListener("click", (e) => {
    e.preventDefault();
    const isPassword = confirmPasswordInput.type === "password";
    confirmPasswordInput.type = isPassword ? "text" : "password";
    confirmPasswordToggle.textContent = isPassword ? "🙈" : "👁️";
  });

  const authThemeToggle = document.getElementById(
    "auth-theme-toggle",
  ) as HTMLButtonElement;
  authThemeToggle.addEventListener("click", () => {
    toggleTheme();
    const isDarkMode =
      document.documentElement.getAttribute("data-theme") === "dark";
    authThemeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  });

  // Set initial theme icon
  const isDarkModeOnLoad =
    document.documentElement.getAttribute("data-theme") === "dark";
  authThemeToggle.textContent = isDarkModeOnLoad ? "☀️" : "🌙";

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    clearFormErrors(form);

    const firstName = firstNameInput.value.trim();
    const lastName = lastNameInput.value.trim();
    const email = emailInput.value.trim();
    const password = passwordInput.value;
    const confirmPassword = confirmPasswordInput.value;

    let hasErrors = false;

    if (!isRequired(firstName)) {
      showFieldError(firstNameInput, "First name is required");
      hasErrors = true;
    }

    if (!isRequired(lastName)) {
      showFieldError(lastNameInput, "Last name is required");
      hasErrors = true;
    }

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
    } else {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        showFieldError(passwordInput, passwordValidation.errors[0]);
        hasErrors = true;
      }
    }

    if (!isRequired(confirmPassword)) {
      showFieldError(confirmPasswordInput, "Please confirm your password");
      hasErrors = true;
    } else if (password !== confirmPassword) {
      showFieldError(confirmPasswordInput, "Passwords do not match");
      hasErrors = true;
    }

    if (hasErrors) return;

    setFormDisabled(form, true);

    try {
      await authService.register({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
        role: "super_admin",
      });

      showToast("Registration successful! Please login.", "success");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (error) {
      showToast((error as Error).message, "error");
      setFormDisabled(form, false);
    }
  });

  firstNameInput.focus();
}
