import { Pipe, PipeTransform } from '@angular/core';
import { TranslationService } from '@/core/services/translation.service';

@Pipe({ name: 't', standalone: true, pure: false })
export class TranslatePipe implements PipeTransform {
  constructor(private readonly i18n: TranslationService) {}

  transform(key: string, params?: Record<string, any>): string {
    if (!key) return '';
    return this.i18n.translate(key, params);
  }
}
