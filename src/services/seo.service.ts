import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter, map, startWith } from 'rxjs';

type JsonLdType = 'LocalBusiness' | 'Product';

interface JsonLdConfig {
  type: JsonLdType;
  nameKey: string;
  descriptionKey?: string;
  image?: string;
  addressKey?: string;
  cityKey?: string;
  phoneKey?: string;
  brandName?: string;
}

export interface SeoRouteData {
  titleKey: string;
  descKey: string;
  canonicalPath: string;
  ogImage?: string;
  robots?: string;
  jsonLd?: JsonLdConfig;
}

@Injectable({ providedIn: 'root' })
export class SeoService 
{
  private readonly baseUrl = 'https://herborra.mk';
  private currentSeo?: SeoRouteData;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private title: Title,
    private meta: Meta,
    private translate: TranslateService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  init(): void 
  {
    const routeSeo$ = this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map(() => this.getDeepestRoute(this.route).snapshot.data?.['seo'] as SeoRouteData | undefined),
      startWith(this.getDeepestRoute(this.route).snapshot.data?.['seo'] as SeoRouteData | undefined)
    );

    routeSeo$.subscribe((seo) => {
      if (!seo) return;
      this.currentSeo = seo;
      this.applySeo(seo, this.resolveLang(this.translate.currentLang || this.translate.getBrowserLang()));
    });

    this.translate.onLangChange.subscribe((event) => {
      const lang = this.resolveLang(event.lang);
      this.setDocumentLang(lang);
      if (this.currentSeo) {
        this.applySeo(this.currentSeo, lang);
      }
    });

    this.setDocumentLang(this.resolveLang(this.translate.currentLang || this.translate.getBrowserLang()));
  }

  private applySeo(seo: SeoRouteData, lang: string): void {
    this.translate.get([seo.titleKey, seo.descKey]).subscribe((t) => {
      const title = t[seo.titleKey];
      const desc = t[seo.descKey];

      this.title.setTitle(title);
      this.setMeta('name', 'description', desc);

      const canonical = this.absUrl(seo.canonicalPath);
      this.setCanonical(canonical);

      this.setMeta('name', 'robots', seo.robots ?? 'index,follow');

      this.setMeta('property', 'og:title', title);
      this.setMeta('property', 'og:description', desc);
      this.setMeta('property', 'og:type', 'website');
      this.setMeta('property', 'og:url', canonical);
      if (seo.ogImage) {
        this.setMeta('property', 'og:image', this.absUrl(seo.ogImage));
      }

      this.setMeta('name', 'twitter:card', 'summary_large_image');
      this.setMeta('name', 'twitter:title', title);
      this.setMeta('name', 'twitter:description', desc);
      if (seo.ogImage) {
        this.setMeta('name', 'twitter:image', this.absUrl(seo.ogImage));
      }

      if (seo.jsonLd) {
        this.setJsonLd(this.buildJsonLd(seo.jsonLd));
      } else {
        this.removeJsonLd();
      }
    });
  }

  private buildJsonLd(config: JsonLdConfig): Record<string, unknown> {
    if (config.type === 'LocalBusiness') {
      return {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: this.translate.instant(config.nameKey),
        url: this.baseUrl,
        image: config.image ? this.absUrl(config.image) : undefined,
        address: {
          '@type': 'PostalAddress',
          streetAddress: config.addressKey ? this.translate.instant(config.addressKey) : undefined,
          addressLocality: config.cityKey ? this.translate.instant(config.cityKey) : undefined,
          addressCountry: 'MK'
        },
        telephone: config.phoneKey ? this.translate.instant(config.phoneKey) : undefined
      };
    }

    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: this.translate.instant(config.nameKey),
      description: config.descriptionKey ? this.translate.instant(config.descriptionKey) : undefined,
      image: config.image ? this.absUrl(config.image) : undefined,
      brand: config.brandName ? { '@type': 'Brand', name: config.brandName } : undefined
    };
  }

  private setMeta(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content });
  }

  private setCanonical(href: string): void {
    this.setLinkTag('canonical', href);
  }

  private setLinkTag(rel: string, href: string): void {
    let link = this.doc.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null;
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', rel);
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', href);
  }

  private setJsonLd(json: Record<string, unknown>): void {
    const id = 'seo-jsonld';
    let script = this.doc.getElementById(id) as HTMLScriptElement | null;
    if (!script) {
      script = this.doc.createElement('script');
      script.id = id;
      script.type = 'application/ld+json';
      this.doc.head.appendChild(script);
    }
    script.textContent = JSON.stringify(json);
  }

  private removeJsonLd(): void {
    const script = this.doc.getElementById('seo-jsonld');
    if (script?.parentNode) script.parentNode.removeChild(script);
  }

  private setDocumentLang(lang: string): void {
    this.doc.documentElement.lang = lang;
  }

  private absUrl(path: string): string {
    return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
  }

  private resolveLang(lang?: string | null): string {
    if (!lang) return 'mk';
    const lower = lang.toLowerCase();
    if (lower.startsWith('sq') || lower.startsWith('al')) return 'sq';
    return 'mk';
  }

  private getDeepestRoute(route: ActivatedRoute): ActivatedRoute {
    let current = route;
    while (current.firstChild) {
      current = current.firstChild;
    }
    return current;
  }
}
