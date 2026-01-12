import { Component, DestroyRef } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Lang = 'mk' | 'al';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [ButtonModule, RouterLink, TranslateModule],
  templateUrl: './hero-section.html',
  styleUrl: './hero-section.scss',
})
export class HeroSection {
  private readonly heroImageByLang: Record<Lang, string> = {
    mk: 'assets/hero-section-macedonian.png',
    al: 'assets/hero-image-albanian.png'
  };

  currentLang: Lang = 'mk';

  private readonly emailAddress = 'info@herborra.mk';
  private readonly subject = encodeURIComponent('Consultation request');
  private readonly body = encodeURIComponent(
    `Hello,

I would like more information about Herborra products and services.

Thank you,
`
  );
  public readonly mailtoLink = `mailto:${this.emailAddress}?subject=${this.subject}&body=${this.body}`;

  constructor(
    private translate: TranslateService,
    private destroyRef: DestroyRef
  ) {
    this.currentLang = this.normalizeLang(this.translate.currentLang || this.translate.getBrowserLang());

    this.translate.onLangChange
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((event) => {
        this.currentLang = this.normalizeLang(event.lang);
      });
  }

  get heroImageSrc(): string {
    return this.heroImageByLang[this.currentLang];
  }

  private normalizeLang(lang?: string | null): Lang {
    if (!lang) return 'mk';
    const lower = lang.toLowerCase();
    if (lower.startsWith('al') || lower.startsWith('sq')) return 'al';
    return 'mk';
  }
}
