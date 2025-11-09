import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@/core/services/translation.service';

@Pipe({
  name: 'currencyFormat',
  standalone: true,
  pure: false
})
export class CurrencyFormatPipe implements PipeTransform {
  constructor(private readonly i18n: TranslationService) {}

  transform(value: number | null | undefined): string {
    if (value === null || value === undefined) return '';

    const lang = this.i18n.currentLang;
    const locale = lang === 'pt' ? 'pt-BR' : 'en-US';

    return new Intl.NumberFormat(locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  }
}
