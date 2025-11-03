import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '@/core/services';

type ThemeValue = 'default' | 'retro' | 'cyberpunk' | 'valentine' | 'aqua' | 'forest';

@Component({
    selector: 'app-theme-switcher',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './theme-switcher.component.html'
})
export class ThemeSwitcherComponent {
    private readonly themeService = inject(ThemeService);

    currentTheme$ = this.themeService.theme$;

    setTheme(theme: ThemeValue, event: Event): void {
        this.themeService.setTheme(theme);
        (event.target as HTMLElement)?.blur();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }
}
