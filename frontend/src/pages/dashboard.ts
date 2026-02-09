import { authService } from "@/services/auth.service";
import {
  renderDashboardHeader,
  setupDashboardHeader,
} from "@/components/dashboard-header";
import { renderUsersTab } from "@/components/users-tab";
import { renderArtistsTab } from "@/components/artist-tab";
import { renderSongsPage } from "@/pages/songs";

export async function renderDashboard(): Promise<void> {
  const app = document.getElementById("app");
  if (!app) return;

  const user = authService.getCurrentUser();
  if (!user) {
    window.location.href = "/";
    return;
  }

  if (user.role === "artist") {
    try {
      const response = await fetch("/api/artists/me", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        const artist = await response.json();
        if (artist && artist.id) {
          await renderSongsPage(artist.id, artist.name);
          return;
        }
      }

      app.innerHTML = `
        <div class="dashboard">
          ${renderDashboardHeader({
            userName: user.name,
            userRole: user.role,
            onLogout: () => authService.logout(),
          })}
          <main class="dashboard-main">
            <div class="container">
              <div class="empty-state">
                <div class="empty-state__icon">⚠️</div>
                <h3 class="empty-state__title">No Artist Profile</h3>
                <p>Your account is not linked to an artist profile. Please contact an administrator.</p>
              </div>
            </div>
          </main>
        </div>
      `;

      setupDashboardHeader(() => authService.logout());
      return;
    } catch (error) {
      app.innerHTML = `
        <div class="dashboard">
          ${renderDashboardHeader({
            userName: user.name,
            userRole: user.role,
            onLogout: () => authService.logout(),
          })}
          <main class="dashboard-main">
            <div class="container">
              <div class="empty-state">
                <div class="empty-state__icon">⚠️</div>
                <h3 class="empty-state__title">Error Loading Artist Profile</h3>
                <p>${(error as Error).message}</p>
              </div>
            </div>
          </main>
        </div>
      `;

      setupDashboardHeader(() => authService.logout());
      return;
    }
  }

  app.innerHTML = `
    <div class="dashboard">
      ${renderDashboardHeader({
        userName: user.name,
        userRole: user.role,
        onLogout: () => authService.logout(),
      })}
      <main class="dashboard-main">
        <div class="container">
          ${renderTabs(user.role)}
          <div id="tab-content"></div>
        </div>
      </main>
    </div>
  `;

  setupDashboardHeader(() => authService.logout());
  setupTabs(user.role);

  const firstTab = getAvailableTabs(user.role)[0];
  if (firstTab) {
    await loadTab(firstTab.id);
  }
}

function getAvailableTabs(role: string): Array<{ id: string; label: string }> {
  const tabs: Array<{ id: string; label: string; roles: string[] }> = [
    { id: "users", label: "Users", roles: ["super_admin"] },
    {
      id: "artists",
      label: "Artists",
      roles: ["super_admin", "artist_manager"],
    },
  ];

  return tabs
    .filter((tab) => tab.roles.includes(role))
    .map(({ id, label }) => ({ id, label }));
}

function renderTabs(role: string): string {
  const availableTabs = getAvailableTabs(role);

  if (availableTabs.length === 0) {
    return `
      <div class="empty-state">
        <div class="empty-state__icon">🔒</div>
        <h3 class="empty-state__title">No Access</h3>
        <p>You don't have access to any sections.</p>
      </div>
    `;
  }

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
      tabButtons.forEach((btn) => btn.classList.remove("tabs__tab--active"));
      button.classList.add("tabs__tab--active");

      if (tabId) {
        await loadTab(tabId);
      }
    });
  });
}

async function loadTab(tabId: string): Promise<void> {
  const content = document.getElementById("tab-content");
  if (!content) return;

  content.innerHTML = `
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>
  `;

  try {
    if (tabId === "users") {
      await renderUsersTab();
    } else if (tabId === "artists") {
      await renderArtistsTab();
    } else {
      content.innerHTML = `
        <div class="empty-state">
          <div class="empty-state__icon">🚧</div>
          <h3 class="empty-state__title">Coming Soon</h3>
          <p>This feature is under development.</p>
        </div>
      `;
    }
  } catch (error) {
    content.innerHTML = `
      <div class="empty-state">
        <div class="empty-state__icon">⚠️</div>
        <h3 class="empty-state__title">Error Loading Content</h3>
        <p>${(error as Error).message}</p>
      </div>
    `;
  }
}
