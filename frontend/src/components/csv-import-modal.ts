import { artistService } from "@/services/artist.service";
import { showToast } from "@/utils/toast";

export function openCsvImportModal(onImport: () => Promise<void>): void {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">Import Artists from CSV</h2>
        <button class="modal__close" id="modal-close">✕</button>
      </div>

      <div class="modal__body">
        <div style="margin-bottom: 1.5rem;">
          <h3 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">CSV Format Requirements:</h3>
          <div style="background: var(--color-background); padding: 1rem; border-radius: var(--radius-md); font-size: 0.875rem;">
            <p style="margin-bottom: 0.5rem;"><strong>Required columns:</strong></p>
            <ul style="list-style: disc; margin-left: 1.5rem; color: var(--color-text-secondary);">
              <li>name</li>
              <li>dob (format: YYYY-MM-DD)</li>
              <li>gender (male/female/other)</li>
              <li>address</li>
              <li>first_release_year</li>
              <li>no_of_albums_released</li>
            </ul>
          </div>
        </div>

        <div style="margin-bottom: 1.5rem;">
          <h4 style="font-size: 0.875rem; font-weight: 600; margin-bottom: 0.5rem;">Example CSV:</h4>
          <pre style="background: var(--color-background); padding: 1rem; border-radius: var(--radius-md); font-size: 0.75rem; overflow-x: auto;">name,dob,gender,address,first_release_year,no_of_albums_released
John Doe,1990-05-15,male,"123 Music St",2015,5
Jane Smith,1985-03-20,female,"456 Artist Ave",2010,8</pre>
        </div>

        <div class="form-group">
          <label for="csv-file" class="form-label">Select CSV File</label>
          <input
            type="file"
            id="csv-file"
            accept=".csv"
            class="form-input"
            style="padding: 0.5rem;"
          />
          <span class="form-helper">Maximum file size: 5MB</span>
        </div>

        <div id="import-progress" style="display: none; margin-top: 1rem;">
          <div class="loading">
            <div class="spinner"></div>
            <p>Importing artists...</p>
          </div>
        </div>

        <div id="import-result" style="display: none; margin-top: 1rem;"></div>
      </div>

      <div class="modal__footer">
        <button type="button" class="btn btn--secondary" id="modal-cancel">Cancel</button>
        <button type="button" class="btn btn--primary" id="modal-import">Import</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const closeBtn = document.getElementById("modal-close");
  const cancelBtn = document.getElementById("modal-cancel");
  const importBtn = document.getElementById("modal-import");
  const fileInput = document.getElementById("csv-file") as HTMLInputElement;
  const progressDiv = document.getElementById("import-progress")!;
  const resultDiv = document.getElementById("import-result")!;

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

  // Import handler
  importBtn?.addEventListener("click", async () => {
    const file = fileInput.files?.[0];

    if (!file) {
      showToast("Please select a CSV file", "error");
      return;
    }

    if (!file.name.endsWith(".csv")) {
      showToast("Please select a valid CSV file", "error");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      showToast("File size must be less than 5MB", "error");
      return;
    }

    importBtn.setAttribute("disabled", "true");
    progressDiv.style.display = "block";
    resultDiv.style.display = "none";

    try {
      const result = await artistService.importCsv(file);

      progressDiv.style.display = "none";
      resultDiv.style.display = "block";

      if (result.success) {
        resultDiv.innerHTML = `
          <div style="background: var(--success-light); border: 1px solid var(--color-success); padding: 1rem; border-radius: var(--radius-md);">
            <p style="color: var(--color-success); font-weight: 600; margin-bottom: 0.5rem;">✓ Import Successful</p>
            <p style="font-size: 0.875rem; color: var(--color-text-secondary);">
              Imported: ${result.imported} artists<br>
              ${result.failed > 0 ? `Failed: ${result.failed} records` : ""}
            </p>
            ${
              result.errors && result.errors.length > 0
                ? `
              <details style="margin-top: 0.5rem;">
                <summary style="cursor: pointer; font-size: 0.875rem;">View errors</summary>
                <ul style="margin-top: 0.5rem; margin-left: 1.5rem; font-size: 0.75rem;">
                  ${result.errors.map((err) => `<li>${err}</li>`).join("")}
                </ul>
              </details>
            `
                : ""
            }
          </div>
        `;

        showToast(
          `Successfully imported ${result.imported} artists`,
          "success",
        );

        setTimeout(async () => {
          closeModal();
          await onImport();
        }, 2000);
      }
    } catch (error) {
      progressDiv.style.display = "none";
      resultDiv.style.display = "block";
      resultDiv.innerHTML = `
        <div style="background: var(--error-light); border: 1px solid var(--color-error); padding: 1rem; border-radius: var(--radius-md);">
          <p style="color: var(--color-error); font-weight: 600;">✕ Import Failed</p>
          <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.5rem;">
            ${(error as Error).message}
          </p>
        </div>
      `;
      showToast((error as Error).message, "error");
      importBtn.removeAttribute("disabled");
    }
  });
}
