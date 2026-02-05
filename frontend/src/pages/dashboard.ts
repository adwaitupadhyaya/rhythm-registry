import { authService } from "@/services/auth.service";
import { renderUsersTab } from "@/components/users-tab";

export async function renderDashboard(): Promise<void> {
  const app = document.getElementById("app");
  if (!app) return;

  const user = authService.getCurrentUser();
  console.log(user);
  if (!user) {
    window.location.href = "/";
    return;
  }

  app.innerHTML = `
    <div class="dashboard">
      <header class="dashboard-header">
        <div class="dashboard-header__brand">Rhythm Registry</div>
        <div class="dashboard-header__user">
          <span class="dashboard-header__name">
            ${user.name} 
          </span>
          <span class="badge badge--primary">${formatRole(user.role)}</span>
          <button id="logout-btn" class="btn btn--ghost btn--sm">Logout</button>
        </div>
      </header>

      <main class="dashboard-main">
        <div class="container">
          ${renderTabs(user.role)}
          <div id="tab-content"></div>
        </div>
      </main>
    </div>
  `;

  // Setup logout
  const logoutBtn = document.getElementById("logout-btn");
  logoutBtn?.addEventListener("click", () => {
    authService.logout();
  });

  // Setup tabs
  setupTabs(user.role);

  // Load initial tab
  if (user.role === "super_admin") {
    await renderUsersTab();
  }
}

function renderTabs(role: string): string {
  const tabs: Array<{ id: string; label: string; roles: string[] }> = [
    { id: "users", label: "Users", roles: ["super_admin"] },
    {
      id: "artists",
      label: "Artists",
      roles: ["super_admin", "artist_manager"],
    },
  ];

  const availableTabs = tabs.filter((tab) => tab.roles.includes(role));

  if (availableTabs.length === 0) return "";

  return `
    <div class="tabs">
      <div class="tabs__list">
        ${availableTabs
          .map(
            (tab, index) => `
          <button 
            class="tabs__tab ${index === 0 ? "tabs__tab--active" : ""}" 
            data-tab="${tab.id}"
          >
            ${tab.label}
          </button>
        `,
          )
          .join("")}
      </div>
    </div>
  `;
}

function setupTabs(role: string): void {
  const tabButtons = document.querySelectorAll(".tabs__tab");

  tabButtons.forEach((button) => {
    button.addEventListener("click", async () => {
      const tabId = button.getAttribute("data-tab");

      // Update active state
      tabButtons.forEach((btn) => btn.classList.remove("tabs__tab--active"));
      button.classList.add("tabs__tab--active");

      // Render tab content
      if (tabId === "users") {
        await renderUsersTab();
      } else if (tabId === "artists") {
        const content = document.getElementById("tab-content");
        if (content) {
          content.innerHTML = `
            <div class="empty-state">
              <div class="empty-state__icon">🎵</div>
              <h3 class="empty-state__title">Artists Coming Soon</h3>
              <p>Artist management will be available in the next update.</p>
            </div>
          `;
        }
      }
    });
  });
}

function formatRole(role: string): string {
  return role
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
