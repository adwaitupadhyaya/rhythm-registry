import { songService } from "@/services/song.service";
import { authService } from "@/services/auth.service";
import { showConfirmModal } from "@/components/confirm-modal";
import { showToast } from "@/utils/toast";
import { openSongModal } from "@/components/song.modal";
import type { Song } from "@/types";

let currentPage = 1;
const limit = 10;
let currentArtistId: number;
let currentArtistName: string;

export async function renderSongsPage(
  artistId: number,
  artistName: string,
): Promise<void> {
  const app = document.getElementById("app");
  if (!app) return;

  currentArtistId = artistId;
  currentArtistName = artistName;
  currentPage = 1;

  const currentUser = authService.getCurrentUser();
  const canManage = currentUser?.role === "artist";

  // FIXED: Clean header layout with artist name below
  app.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="dashboard-header__brand">Rhythm Registry</div>
        <div class="dashboard-header__user">
          <span class="dashboard-header__name">
            ${currentUser!.name}
          </span>
          <span class="badge badge--primary">${formatRole(currentUser!.role)}</span>
          <button id="logout-btn" class="btn btn--ghost btn--sm">Logout</button>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="container">
          <!-- Artist Name and Songs Title Below Header -->
          <div style="margin-bottom: 2rem;">
            <h1 style="font-size: 1.875rem; font-weight: 700; color: var(--color-primary); margin-bottom: 0.25rem;">
              ${escapeHtml(artistName)}
            </h1>
            <p style="color: var(--color-text-secondary); font-size: 1rem;">
              Songs
            </p>
          </div>

          <div class="card">
            <div class="card__header">
              <h2 class="card__title">All Songs</h2>
              ${
                canManage
                  ? `
                <button id="create-song-btn" class="btn btn--primary btn--sm">
                  + Add Song
                </button>
              `
                  : ""
              }
            </div>

            <div id="songs-table-container">
              <div class="loading">
                <div class="spinner"></div>
                <p>Loading songs...</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  `;

  // Setup back button
  const backBtn = document.getElementById("back-to-artists");
  backBtn?.addEventListener("click", () => {
    // If artist role, logout (they can't see artists tab)
    if (currentUser?.role === "artist") {
      authService.logout();
    } else {
      // For other roles, go back to dashboard
      import("@/pages/dashboard").then((module) => {
        module.renderDashboard();
      });
    }
  });

  // Setup logout
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    authService.logout();
  });

  // Load songs
  await loadSongs();

  // Setup create button
  if (canManage) {
    const createBtn = document.getElementById("create-song-btn");
    createBtn?.addEventListener("click", () => {
      openSongModal(
        "create",
        currentArtistId,
        currentArtistName,
        null,
        async () => {
          await loadSongs();
        },
      );
    });
  }
}

async function loadSongs(): Promise<void> {
  const container = document.getElementById("songs-table-container");
  if (!container) return;

  const currentUser = authService.getCurrentUser();
  const canManage = currentUser?.role === "artist";

  try {
    const offset = (currentPage - 1) * limit;
    const songs = await songService.getAll(currentArtistId, { limit, offset });

    if (songs.length === 0 && currentPage === 1) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🎵</div>
          <h3 class="empty-state__title">No songs yet</h3>
          <p>${canManage ? "Add your first song to get started." : "This artist has not added any songs yet."}</p>
        </div>
      `;
      return;
    }

    if (songs.length === 0 && currentPage > 1) {
      currentPage--;
      await loadSongs();
      return;
    }

    container.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Album</th>
              <th>Genre</th>
              <th>Release Date</th>
              <th>Added</th>
              ${canManage ? "<th>Actions</th>" : ""}
            </tr>
          </thead>
          <tbody>
            ${songs.map((song) => renderSongRow(song, canManage)).join("")}
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination__info">
          Showing ${offset + 1}-${offset + songs.length}
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
            ${songs.length < limit ? "disabled" : ""}
          >
            Next
          </button>
        </div>
      </div>
    `;

    if (canManage) {
      setupActionButtons();
    }
    setupPagination();
  } catch (error) {
    showToast((error as Error).message, "error");
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <h3 class="empty-state__title">Failed to load songs</h3>
        <p>${(error as Error).message}</p>
      </div>
    `;
  }
}

function renderSongRow(song: Song, canManage: boolean): string {
  return `
    <tr>
      <td><strong>${escapeHtml(song.title)}</strong></td>
      <td>${escapeHtml(song.album_name)}</td>
      <td>
        <span class="badge badge--secondary">
          ${formatGenre(song.genre)}
        </span>
      </td>
      <td>${formatDate(song.release_date)}</td>
      <td>${formatDate(song.created_at)}</td>
      ${
        canManage
          ? `
        <td>
          <div class="action-buttons">
            <button class="btn btn--ghost btn--sm edit-song" data-song='${JSON.stringify(song)}' title="Edit">
              ✏️
            </button>
            <button class="btn btn--ghost btn--sm delete-song" data-id="${song.id}" data-title="${escapeHtml(song.title)}" title="Delete">
              🗑️
            </button>
          </div>
        </td>
      `
          : ""
      }
    </tr>
  `;
}

function setupActionButtons(): void {
  // Edit buttons
  const editButtons = document.querySelectorAll(".edit-song");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const songData = btn.getAttribute("data-song");
      if (songData) {
        const song = JSON.parse(songData) as Song;
        openSongModal(
          "edit",
          currentArtistId,
          currentArtistName,
          song,
          async () => {
            await loadSongs();
          },
        );
      }
    });
  });

  // Delete buttons
  const deleteButtons = document.querySelectorAll(".delete-song");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const title = btn.getAttribute("data-title");

      if (id) {
        const confirmed = await showConfirmModal({
          title: "Delete Song",
          message: `Are you sure you want to delete "${title}"? This action cannot be undone.`,
          confirmText: "Delete",
          cancelText: "Cancel",
          isDangerous: true,
        });

        if (confirmed) {
          try {
            await songService.delete(currentArtistId, parseInt(id));
            showToast("Song deleted successfully", "success");
            await loadSongs();
          } catch (error) {
            showToast((error as Error).message, "error");
          }
        }
      }
    });
  });
}

function setupPagination(): void {
  const prevBtn = document.getElementById("prev-page");
  const nextBtn = document.getElementById("next-page");

  prevBtn?.addEventListener("click", async () => {
    if (currentPage > 1) {
      currentPage--;
      await loadSongs();
      document.querySelector(".card")?.scrollIntoView({ behavior: "smooth" });
    }
  });

  nextBtn?.addEventListener("click", async () => {
    currentPage++;
    await loadSongs();
    document.querySelector(".card")?.scrollIntoView({ behavior: "smooth" });
  });
}

function formatGenre(genre: string): string {
  const genreMap: Record<string, string> = {
    rnb: "R&B",
    country: "Country",
    classic: "Classic",
    rock: "Rock",
    jazz: "Jazz",
  };
  return genreMap[genre] || genre;
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
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
