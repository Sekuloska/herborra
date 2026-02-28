import { isPlatformBrowser } from '@angular/common';
import { Component, DestroyRef, Inject, PLATFORM_ID, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

type Lang = 'mk' | 'al';
const STORAGE_KEY = 'lang';
const SUPPORTED = new Set<Lang>(['mk', 'al']);

@Component({
  selector: 'app-header-component',
  standalone: true,
  imports: [RouterLink, TranslateModule],
  templateUrl: './header-component.html',
  styleUrl: './header-component.scss',
})
export class HeaderComponent {
  currentLang: Lang = 'mk';
  private currentSubPath = '';

  private readonly translate = inject(TranslateService);
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  ngOnInit() {
    this.syncFromUrl(this.router.url);

    this.router.events
      .pipe(
        filter((event): event is NavigationEnd => event instanceof NavigationEnd),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe((event) => {
        this.syncFromUrl(event.urlAfterRedirects);
      });
  }

  setLang(lang: Lang) {
    if (!SUPPORTED.has(lang)) return;

    const target = this.currentSubPath ? `/${lang}/${this.currentSubPath}` : `/${lang}`;

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(STORAGE_KEY, lang);
    }

    this.currentLang = lang;
    this.translate.use(lang);
    void this.router.navigateByUrl(target);
  }

  private syncFromUrl(url: string): void {
    const segments = url.split('?')[0].split('#')[0].split('/').filter(Boolean);
    const first = segments[0]?.toLowerCase();

    this.currentLang = first === 'al' ? 'al' : 'mk';
    this.currentSubPath = segments.slice(1).join('/');
    this.translate.use(this.currentLang);
  }
}
