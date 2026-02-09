import { authService } from '@/services/auth.service';
import { showToast } from '@/utils/toast';
import { isValidEmail, isRequired, showFieldError, clearFormErrors, setFormDisabled } from '@/utils/validation';

export async function renderLogin(): Promise<void> {
  const app = document.getElementById('app');
  if (!app) return;

  app.innerHTML = `
    <div class="auth-layout">
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
            <input
              type="password"
              id="password"
              name="password"
              class="form-input"
              placeholder="Enter your password"
              required
            />
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

  const form = document.getElementById('login-form') as HTMLFormElement;
  const emailInput = document.getElementById('email') as HTMLInputElement;
  const passwordInput = document.getElementById('password') as HTMLInputElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    clearFormErrors(form);

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    let hasErrors = false;

    if (!isRequired(email)) {
      showFieldError(emailInput, 'Email is required');
      hasErrors = true;
    } else if (!isValidEmail(email)) {
      showFieldError(emailInput, 'Please enter a valid email');
      hasErrors = true;
    }

    if (!isRequired(password)) {
      showFieldError(passwordInput, 'Password is required');
      hasErrors = true;
    }

    if (hasErrors) return;

    setFormDisabled(form, true);

    try {
      await authService.login({ email, password });
      showToast('Login successful!', 'success');
      
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 500);
    } catch (error) {
      showToast((error as Error).message, 'error');
      setFormDisabled(form, false);
      passwordInput.focus();
    }
  });

  emailInput.focus();
}
