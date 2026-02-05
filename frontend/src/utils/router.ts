import type { Route } from '@/types';
import { authService } from '@/services/auth.service';

class Router {
  private routes: Route[] = [];
  private currentRoute: string = '';

  constructor(routes: Route[]) {
    this.routes = routes;
    this.init();
  }

  private init(): void {
    window.addEventListener('popstate', () => {
      this.navigate(window.location.pathname, false);
    });

    document.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const link = target.closest('a[data-link]');
      
      if (link) {
        e.preventDefault();
        const href = link.getAttribute('href');
        if (href) {
          this.navigate(href);
        }
      }
    });

    this.navigate(window.location.pathname, false);
  }

  async navigate(path: string, pushState: boolean = true): Promise<void> {
    const route = this.findRoute(path);

    if (!route) {
      this.navigate('/');
      return;
    }

    const isAuthenticated = authService.isAuthenticated();

    if (route.requiresAuth && !isAuthenticated) {
      this.navigate('/');
      return;
    }

    if (route.redirectIfAuth && isAuthenticated) {
      this.navigate(route.redirectIfAuth);
      return;
    }

    if (route.allowedRoles) {
      const user = authService.getCurrentUser();
      if (!user || !route.allowedRoles.includes(user.role)) {
        this.navigate('/dashboard');
        return;
      }
    }

    if (pushState && window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }

    this.currentRoute = path;
    await route.component();
  }

  private findRoute(path: string): Route | undefined {
    return this.routes.find(r => r.path === path) || this.routes.find(r => r.path === '/');
  }
}

export default Router;
