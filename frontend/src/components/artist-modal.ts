import { artistService } from "@/services/artist.service";
import { showToast } from "@/utils/toast";
import {
  isRequired,
  showFieldError,
  clearFormErrors,
  setFormDisabled,
} from "@/utils/validation";
import type { Artist, Gender } from "@/types";

export function openArtistModal(
  mode: "create" | "edit",
  artist: Artist | null,
  onSave: () => Promise<void>,
): void {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <h2 class="modal__title">${mode === "create" ? "Create Artist" : "Edit Artist"}</h2>
        <button class="modal__close" id="modal-close">✕</button>
      </div>

      <div class="modal__body">
        <form id="artist-form" class="form" novalidate>
          <div class="form-group">
            <label for="name" class="form-label">Artist Name</label>
            <input
              type="text"
              id="name"
              name="name"
              class="form-input"
              value="${artist?.name || ""}"
              placeholder="Enter artist name"
              required
            />
          </div>

          <div class="form-group">
            <label for="dob" class="form-label">Date of Birth</label>
            <input
              type="date"
              id="dob"
              name="dob"
              class="form-input"
              value="${artist?.dob ? new Date(artist.dob).toISOString().split("T")[0] : ""}"
              required
            />
          </div>

          <div class="form-group">
            <label for="gender" class="form-label">Gender</label>
            <select id="gender" name="gender" class="form-select" required>
              <option value="">Select gender...</option>
              <option value="male" ${artist?.gender === "male" ? "selected" : ""}>Male</option>
              <option value="female" ${artist?.gender === "female" ? "selected" : ""}>Female</option>
              <option value="other" ${artist?.gender === "other" ? "selected" : ""}>Other</option>
            </select>
          </div>

          <div class="form-group">
            <label for="address" class="form-label">Address</label>
            <textarea
              id="address"
              name="address"
              class="form-input"
              rows="3"
              placeholder="Enter address"
              required
            >${artist?.address || ""}</textarea>
          </div>

          <div class="form-group">
            <label for="first_release_year" class="form-label">First Release Year</label>
            <input
              type="number"
              id="first_release_year"
              name="first_release_year"
              class="form-input"
              value="${artist?.first_release_year || ""}"
              min="1900"
              max="${new Date().getFullYear()}"
              placeholder="e.g., 2020"
              required
            />
          </div>

          <div class="form-group">
            <label for="no_of_albums_released" class="form-label">Number of Albums Released</label>
            <input
              type="number"
              id="no_of_albums_released"
              name="no_of_albums_released"
              class="form-input"
              value="${artist?.no_of_albums_released || 0}"
              min="0"
              placeholder="e.g., 5"
              required
            />
          </div>
        </form>
      </div>

      <div class="modal__footer">
        <button type="button" class="btn btn--secondary" id="modal-cancel">Cancel</button>
        <button type="button" class="btn btn--primary" id="modal-save">
          ${mode === "create" ? "Create Artist" : "Save Changes"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById("artist-form") as HTMLFormElement;
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

    const name = (
      document.getElementById("name") as HTMLInputElement
    ).value.trim();
    const dob = (document.getElementById("dob") as HTMLInputElement).value;
    const gender = (document.getElementById("gender") as HTMLSelectElement)
      .value as Gender;
    const address = (
      document.getElementById("address") as HTMLTextAreaElement
    ).value.trim();
    const firstReleaseYear = parseInt(
      (document.getElementById("first_release_year") as HTMLInputElement).value,
    );
    const noOfAlbums = parseInt(
      (document.getElementById("no_of_albums_released") as HTMLInputElement)
        .value,
    );

    let hasErrors = false;

    if (!isRequired(name)) {
      showFieldError(
        document.getElementById("name") as HTMLInputElement,
        "Artist name is required",
      );
      hasErrors = true;
    }

    if (!isRequired(dob)) {
      showFieldError(
        document.getElementById("dob") as HTMLInputElement,
        "Date of birth is required",
      );
      hasErrors = true;
    }

    if (!isRequired(gender)) {
      showFieldError(
        document.getElementById("gender") as HTMLSelectElement,
        "Gender is required",
      );
      hasErrors = true;
    }

    if (!isRequired(address)) {
      showFieldError(
        document.getElementById("address") as HTMLInputElement,
        "Address is required",
      );
      hasErrors = true;
    }

    if (
      !firstReleaseYear ||
      firstReleaseYear < 1900 ||
      firstReleaseYear > new Date().getFullYear()
    ) {
      showFieldError(
        document.getElementById("first_release_year") as HTMLInputElement,
        "Valid release year is required",
      );
      hasErrors = true;
    }

    if (isNaN(noOfAlbums) || noOfAlbums < 0) {
      showFieldError(
        document.getElementById("no_of_albums_released") as HTMLInputElement,
        "Valid number of albums is required",
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    setFormDisabled(form, true);

    try {
      if (mode === "create") {
        await artistService.create({
          name,
          dob,
          gender,
          address,
          first_release_year: firstReleaseYear,
          no_of_albums_released: noOfAlbums,
        });

        showToast("Artist created successfully", "success");
      } else if (artist) {
        await artistService.update(artist.id, {
          name,
          dob,
          gender,
          address,
          first_release_year: firstReleaseYear,
          no_of_albums_released: noOfAlbums,
        });

        showToast("Artist updated successfully", "success");
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
    (document.getElementById("name") as HTMLInputElement)?.focus();
  }, 100);
}
