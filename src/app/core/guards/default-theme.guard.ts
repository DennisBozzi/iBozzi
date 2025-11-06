import { Injectable, inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { ThemeService } from '@/core/services/theme.service';

@Injectable({ providedIn: 'root' })
export class DefaultThemeService {
  private readonly themeService = inject(ThemeService);

  applyDefaultTheme(): void {
    this.themeService.setTheme('Default');
  }
}

export const defaultThemeGuard: CanActivateFn = (route, state) => {
  const themeService = inject(ThemeService);
  themeService.setTheme('Default');
  return true;
};
