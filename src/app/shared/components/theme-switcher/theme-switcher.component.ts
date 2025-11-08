import { Component, inject, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ThemeService } from '@/core/services';
import { Theme } from '@/shared/types/theme.type';
import { StorageService } from '@/core/services/storage.service';
import { TranslatePipe } from "../../pipes/t.pipe";

@Component({
    selector: 'app-theme-switcher',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './theme-switcher.component.html'
})
export class ThemeSwitcherComponent {
    @Input() select: boolean = false;

    private readonly themeService = inject(ThemeService);
    private readonly storageService = inject(StorageService);

    currentTheme$ = this.themeService.theme$;

    selectedTheme: Theme = (this.storageService.get('theme') as Theme) || 'Default';

    themes: Theme[] = ['Default', 'Retro', 'Cyberpunk', 'Valentine', 'Luxury', 'Forest'];

    async setTheme(theme: Theme) {
        this.selectedTheme = theme;
        await this.themeService.setTheme(theme);
    }

    onSelectChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value as Theme;
        this.setTheme(value);
    }
}
