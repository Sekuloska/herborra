import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

const SUPPORTED = ['mk', 'sq'] as const;
type Lang = typeof SUPPORTED[number];

@Injectable({ providedIn: 'root' })
export class I18nService {
  private readonly storageKey = 'lang';

  constructor(private translate: TranslateService) {
    translate.addLangs([...SUPPORTED]);
    translate.setDefaultLang('mk');
  }

  init(defaultLang: Lang = 'mk') {
    const stored = localStorage.getItem(this.storageKey) as Lang | null;
    const lang = stored && SUPPORTED.includes(stored) ? stored : defaultLang;
    this.use(lang);
  }

  use(lang: Lang) {
    localStorage.setItem(this.storageKey, lang);
    this.translate.use(lang);
  }

  current(): Lang {
    return (this.translate.currentLang as Lang) || 'mk';
  }

  isSupported(lang: string): lang is Lang {
    return SUPPORTED.includes(lang as Lang);
  }
}
