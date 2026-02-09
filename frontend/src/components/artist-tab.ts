import { artistService } from "@/services/artist.service";
import { showConfirmModal } from "./confirm-modal";
import { authService } from "@/services/auth.service";
import { showToast } from "@/utils/toast";
import { openArtistModal } from "./artist-modal";
import { openCsvImportModal } from "./csv-import-modal";

import type { Artist } from "@/types";
import { renderSongsPage } from "@/pages/songs";

let currentPage = 1;
const limit = 10;

export async function renderArtistsTab(): Promise<void> {
  const content = document.getElementById("tab-content");
  if (!content) return;

  const currentUser = authService.getCurrentUser();
  const canManage = currentUser?.role === "artist_manager";

  content.innerHTML = `
    <div class="card">
      <div class="card__header">
        <h2 class="card__title">Artists</h2>
        <div class="action-buttons">
          ${
            canManage
              ? `
            <button id="import-csv-btn" class="btn btn--secondary btn--sm">
              📤 Import CSV
            </button>
            <button id="export-csv-btn" class="btn btn--secondary btn--sm">
              📥 Export CSV
            </button>
            <button id="create-artist-btn" class="btn btn--primary btn--sm">
              + Create Artist
            </button>
          `
              : ""
          }
        </div>
      </div>

      <div id="artists-table-container">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading artists...</p>
        </div>
      </div>
    </div>
  `;

  // Load artists
  await loadArtists();

  // Setup buttons (only for artist_manager)
  if (canManage) {
    const createBtn = document.getElementById("create-artist-btn");
    createBtn?.addEventListener("click", () => {
      openArtistModal("create", null, async () => {
        currentPage = 1;
        await loadArtists();
      });
    });

    const importBtn = document.getElementById("import-csv-btn");
    importBtn?.addEventListener("click", () => {
      openCsvImportModal(async () => {
        currentPage = 1;
        await loadArtists();
      });
    });

    const exportBtn = document.getElementById("export-csv-btn");
    exportBtn?.addEventListener("click", async () => {
      try {
        const blob = await artistService.exportCsv();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `artists-${new Date().toISOString().split("T")[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
        showToast("Artists exported successfully", "success");
      } catch (error) {
        showToast((error as Error).message, "error");
      }
    });
  }
}

async function loadArtists(): Promise<void> {
  const container = document.getElementById("artists-table-container");
  if (!container) return;

  const currentUser = authService.getCurrentUser();
  const canManage = currentUser?.role === "artist_manager";

  try {
    const offset = (currentPage - 1) * limit;
    const artists = await artistService.getAll({ limit, offset });

    if (artists.length === 0 && currentPage === 1) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🎵</div>
          <h3 class="empty-state__title">No artists found</h3>
          <p>Get started by creating your first artist.</p>
        </div>
      `;
      return;
    }

    if (artists.length === 0 && currentPage > 1) {
      currentPage--;
      await loadArtists();
      return;
    }

    container.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Date of Birth</th>
              <th>Gender</th>
              <th>Address</th>
              <th>First Release</th>
              <th>Albums</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${artists.map((artist) => renderArtistRow(artist, canManage)).join("")}
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination__info">
          Showing ${offset + 1}-${offset + artists.length}
        </div>
        <div class="pagination__controls">
          <button 
            class="btn btn--secondary btn--sm" 
            id="prev-page" 
            ${currentPage === 1 ? "disabled" : ""}
          >
            Previous
          </button>
          <span style="padding: 0 1rem;">Page ${currentPage}</span>
          <button 
            class="btn btn--secondary btn--sm" 
            id="next-page"
            ${artists.length < limit ? "disabled" : ""}
          >
            Next
          </button>
        </div>
      </div>
    `;

    // Setup action buttons
    setupActionButtons(canManage);
    setupPagination();
  } catch (error) {
    showToast((error as Error).message, "error");
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <h3 class="empty-state__title">Failed to load artists</h3>
        <p>${(error as Error).message}</p>
      </div>
    `;
  }
}

function renderArtistRow(artist: Artist, canManage: boolean): string {
  return `
    <tr>
      <td>${artist.id}</td>
      <td><strong>${escapeHtml(artist.name)}</strong></td>
      <td>${formatDate(artist.dob)}</td>
      <td>
        <span class="badge badge--secondary">
          ${formatGender(artist.gender)}
        </span>
      </td>
      <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;" title="${escapeHtml(artist.address)}">
        ${escapeHtml(artist.address)}
      </td>
      <td>${artist.first_release_year}</td>
      <td>${artist.no_of_albums_released}</td>
      <td>${formatDate(artist.created_at)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--ghost btn--sm view-songs" data-id="${artist.id}" data-name="${escapeHtml(artist.name)}" title="View Songs">
            🎵
          </button>
          ${
            canManage
              ? `
            <button class="btn btn--ghost btn--sm edit-artist" data-artist='${JSON.stringify(artist)}' title="Edit">
              ✏️
            </button>
            <button class="btn btn--ghost btn--sm delete-artist" data-id="${artist.id}" data-name="${escapeHtml(artist.name)}" title="Delete">
              🗑️
            </button>
          `
              : ""
          }
        </div>
      </td>
    </tr>
  `;
}

function setupActionButtons(canManage: boolean): void {
  // View Songs buttons (available to all)
  const viewSongsButtons = document.querySelectorAll(".view-songs");
  viewSongsButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const artistId = parseInt(btn.getAttribute("data-id") || "0");
      const artistName = btn.getAttribute("data-name") || "";

      if (artistId) {
        await renderSongsPage(artistId, artistName);
      }
    });
  });

  if (canManage) {
    // Edit buttons
    const editButtons = document.querySelectorAll(".edit-artist");
    editButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const artistData = btn.getAttribute("data-artist");
        if (artistData) {
          const artist = JSON.parse(artistData) as Artist;
          openArtistModal("edit", artist, async () => {
            await loadArtists();
          });
        }
      });
    });

    // Delete buttons
    const deleteButtons = document.querySelectorAll(".delete-artist");
    deleteButtons.forEach((btn) => {
      btn.addEventListener("click", async () => {
        const id = btn.getAttribute("data-id");
        const name = btn.getAttribute("data-name");

        if (id) {
          const confirmed = await showConfirmModal({
            title: "Delete Artist",
            message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
            confirmText: "Delete",
            cancelText: "Cancel",
            isDangerous: true,
          });

          if (confirmed) {
            try {
              await artistService.delete(parseInt(id));
              showToast("Artist deleted successfully", "success");
              await loadArtists();
            } catch (error) {
              showToast((error as Error).message, "error");
            }
          }
        }
      });
    });
  }
}

function setupPagination(): void {
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  prevBtn?.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      await loadArtists();
      document.querySelector(".card")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  nextBtn?.addEventListener("click", async () => {
    currentPage++;
    await loadArtists();
    document.querySelector(".card")?.scrollIntoView({ behavior: "smooth" });
  });
}

function formatGender(gender: string): string {
  return gender.charAt(0).toUpperCase() + gender.slice(1);
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function escapeHtml(str: string): string {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
