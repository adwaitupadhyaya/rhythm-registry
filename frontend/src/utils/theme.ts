export function initTheme(): void {
  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);
}

export function toggleTheme(): void {
  const currentTheme = localStorage.getItem("theme") || "light";
  const newTheme = currentTheme === "light" ? "dark" : "light";
  localStorage.setItem("theme", newTheme);
  applyTheme(newTheme);
}

export function getCurrentTheme(): string {
  return localStorage.getItem("theme") || "light";
}

function applyTheme(theme: string): void {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
  } else {
    document.documentElement.removeAttribute("data-theme");
  }
}
