import { userService } from "@/services/user.service";
import { showConfirmModal } from "./confirm-modal";
import { showToast } from "@/utils/toast";
import { openUserModal } from "./user-modal";
import type { User, GetUsersResponse } from "@/types";

let currentPage = 1;
const limit = 10;

export async function renderUsersTab(): Promise<void> {
  const content = document.getElementById("tab-content");
  if (!content) return;

  content.innerHTML = `
    <div class="card">
      <div class="card__header">
        <h2 class="card__title">Users</h2>
        <button id="create-user-btn" class="btn btn--primary btn--sm">+ Create User</button>
      </div>

      <div id="users-table-container">
        <div class="loading">
          <div class="spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    </div>
  `;

  // Load users
  await loadUsers();

  // Setup create button
  const createBtn = document.getElementById("create-user-btn");
  createBtn?.addEventListener("click", () => {
    openUserModal("create", null, async () => {
      await loadUsers();
    });
  });
}

async function loadUsers(): Promise<void> {
  const container = document.getElementById("users-table-container");
  if (!container) return;

  try {
    const offset = (currentPage - 1) * limit;
    const response = await userService.getAll({ limit, offset });
    const users: User[] = Array.isArray(response)
      ? response
      : (response as GetUsersResponse).users || [];

    if (users.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">👥</div>
          <h3 class="empty-state__title">No users found</h3>
          <p>Get started by creating your first user.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = `
      <div class="table-container">
        <table class="table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${users.map((user) => renderUserRow(user)).join("")}
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <div class="pagination__info">
          Showing ${offset + 1}-${offset + users.length}
        </div>
        <div class="pagination__controls">
          <button class="btn btn--secondary btn--sm" id="prev-page" ${currentPage === 1 ? "disabled" : ""}>
            Previous
          </button>
          <span style="padding: 0 1rem;">Page ${currentPage}</span>
          <button class="btn btn--secondary btn--sm" id="next-page" ${users.length < limit ? "disabled" : ""}>
            Next
          </button>
        </div>
      </div>
    `;

    setupActionButtons();
    setupPagination();
  } catch (error) {
    showToast((error as Error).message, "error");
    container.innerHTML = `<div class="empty-state">... error UI ...</div>`;
  }
}

function renderUserRow(user: User): string {
  return `
    <tr>
      <td>${user.id}</td>
      <td><strong>${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}</strong></td>
      <td>${escapeHtml(user.email)}</td>
      <td>
        <span class="badge badge--primary">
          ${formatRole(user.role)}
        </span>
      </td>
      <td>
        <span class="badge ${user.is_active ? "badge--success" : "badge--secondary"}">
          ${user.is_active ? "Active" : "Inactive"}
        </span>
      </td>
      <td>${formatDate(user.created_at)}</td>
      <td>
        <div class="action-buttons">
          <button class="btn btn--ghost btn--sm edit-user" data-user='${JSON.stringify(user)}' title="Edit">
            ✏️
          </button>
          <button class="btn btn--ghost btn--sm delete-user" data-id="${user.id}" data-name="${escapeHtml(user.first_name)} ${escapeHtml(user.last_name)}" title="Delete">
            🗑️
          </button>
        </div>
      </td>
    </tr>
  `;
}

function setupActionButtons(): void {
  // Edit buttons
  const editButtons = document.querySelectorAll(".edit-user");
  editButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const userData = btn.getAttribute("data-user");
      if (userData) {
        const user = JSON.parse(userData) as User;
        openUserModal("edit", user, async () => {
          await loadUsers();
        });
      }
    });
  });

  // Delete buttons
  const deleteButtons = document.querySelectorAll(".delete-user");
  deleteButtons.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const id = btn.getAttribute("data-id");
      const name = btn.getAttribute("data-name");

      if (id) {
        const confirmed = await showConfirmModal({
          title: "Delete User",
          message: `Are you sure you want to delete ${name}? This action cannot be undone.`,
          confirmText: "Delete",
          cancelText: "Cancel",
          isDangerous: true,
        });

        if (confirmed) {
          try {
            await userService.delete(parseInt(id));
            showToast("User deleted successfully", "success");
            await loadUsers();
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
      await loadUsers();
    }
  });

  nextBtn?.addEventListener("click", async () => {
    currentPage++;
    await loadUsers();
  });
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
