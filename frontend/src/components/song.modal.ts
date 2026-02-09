import { songService } from "@/services/song.service";
import { showToast } from "@/utils/toast";
import {
  isRequired,
  showFieldError,
  clearFormErrors,
  setFormDisabled,
} from "@/utils/validation";
import type { Song, Genre } from "@/types";

export function openSongModal(
  mode: "create" | "edit",
  artistId: number,
  artistName: string,
  song: Song | null,
  onSave: () => Promise<void>,
): void {
  const overlay = document.createElement("div");
  overlay.className = "modal-overlay";

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal__header">
        <div>
          <h2 class="modal__title">${mode === "create" ? "Add Song" : "Edit Song"}</h2>
          <p style="font-size: 0.875rem; color: var(--color-text-secondary); margin-top: 0.25rem;">
            for ${escapeHtml(artistName)}
          </p>
        </div>
        <button class="modal__close" id="modal-close">✕</button>
      </div>

      <div class="modal__body">
        <form id="song-form" class="form" novalidate>
          <div class="form-group">
            <label for="title" class="form-label">Song Title</label>
            <input
              type="text"
              id="title"
              name="title"
              class="form-input"
              value="${song?.title || ""}"
              placeholder="Enter song title"
              required
            />
          </div>

          <div class="form-group">
            <label for="album_name" class="form-label">Album Name</label>
            <input
              type="text"
              id="album_name"
              name="album_name"
              class="form-input"
              value="${song?.album_name || ""}"
              placeholder="Enter album name"
              required
            />
          </div>

          <div class="form-group">
            <label for="genre" class="form-label">Genre</label>
            <select id="genre" name="genre" class="form-select" required>
              <option value="">Select genre...</option>
              <option value="rnb" ${song?.genre === "rnb" ? "selected" : ""}>R&B</option>
              <option value="country" ${song?.genre === "country" ? "selected" : ""}>Country</option>
              <option value="classic" ${song?.genre === "classic" ? "selected" : ""}>Classic</option>
              <option value="rock" ${song?.genre === "rock" ? "selected" : ""}>Rock</option>
              <option value="jazz" ${song?.genre === "jazz" ? "selected" : ""}>Jazz</option>
            </select>
          </div>

          <div class="form-group">
            <label for="release_date" class="form-label">Release Date</label>
            <input
              type="date"
              id="release_date"
              name="release_date"
              class="form-input"
              value="${song?.release_date ? new Date(song.release_date).toISOString().split("T")[0] : ""}"
              required
            />
          </div>
        </form>
      </div>

      <div class="modal__footer">
        <button type="button" class="btn btn--secondary" id="modal-cancel">Cancel</button>
        <button type="button" class="btn btn--primary" id="modal-save">
          ${mode === "create" ? "Add Song" : "Save Changes"}
        </button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);

  const form = document.getElementById("song-form") as HTMLFormElement;
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

    const title = (
      document.getElementById("title") as HTMLInputElement
    ).value.trim();
    const albumName = (
      document.getElementById("album_name") as HTMLInputElement
    ).value.trim();
    const genre = (document.getElementById("genre") as HTMLSelectElement)
      .value as Genre;
    const releaseDate = (
      document.getElementById("release_date") as HTMLInputElement
    ).value;

    let hasErrors = false;

    if (!isRequired(title)) {
      showFieldError(
        document.getElementById("title") as HTMLInputElement,
        "Song title is required",
      );
      hasErrors = true;
    }

    if (!isRequired(albumName)) {
      showFieldError(
        document.getElementById("album_name") as HTMLInputElement,
        "Album name is required",
      );
      hasErrors = true;
    }

    if (!isRequired(genre)) {
      showFieldError(
        document.getElementById("genre") as HTMLSelectElement,
        "Genre is required",
      );
      hasErrors = true;
    }

    if (!isRequired(releaseDate)) {
      showFieldError(
        document.getElementById("release_date") as HTMLInputElement,
        "Release date is required",
      );
      hasErrors = true;
    }

    if (hasErrors) return;

    setFormDisabled(form, true);

    try {
      if (mode === "create") {
        await songService.create(artistId, {
          title,
          album_name: albumName,
          genre,
          release_date: releaseDate,
        });

        showToast("Song added successfully", "success");
      } else if (song) {
        await songService.update(artistId, song.id, {
          title,
          album_name: albumName,
          genre,
          release_date: releaseDate,
        });

        showToast("Song updated successfully", "success");
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
    (document.getElementById("title") as HTMLInputElement)?.focus();
  }, 100);
}

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
