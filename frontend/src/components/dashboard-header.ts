export interface DashboardHeaderOptions {
  brand?: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

import { toggleTheme } from "@/utils/theme";

export function renderDashboardHeader(options: DashboardHeaderOptions): string {
  const brand = options.brand || "Rhythm Registry";
  const isDarkMode =
    document.documentElement.getAttribute("data-theme") === "dark";
  const themeIcon = isDarkMode ? "☀️" : "🌙";

  return `
    <header class="dashboard-header">
      <div class="dashboard-header__brand">${brand}</div>
      <div class="dashboard-header__user">
        <button id="theme-toggle" class="btn btn--icon btn--sm" title="Toggle theme">
          ${themeIcon}
        </button>
        <span class="dashboard-header__name">${options.userName}</span>
        <span class="badge badge--primary">${formatRole(options.userRole)}</span>
        <button id="logout-btn" class="btn btn--ghost btn--sm">Logout</button>
      </div>
    </header>
  `;
}

export function setupDashboardHeader(onLogout: () => void): void {
  const logoutBtn = document.getElementById("logout-btn");
  const themeToggle = document.getElementById("theme-toggle");

  logoutBtn?.addEventListener("click", onLogout);

  themeToggle?.addEventListener("click", () => {
    toggleTheme();
    // Update the icon
    const isDarkMode =
      document.documentElement.getAttribute("data-theme") === "dark";
    themeToggle.textContent = isDarkMode ? "☀️" : "🌙";
  });
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
