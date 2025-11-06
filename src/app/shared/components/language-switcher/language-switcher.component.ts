import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '@/core/services';
import { StorageService } from '@/core/services/storage.service';
import { TranslatePipe } from "../../pipes/t.pipe";

type LangCode = 'en' | 'pt';

@Component({
    selector: 'app-language-switcher',
    standalone: true,
    imports: [CommonModule, FormsModule, TranslatePipe],
    templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {
    private readonly i18n = inject(TranslationService);
    private readonly StorageService = inject(StorageService);
    @Input() select: boolean = false;

    selectedLang: LangCode = (this.StorageService.get('lang') as LangCode) || 'en';

    languages: Array<{ code: LangCode; label: string; countryCode: string, countryFlag: string }> = [
        { code: 'en', label: 'English', labelShort: 'EN', countryCode: 'US', countryFlag: '/flags/us.svg' } as any,
        { code: 'pt', label: 'Português', labelShort: 'PT', countryCode: 'BR', countryFlag: '/flags/br.svg' } as any,
    ] as any;

    currentLang$ = this.i18n.lang$;

    setLanguage(lang: LangCode, event: Event) {
        this.selectedLang = lang;
        this.i18n.setLanguage(lang);
        (event.target as HTMLElement)?.blur();
        if (document.activeElement instanceof HTMLElement) {
            document.activeElement.blur();
        }
    }

    getCountryCode(code: LangCode): string {
        return this.languages.find(l => l.code === code)?.countryCode ?? 'GL';
    }

    getCountryFlag(code: LangCode): string {
        return this.languages.find(l => l.code === code)?.countryFlag ?? '/flags/us.svg';
    }

    getShort(code: LangCode): string {
        return (this.languages.find(l => l.code === code) as any)?.labelShort ?? code.toUpperCase();
    }

    onSelectChange(event: Event): void {
        const value = (event.target as HTMLSelectElement).value as LangCode;
        this.setLanguage(value, event);
    }
}
