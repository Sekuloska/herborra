import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, inject, PLATFORM_ID } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { map, startWith } from 'rxjs';

type Lang = 'mk' | 'al';

@Component({
  selector: 'app-services-section',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './services-section.html',
  styleUrl: './services-section.scss',
})
export class ServicesSection {
  private readonly translate = inject(TranslateService);
  private readonly platformId = inject(PLATFORM_ID);

  private readonly kidneyImageByLang: Record<Lang, string> = {
    mk: 'assets/services/bubrezi-mk.png',
    al: 'assets/services/bubrezi-al.png'
  };

  private readonly diabetesImageByLang: Record<Lang, string> = {
    mk: 'assets/services/dijabet-mk.png',
    al: 'assets/services/dijabet-al.png'
  };

  
  private getInitialLang(): string {
    if (isPlatformBrowser(this.platformId)) {
      return localStorage.getItem('lang') || this.translate.currentLang || this.translate.getBrowserLang() || 'mk';
    }
    return this.translate.currentLang || 'mk';
  }

  readonly lang$ = this.translate.onLangChange.pipe(
    map((event) => this.normalizeLang(event.lang)),
    startWith(this.normalizeLang(this.getInitialLang()))
  );

  readonly kidneyImageSrc$ = this.lang$.pipe(
    map((lang) => this.kidneyImageByLang[lang])
  );

  readonly diabetesImageSrc$ = this.lang$.pipe(
    map((lang) => this.diabetesImageByLang[lang])
  );

  private normalizeLang(lang: string): Lang {
    const lower = lang.toLowerCase();
    if (lower.startsWith('al') || lower.startsWith('sq')) return 'al';
    return 'mk';
  }
}
