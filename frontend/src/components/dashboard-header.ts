export interface DashboardHeaderOptions {
  brand?: string;
  userName: string;
  userRole: string;
  onLogout: () => void;
}

export function renderDashboardHeader(options: DashboardHeaderOptions): string {
  const brand = options.brand || "Rhythm Registry";
  return `
    <header class="dashboard-header">
      <div class="dashboard-header__brand">${brand}</div>
      <div class="dashboard-header__user">
        <span class="dashboard-header__name">${options.userName}</span>
        <span class="badge badge--primary">${formatRole(options.userRole)}</span>
        <button id="logout-btn" class="btn btn--ghost btn--sm">Logout</button>
      </div>
    </header>
  `;
}

export function setupDashboardHeader(onLogout: () => void): void {
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", onLogout);
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
