import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslationService } from '@/core/services';

type LangCode = 'en' | 'pt';

@Component({
    selector: 'app-language-switcher',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './language-switcher.component.html'
})
export class LanguageSwitcherComponent {
    private readonly i18n = inject(TranslationService);

    languages: Array<{ code: LangCode; label: string; countryCode: string, countryFlag: string }> = [
        { code: 'en', label: 'English', labelShort: 'EN', countryCode: 'US', countryFlag: '/flags/us.svg' } as any,
        { code: 'pt', label: 'Português', labelShort: 'PT', countryCode: 'BR', countryFlag: '/flags/br.svg' } as any,
    ] as any;

    currentLang$ = this.i18n.lang$;

    setLanguage(lang: LangCode, event: Event) {
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
}
