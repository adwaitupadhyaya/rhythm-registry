export interface ConfirmModalOptions {
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDangerous?: boolean;
}

export function showConfirmModal(
  options: ConfirmModalOptions,
): Promise<boolean> {
  return new Promise((resolve) => {
    const {
      title,
      message,
      confirmText = "Confirm",
      cancelText = "Cancel",
      isDangerous = false,
    } = options;

    const overlay = document.createElement("div");
    overlay.className = "modal-overlay";

    const modal = document.createElement("div");
    modal.className = "modal-content";

    modal.innerHTML = `
      <div class="modal-header">
        <h2 class="modal-title">${title}</h2>
      </div>
      <div class="modal-body">
        <p class="modal-message">${message}</p>
      </div>
      <div class="modal-footer">
        <button class="btn btn--ghost modal-cancel">${cancelText}</button>
        <button class="btn ${isDangerous ? "btn--danger" : "btn--primary"} modal-confirm">${confirmText}</button>
      </div>
    `;

    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    const confirmBtn = modal.querySelector(".modal-confirm");
    const cancelBtn = modal.querySelector(".modal-cancel");

    const cleanup = () => {
      overlay.remove();
    };

    confirmBtn?.addEventListener("click", () => {
      cleanup();
      resolve(true);
    });

    cancelBtn?.addEventListener("click", () => {
      cleanup();
      resolve(false);
    });

    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        cleanup();
        resolve(false);
      }
    });

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        document.removeEventListener("keydown", handleEscape);
        cleanup();
        resolve(false);
      }
    };

    document.addEventListener("keydown", handleEscape);
  });
}
