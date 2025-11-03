import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

type ThemeValue = 'default' | 'retro' | 'cyberpunk' | 'valentine' | 'aqua' | 'forest';

@Injectable({
    providedIn: 'root'
})
export class ThemeService {
    private readonly THEME_STORAGE_KEY = 'theme';
    private readonly DEFAULT_THEME: ThemeValue = 'default';
    
    private readonly themeSubject = new BehaviorSubject<ThemeValue>(this.loadTheme());
    public theme$ = this.themeSubject.asObservable();

    constructor() {
        this.applyTheme(this.themeSubject.value);
    }

    private loadTheme(): ThemeValue {
        const stored = localStorage.getItem(this.THEME_STORAGE_KEY);
        return (stored as ThemeValue) || this.DEFAULT_THEME;
    }

    private applyTheme(theme: ThemeValue): void {
        const htmlElement = document.documentElement;
        htmlElement.setAttribute('data-theme', theme);
    }

    setTheme(theme: ThemeValue): void {
        localStorage.setItem(this.THEME_STORAGE_KEY, theme);
        this.themeSubject.next(theme);
        this.applyTheme(theme);
    }

    getCurrentTheme(): ThemeValue {
        return this.themeSubject.value;
    }
}
