import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, map } from 'rxjs';
import { GlobalMessages } from '@/shared/i18n/global-messages';

type LangCode = 'en' | 'pt';
type Dictionary = Record<string, any>;

@Injectable({ providedIn: 'root' })
export class TranslationService {
  private readonly http = inject(HttpClient);

  private currentLang$ = new BehaviorSubject<LangCode>(this.getInitialLang());
  private dictionaries = new Map<LangCode, Dictionary>();

  constructor() {
    this.ensureDictionaryLoaded(this.currentLang$.value);
    GlobalMessages.i18n = this;
  }

  get lang$(): Observable<LangCode> {
    return this.currentLang$.asObservable();
  }

  get currentLang(): LangCode {
    return this.currentLang$.value;
  }

  setLanguage(lang: LangCode) {
    if (this.currentLang$.value === lang) return;
    this.ensureDictionaryLoaded(lang).then(() => {
      localStorage.setItem('lang', lang);
      this.currentLang$.next(lang);
    });
  }

  translate(key: string, params?: Record<string, any>): string {
    const dict = this.dictionaries.get(this.currentLang$.value);
    if (!dict) return key;
    const raw = this.resolveKey(dict, key) ?? key;
    return this.interpolate(String(raw), params);
  }

  select(key: string, params?: Record<string, any>): Observable<string> {
    return this.lang$.pipe(map(() => this.translate(key, params)));
  }

  private async ensureDictionaryLoaded(lang: LangCode): Promise<void> {
    if (this.dictionaries.has(lang)) return;
    const url = `i18n/${lang}.json`;
    const data = await this.http.get<Dictionary>(url).toPromise();
    this.dictionaries.set(lang, data ?? {});
  }

  private resolveKey(obj: Dictionary, path: string): unknown {
    return path.split('.').reduce<unknown>((acc, part) => {
      if (acc && typeof acc === 'object' && part in (acc as any)) {
        return (acc as any)[part];
      }
      return undefined;
    }, obj);
  }

  private interpolate(template: string, params?: Record<string, any>): string {
    if (!params) return template;
    return template.replace(/{{\s*(\w+)\s*}}/g, (_m, p1) => {
      const v = params[p1];
      return v == null ? '' : String(v);
    });
  }

  private getInitialLang(): LangCode {
    const saved = (localStorage.getItem('lang') as LangCode | null);
    if (saved === 'pt' || saved === 'en') return saved;
    const browser = navigator.language?.toLowerCase() ?? '';
    return browser.startsWith('pt') ? 'pt' : 'en';
  }
}
