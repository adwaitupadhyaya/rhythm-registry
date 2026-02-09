import { userService } from "@/services/user.service";
import { showToast } from "@/utils/toast";
import {
  isValidEmail,
  isRequired,
  validatePassword,
  showFieldError,
  clearFormErrors,
  setFormDisabled,
} from "@/utils/validation";
import type { User, UserRole } from "@/types";

export function openUserModal(
  mode: "create" | "edit",
  user: User | null,
  onSave: () => Promise<void>,
): void {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">${mode === "create" ? "Create User" : "Edit User"}</h2>
        <button class="modal__close" id="modal-close">✕</button>
      </div>

      <div class="modal__body">
        <form id="user-form" class="form" novalidate>
          <div class="form-group">
            <label for="first_name" class="form-label">First Name</label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              class="form-input"
              value="${user?.first_name || ""}"
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
              value="${user?.last_name || ""}"
              required
            />
          </div>

          ${
            mode === "create"
              ? `
            <div class="form-group">
              <label for="email" class="form-label">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                class="form-input"
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
                required
              />
              <span class="form-helper">At least 8 characters with uppercase, lowercase, and number</span>
            </div>
          `
              : ""
          }

          <div class="form-group">
            <label for="role" class="form-label">Role</label>
            <select id="role" name="role" class="form-select" required>
              <option value="">Select role...</option>
              <option value="super_admin" ${user?.role === "super_admin" ? "selected" : ""}>Super Admin</option>
              <option value="artist_manager" ${user?.role === "artist_manager" ? "selected" : ""}>Artist Manager</option>
              <option value="artist" ${user?.role === "artist" ? "selected" : ""}>Artist</option>
            </select>
          </div>

          ${
            mode === "edit"
              ? `
            <div class="form-group">
              <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                <input
                  type="checkbox"
                  id="is_active"
                  name="is_active"
                  ${user?.is_active ? "checked" : ""}
                />
                <span class="form-label" style="margin: 0;">Active</span>
              </label>
              <span class="form-helper">Inactive users cannot log in</span>
            </div>
          `
              : ""
          }
        </form>
      </div>

      <div class="modal__footer">
        <button type="button" class="btn btn--secondary" id="modal-cancel">Cancel</button>
        <button type="button" class="btn btn--primary" id="modal-save">
          ${mode === "create" ? "Create User" : "Save Changes"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById("user-form") as HTMLFormElement;
  const closeBtn = document.getElementById("modal-close");
  const cancelBtn = document.getElementById("modal-cancel");
  const saveBtn = document.getElementById("modal-save");

  // Close handlers
  const closeModal = () => {
    overlay.style.animation = "fadeOut 0.2s ease";
    setTimeout(() => overlay.remove(), 200);
  };

  closeBtn?.addEventListener("click", closeModal);
  cancelBtn?.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  // Save handler
  saveBtn?.addEventListener("click", async () => {
    clearFormErrors(form);

    const firstName = (
      document.getElementById("first_name") as HTMLInputElement
    ).value.trim();
    const lastName = (
      document.getElementById("last_name") as HTMLInputElement
    ).value.trim();
    const role = (document.getElementById("role") as HTMLSelectElement).value;

    let hasErrors = false;

    if (!isRequired(firstName)) {
      showFieldError(
        document.getElementById("first_name") as HTMLInputElement,
        "First name is required",
      );
      hasErrors = true;
    }

    if (!isRequired(lastName)) {
      showFieldError(
        document.getElementById("last_name") as HTMLInputElement,
        "Last name is required",
      );
      hasErrors = true;
    }

    if (!isRequired(role)) {
      showFieldError(
        document.getElementById("role") as HTMLSelectElement,
        "Role is required",
      );
      hasErrors = true;
    }

    if (mode === "create") {
      const email = (
        document.getElementById("email") as HTMLInputElement
      ).value.trim();
      const password = (document.getElementById("password") as HTMLInputElement)
        .value;

      if (!isRequired(email)) {
        showFieldError(
          document.getElementById("email") as HTMLInputElement,
          "Email is required",
        );
        hasErrors = true;
      } else if (!isValidEmail(email)) {
        showFieldError(
          document.getElementById("email") as HTMLInputElement,
          "Please enter a valid email",
        );
        hasErrors = true;
      }

      if (!isRequired(password)) {
        showFieldError(
          document.getElementById("password") as HTMLInputElement,
          "Password is required",
        );
        hasErrors = true;
      } else {
        const validation = validatePassword(password);
        if (!validation.isValid) {
          showFieldError(
            document.getElementById("password") as HTMLInputElement,
            validation.errors[0],
          );
          hasErrors = true;
        }
      }
    }

    if (hasErrors) return;

    setFormDisabled(form, true);

    try {
      if (mode === "create") {
        const email = (
          document.getElementById("email") as HTMLInputElement
        ).value.trim();
        const password = (
          document.getElementById("password") as HTMLInputElement
        ).value;

        await userService.create({
          first_name: firstName,
          last_name: lastName,
          email,
          password,
          role: role as UserRole,
        });

        showToast("User created successfully", "success");
      } else if (user) {
        const isActive = (
          document.getElementById("is_active") as HTMLInputElement
        ).checked;

        await userService.update(user.id, {
          first_name: firstName,
          last_name: lastName,
          role: role as UserRole,
          is_active: isActive,
        });

        showToast("User updated successfully", "success");
      }

      closeModal();
      await onSave();
    } catch (error) {
      showToast((error as Error).message, "error");
      setFormDisabled(form, false);
    }
  });

  // Focus first input
  setTimeout(() => {
    (document.getElementById("first_name") as HTMLInputElement)?.focus();
  }, 100);
}
