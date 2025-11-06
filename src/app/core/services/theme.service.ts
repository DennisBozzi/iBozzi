import { Theme } from '@/shared/types/theme.type';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { StorageService } from './storage.service';
import { UserPreferencesService } from './user-preferences.service';
import { FirebaseService } from './firebase.service';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_STORAGE_KEY = 'theme';
    private readonly DEFAULT_THEME: Theme = 'Default';
    private readonly storageService = inject(StorageService);
    private readonly userPreferencesService = inject(UserPreferencesService);
    private readonly firebaseService = inject(FirebaseService);

    private readonly themeSubject = new BehaviorSubject<Theme>(this.DEFAULT_THEME);
    public theme$ = this.themeSubject.asObservable();

    private loadTheme(): Theme {
        const stored = this.storageService.get(this.THEME_STORAGE_KEY);
        return (stored as Theme) || this.DEFAULT_THEME;
    }

    private applyTheme(theme: Theme): void {
        const htmlElement = document.documentElement;
        const themeName = theme.toLowerCase();
        htmlElement.setAttribute('data-theme', themeName);
    }

    public async loadAndApplyTheme(): Promise<void> {
        try {
            const user = this.firebaseService.getCurrentUser();
            
            if (user) {
                const firebaseTheme = await this.userPreferencesService.getTheme();
                if (firebaseTheme) {
                    this.storageService.set(this.THEME_STORAGE_KEY, firebaseTheme);
                    this.themeSubject.next(firebaseTheme);
                    this.applyTheme(firebaseTheme);
                    return;
                }
            }

            const theme = this.loadTheme();
            this.themeSubject.next(theme);
            this.applyTheme(theme);
        } catch (error) {
            console.error('Erro ao carregar tema:', error);
            const theme = this.loadTheme();
            this.themeSubject.next(theme);
            this.applyTheme(theme);
        }
    }

    async setTheme(theme: Theme): Promise<void> {
        this.storageService.set(this.THEME_STORAGE_KEY, theme);
        this.themeSubject.next(theme);
        this.applyTheme(theme);

        // Salvar no Firebase se estiver autenticado
        const user = this.firebaseService.getCurrentUser();
        if (user) {
            await this.userPreferencesService.saveTheme(theme);
        }
    }
}
