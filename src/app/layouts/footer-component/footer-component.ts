import { Component, DestroyRef, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-footer-component',
  imports: [RouterLink, TranslateModule],
  standalone: true,
  templateUrl: './footer-component.html',
  styleUrl: './footer-component.scss'
})
export class FooterComponent {
  currentLang: 'mk' | 'al' = 'mk';
  private readonly router = inject(Router);
  private readonly destroyRef = inject(DestroyRef);

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

  private syncFromUrl(url: string): void {
    const segments = url.split('?')[0].split('#')[0].split('/').filter(Boolean);
    this.currentLang = segments[0]?.toLowerCase() === 'al' ? 'al' : 'mk';
  }
}
