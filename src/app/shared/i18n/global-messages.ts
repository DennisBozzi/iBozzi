import type { TranslationService } from '@/core/services/translation.service';

// Uso opcional: GlobalMessages.t('auth.signup.title')
export class GlobalMessages {
  static i18n: TranslationService | undefined;

  static t(key: string, params?: Record<string, any>): string {
    return this.i18n ? this.i18n.translate(key, params) : key;
  }
}
